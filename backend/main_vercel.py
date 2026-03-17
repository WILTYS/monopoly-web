"""
Backend FastAPI simplifié pour Vercel (sans WebSocket)
Utilise polling HTTP pour le temps réel
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
from contextlib import asynccontextmanager
import random
import string

from config import settings
from models.game import Game, Player, GameStatus, PlayerStatus, RollDiceResponse
from game.engine import GameEngine
from game.board import create_board

# Stockage en mémoire
games: Dict[str, GameEngine] = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    
app = FastAPI(
    title="Monopoly API",
    description="Backend API pour Monopoly Web (Vercel)",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vercel gère CORS
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_room_code() -> str:
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@app.get("/")
async def root():
    return {
        "message": "Monopoly API - Vercel Edition",
        "version": "1.0.0",
        "websocket": False,
        "polling": True
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "games_active": len(games)
    }

@app.post("/games/create")
async def create_game(host_name: str, max_players: int = 6):
    room_code = generate_room_code()
    board = create_board()
    
    host_player = Player(
        id=f"player_{random.randint(1000, 9999)}",
        name=host_name,
        money=1500,
        position=0,
        properties=[],
        status=PlayerStatus.ACTIVE,
        is_host=True,
        color=f"#{random.randint(0, 0xFFFFFF):06x}",
        avatar="🎩"
    )
    
    game = Game(
        id=room_code,
        room_code=room_code,
        players=[host_player],
        board=board,
        status=GameStatus.WAITING,
        current_turn=0,
        max_players=max_players
    )
    
    engine = GameEngine(game)
    games[room_code] = engine
    
    return {
        "game": engine.game.model_dump(),
        "player_id": host_player.id
    }

@app.post("/games/{game_id}/join")
async def join_game(game_id: str, player_name: str):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Partie non trouvée")
    
    engine = games[game_id]
    
    if engine.game.status != GameStatus.WAITING:
        raise HTTPException(status_code=400, detail="La partie a déjà commencé")
    
    if len(engine.game.players) >= engine.game.max_players:
        raise HTTPException(status_code=400, detail="Partie complète")
    
    new_player = Player(
        id=f"player_{random.randint(1000, 9999)}",
        name=player_name,
        money=1500,
        position=0,
        properties=[],
        status=PlayerStatus.ACTIVE,
        is_host=False,
        color=f"#{random.randint(0, 0xFFFFFF):06x}",
        avatar=random.choice(["🎩", "🚗", "🐕", "⛵", "🎸", "👞"])
    )
    
    engine.game.players.append(new_player)
    
    return {
        "game": engine.game.model_dump(),
        "player_id": new_player.id
    }

@app.get("/games/{game_id}")
async def get_game(game_id: str):
    """Endpoint de polling pour obtenir l'état du jeu"""
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Partie non trouvée")
    
    engine = games[game_id]
    return {"game": engine.game.model_dump()}

@app.post("/games/{game_id}/start")
async def start_game(game_id: str, player_id: str):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Partie non trouvée")
    
    engine = games[game_id]
    
    host = next((p for p in engine.game.players if p.is_host), None)
    if not host or host.id != player_id:
        raise HTTPException(status_code=403, detail="Seul l'hôte peut démarrer")
    
    if len(engine.game.players) < 2:
        raise HTTPException(status_code=400, detail="Minimum 2 joueurs requis")
    
    engine.game.status = GameStatus.IN_PROGRESS
    
    return {"game": engine.game.model_dump()}

@app.post("/games/{game_id}/roll")
async def roll_dice(game_id: str, player_id: str):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Partie non trouvée")
    
    engine = games[game_id]
    
    current_player = engine.game.players[engine.game.current_turn % len(engine.game.players)]
    if current_player.id != player_id:
        raise HTTPException(status_code=400, detail="Pas votre tour")
    
    result = engine.roll_dice(player_id)
    
    return {
        "game": engine.game.model_dump(),
        "roll": result
    }

@app.post("/games/{game_id}/buy")
async def buy_property(game_id: str, player_id: str, property_id: int):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Partie non trouvée")
    
    engine = games[game_id]
    
    try:
        engine.buy_property(player_id, property_id)
        return {"game": engine.game.model_dump()}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/games/{game_id}/end-turn")
async def end_turn(game_id: str, player_id: str):
    if game_id not in games:
        raise HTTPException(status_code=404, detail="Partie non trouvée")
    
    engine = games[game_id]
    
    current_player = engine.game.players[engine.game.current_turn % len(engine.game.players)]
    if current_player.id != player_id:
        raise HTTPException(status_code=400, detail="Pas votre tour")
    
    engine.next_turn()
    
    return {"game": engine.game.model_dump()}

@app.delete("/games/{game_id}")
async def delete_game(game_id: str):
    if game_id in games:
        del games[game_id]
    return {"message": "Partie supprimée"}

# Pour Vercel
app = app
