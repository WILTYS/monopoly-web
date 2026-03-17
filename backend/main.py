from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import Dict, List
import socketio
import uvicorn
import uuid
from datetime import datetime

from config import settings
from models.game import Game, Player, GameStatus, PlayerStatus, RollDiceResponse
from game.engine import GameEngine
from game.board import create_board

games: Dict[str, GameEngine] = {}
active_connections: Dict[str, List[WebSocket]] = {}

sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=settings.get_cors_origins_list()
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    
app = FastAPI(
    title="Monopoly API",
    description="Backend API pour Monopoly Web",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

socket_app = socketio.ASGIApp(sio, app)

@app.get("/")
async def root():
    return {
        "name": "Monopoly API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/games/create")
async def create_game(host_name: str, max_players: int = 6):
    """Crée une nouvelle partie"""
    game_id = str(uuid.uuid4())
    room_code = ''.join([str(uuid.uuid4().hex[:6]).upper()])
    
    host_player = Player(
        id=str(uuid.uuid4()),
        name=host_name,
        avatar="🎩",
        color="#FF6B6B"
    )
    
    game = Game(
        id=game_id,
        room_code=room_code,
        host_id=host_player.id,
        players=[host_player],
        max_players=max_players,
        board=create_board()
    )
    
    engine = GameEngine(game)
    games[game_id] = engine
    active_connections[game_id] = []
    
    return {
        "game_id": game_id,
        "room_code": room_code,
        "host_id": host_player.id,
        "game": game.model_dump()
    }

@app.post("/games/{game_id}/join")
async def join_game(game_id: str, player_name: str):
    """Rejoint une partie existante"""
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Partie non trouvée")
    
    engine = games[game_id]
    game = engine.game
    
    if game.status != GameStatus.WAITING:
        raise HTTPException(status_code=400, detail="La partie a déjà commencé")
    
    if len(game.players) >= game.max_players:
        raise HTTPException(status_code=400, detail="Partie complète")
    
    colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F"]
    avatars = ["🎩", "🚗", "🐕", "🚢", "🎸", "👢"]
    
    used_colors = [p.color for p in game.players]
    available_colors = [c for c in colors if c not in used_colors]
    
    used_avatars = [p.avatar for p in game.players]
    available_avatars = [a for a in avatars if a not in used_avatars]
    
    new_player = Player(
        id=str(uuid.uuid4()),
        name=player_name,
        avatar=available_avatars[0] if available_avatars else "🎲",
        color=available_colors[0] if available_colors else "#95A5A6"
    )
    
    game.players.append(new_player)
    
    await sio.emit('player_joined', {
        'player': new_player.model_dump(),
        'total_players': len(game.players)
    }, room=game_id)
    
    return {
        "player_id": new_player.id,
        "game": game.model_dump()
    }

@app.post("/games/{game_id}/start")
async def start_game(game_id: str, player_id: str):
    """Démarre la partie"""
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Partie non trouvée")
    
    engine = games[game_id]
    game = engine.game
    
    if player_id != game.host_id:
        raise HTTPException(status_code=403, detail="Seul l'hôte peut démarrer")
    
    if len(game.players) < 2:
        raise HTTPException(status_code=400, detail="Minimum 2 joueurs requis")
    
    engine.initialize_game()
    game.started_at = datetime.utcnow()
    
    await sio.emit('game_started', {
        'game': game.model_dump(),
        'current_player': engine.get_current_player().model_dump()
    }, room=game_id)
    
    return {"status": "started", "game": game.model_dump()}

@app.post("/games/{game_id}/roll")
async def roll_dice(game_id: str, player_id: str):
    """Lance les dés"""
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Partie non trouvée")
    
    engine = games[game_id]
    current_player = engine.get_current_player()
    
    if not current_player or current_player.id != player_id:
        raise HTTPException(status_code=400, detail="Ce n'est pas votre tour")
    
    if current_player.status == PlayerStatus.IN_JAIL:
        raise HTTPException(status_code=400, detail="Vous êtes en prison")
    
    dice = engine.roll_dice()
    total = sum(dice)
    is_double = dice[0] == dice[1]
    
    old_position = current_player.position
    new_position, passed_go = engine.move_player(current_player, total)
    
    current_player.last_roll = list(dice)
    
    landing_result = engine.handle_landing(current_player)
    
    response = RollDiceResponse(
        dice=list(dice),
        total=total,
        is_double=is_double,
        new_position=new_position,
        passed_go=passed_go
    )
    
    await sio.emit('dice_rolled', {
        'player_id': player_id,
        'roll': response.model_dump(),
        'landing': landing_result,
        'game': engine.game.model_dump()
    }, room=game_id)
    
    return {
        "roll": response.model_dump(),
        "landing": landing_result
    }

@app.post("/games/{game_id}/buy")
async def buy_property(game_id: str, player_id: str, property_id: int):
    """Achète une propriété"""
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Partie non trouvée")
    
    engine = games[game_id]
    player = engine.get_player_by_id(player_id)
    
    if not player:
        raise HTTPException(status_code=404, detail="Joueur non trouvé")
    
    success = engine.buy_property(player, property_id)
    
    if not success:
        raise HTTPException(status_code=400, detail="Impossible d'acheter cette propriété")
    
    await sio.emit('property_bought', {
        'player_id': player_id,
        'property_id': property_id,
        'game': engine.game.model_dump()
    }, room=game_id)
    
    return {"status": "success", "game": engine.game.model_dump()}

@app.post("/games/{game_id}/end-turn")
async def end_turn(game_id: str, player_id: str):
    """Termine le tour"""
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Partie non trouvée")
    
    engine = games[game_id]
    current_player = engine.get_current_player()
    
    if not current_player or current_player.id != player_id:
        raise HTTPException(status_code=400, detail="Ce n'est pas votre tour")
    
    engine.next_turn()
    new_current = engine.get_current_player()
    
    await sio.emit('turn_ended', {
        'previous_player': player_id,
        'current_player': new_current.model_dump() if new_current else None,
        'game': engine.game.model_dump()
    }, room=game_id)
    
    return {
        "current_player": new_current.model_dump() if new_current else None
    }

@app.get("/games/{game_id}")
async def get_game(game_id: str):
    """Récupère l'état d'une partie"""
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Partie non trouvée")
    
    engine = games[game_id]
    return engine.game.model_dump()

@app.get("/games/code/{room_code}")
async def get_game_by_code(room_code: str):
    """Trouve une partie par son code"""
    for game_id, engine in games.items():
        if engine.game.room_code == room_code:
            return {
                "game_id": game_id,
                "game": engine.game.model_dump()
            }
    
    raise HTTPException(status_code=404, detail="Partie non trouvée")

@sio.event
async def connect(sid, environ):
    print(f"Client connecté: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client déconnecté: {sid}")

@sio.event
async def join_room(sid, data):
    game_id = data.get('game_id')
    player_id = data.get('player_id')
    
    if game_id in games:
        sio.enter_room(sid, game_id)
        await sio.emit('joined_room', {
            'game_id': game_id,
            'player_id': player_id
        }, room=sid)

@sio.event
async def leave_room(sid, data):
    game_id = data.get('game_id')
    if game_id:
        sio.leave_room(sid, game_id)

@sio.event
async def send_message(sid, data):
    game_id = data.get('game_id')
    message = data.get('message')
    player_name = data.get('player_name')
    
    if game_id in games:
        await sio.emit('chat_message', {
            'player_name': player_name,
            'message': message,
            'timestamp': datetime.utcnow().isoformat()
        }, room=game_id)

if __name__ == "__main__":
    uvicorn.run(
        "main:socket_app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
