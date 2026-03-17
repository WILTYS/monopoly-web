from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum
from datetime import datetime

class PropertyType(str, Enum):
    STREET = "street"
    STATION = "station"
    UTILITY = "utility"
    SPECIAL = "special"

class PropertyColor(str, Enum):
    BROWN = "brown"
    LIGHT_BLUE = "light_blue"
    PINK = "pink"
    ORANGE = "orange"
    RED = "red"
    YELLOW = "yellow"
    GREEN = "green"
    DARK_BLUE = "dark_blue"
    STATION = "station"
    UTILITY = "utility"
    NONE = "none"

class CardType(str, Enum):
    CHANCE = "chance"
    COMMUNITY_CHEST = "community_chest"

class PlayerStatus(str, Enum):
    ACTIVE = "active"
    IN_JAIL = "in_jail"
    BANKRUPT = "bankrupt"

class GameStatus(str, Enum):
    WAITING = "waiting"
    IN_PROGRESS = "in_progress"
    FINISHED = "finished"

class Property(BaseModel):
    id: int
    name: str
    type: PropertyType
    color: PropertyColor
    price: int
    rent: List[int]
    house_cost: Optional[int] = None
    hotel_cost: Optional[int] = None
    mortgage_value: int
    owner: Optional[str] = None
    houses: int = 0
    is_mortgaged: bool = False

class Player(BaseModel):
    id: str
    name: str
    avatar: str = "🎩"
    color: str = "#FF6B6B"
    position: int = 0
    money: int = 1500
    properties: List[int] = []
    get_out_of_jail_cards: int = 0
    status: PlayerStatus = PlayerStatus.ACTIVE
    jail_turns: int = 0
    is_connected: bool = True
    last_roll: Optional[List[int]] = None

class Turn(BaseModel):
    player_id: str
    dice: List[int]
    doubles_count: int = 0
    actions: List[str] = []

class Transaction(BaseModel):
    from_player: Optional[str] = None
    to_player: Optional[str] = None
    amount: int
    reason: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Game(BaseModel):
    id: str
    room_code: str
    host_id: str
    players: List[Player] = []
    current_turn: int = 0
    status: GameStatus = GameStatus.WAITING
    board: List[Property] = []
    turn_history: List[Turn] = []
    transactions: List[Transaction] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    winner_id: Optional[str] = None
    max_players: int = 6
    settings: Dict = {}

class GameAction(BaseModel):
    type: str
    player_id: str
    data: Dict = {}

class RollDiceResponse(BaseModel):
    dice: List[int]
    total: int
    is_double: bool
    new_position: int
    passed_go: bool
