import random
from typing import List, Optional, Tuple
from models.game import (
    Game, Player, Property, Turn, Transaction, 
    PlayerStatus, GameStatus, PropertyType, RollDiceResponse
)
from game.board import create_board
from game.cards import get_shuffled_cards

class GameEngine:
    def __init__(self, game: Game):
        self.game = game
        self.chance_deck = get_shuffled_cards("chance")
        self.community_deck = get_shuffled_cards("community_chest")
        self.chance_index = 0
        self.community_index = 0
    
    def initialize_game(self):
        """Initialise le plateau et les decks de cartes"""
        self.game.board = create_board()
        self.game.status = GameStatus.IN_PROGRESS
        self.shuffle_players()
    
    def shuffle_players(self):
        """Mélange l'ordre des joueurs"""
        random.shuffle(self.game.players)
    
    def roll_dice(self) -> Tuple[int, int]:
        """Lance deux dés"""
        return (random.randint(1, 6), random.randint(1, 6))
    
    def get_current_player(self) -> Optional[Player]:
        """Retourne le joueur actuel"""
        if not self.game.players:
            return None
        return self.game.players[self.game.current_turn % len(self.game.players)]
    
    def move_player(self, player: Player, steps: int) -> Tuple[int, bool]:
        """
        Déplace un joueur
        Retourne (nouvelle_position, a_passé_départ)
        """
        old_position = player.position
        new_position = (old_position + steps) % 40
        passed_go = new_position < old_position and steps > 0
        
        player.position = new_position
        
        if passed_go:
            self.add_money(player, 200)
            self.add_transaction(
                to_player=player.id,
                amount=200,
                reason="Passage par la case Départ"
            )
        
        return new_position, passed_go
    
    def handle_landing(self, player: Player) -> dict:
        """Gère l'arrivée d'un joueur sur une case"""
        position = player.position
        tile = self.game.board[position]
        
        result = {
            "tile": tile,
            "action_required": None,
            "message": ""
        }
        
        if tile.type == PropertyType.STREET:
            if tile.owner is None:
                result["action_required"] = "buy_or_auction"
                result["message"] = f"Voulez-vous acheter {tile.name} pour {tile.price}€ ?"
            elif tile.owner != player.id and not tile.is_mortgaged:
                rent = self.calculate_rent(tile, player)
                result["action_required"] = "pay_rent"
                result["message"] = f"Vous devez payer {rent}€ de loyer"
                result["rent"] = rent
        
        elif tile.type == PropertyType.STATION:
            if tile.owner is None:
                result["action_required"] = "buy_or_auction"
                result["message"] = f"Voulez-vous acheter {tile.name} pour {tile.price}€ ?"
            elif tile.owner != player.id and not tile.is_mortgaged:
                rent = self.calculate_station_rent(tile.owner)
                result["action_required"] = "pay_rent"
                result["message"] = f"Vous devez payer {rent}€ de loyer"
                result["rent"] = rent
        
        elif tile.type == PropertyType.UTILITY:
            if tile.owner is None:
                result["action_required"] = "buy_or_auction"
                result["message"] = f"Voulez-vous acheter {tile.name} pour {tile.price}€ ?"
            elif tile.owner != player.id and not tile.is_mortgaged:
                result["action_required"] = "pay_utility_rent"
                result["message"] = "Relancez les dés pour calculer le loyer"
        
        elif tile.name == "Impôts sur le revenu":
            result["action_required"] = "pay_tax"
            result["amount"] = 200
            result["message"] = "Payez 200€ d'impôts"
        
        elif tile.name == "Taxe de Luxe":
            result["action_required"] = "pay_tax"
            result["amount"] = 100
            result["message"] = "Payez 100€ de taxe de luxe"
        
        elif tile.name == "Chance":
            result["action_required"] = "draw_card"
            result["card_type"] = "chance"
            result["message"] = "Piochez une carte Chance"
        
        elif tile.name == "Caisse de Communauté":
            result["action_required"] = "draw_card"
            result["card_type"] = "community_chest"
            result["message"] = "Piochez une carte Caisse de Communauté"
        
        elif tile.name == "Allez en Prison":
            self.send_to_jail(player)
            result["message"] = "Allez en prison !"
        
        return result
    
    def calculate_rent(self, property: Property, player: Player) -> int:
        """Calcule le loyer d'une propriété"""
        if property.houses == 0:
            has_monopoly = self.has_monopoly(property.owner, property.color)
            base_rent = property.rent[0]
            return base_rent * 2 if has_monopoly else base_rent
        else:
            return property.rent[property.houses]
    
    def calculate_station_rent(self, owner_id: str) -> int:
        """Calcule le loyer d'une gare"""
        stations_owned = sum(
            1 for prop in self.game.board 
            if prop.type == PropertyType.STATION and prop.owner == owner_id
        )
        rent_table = [25, 50, 100, 200]
        return rent_table[stations_owned - 1] if stations_owned > 0 else 0
    
    def calculate_utility_rent(self, owner_id: str, dice_roll: int) -> int:
        """Calcule le loyer d'une compagnie"""
        utilities_owned = sum(
            1 for prop in self.game.board 
            if prop.type == PropertyType.UTILITY and prop.owner == owner_id
        )
        multiplier = 10 if utilities_owned == 2 else 4
        return dice_roll * multiplier
    
    def has_monopoly(self, player_id: str, color: str) -> bool:
        """Vérifie si un joueur a le monopole d'une couleur"""
        properties_of_color = [
            prop for prop in self.game.board 
            if prop.color == color and prop.type == PropertyType.STREET
        ]
        return all(prop.owner == player_id for prop in properties_of_color)
    
    def buy_property(self, player: Player, property_id: int) -> bool:
        """Achète une propriété"""
        property = self.game.board[property_id]
        
        if property.owner is not None:
            return False
        
        if player.money < property.price:
            return False
        
        player.money -= property.price
        property.owner = player.id
        player.properties.append(property_id)
        
        self.add_transaction(
            from_player=player.id,
            amount=property.price,
            reason=f"Achat de {property.name}"
        )
        
        return True
    
    def pay_rent(self, from_player: Player, to_player_id: str, amount: int):
        """Paye un loyer"""
        to_player = self.get_player_by_id(to_player_id)
        if not to_player:
            return
        
        actual_amount = min(amount, from_player.money)
        from_player.money -= actual_amount
        to_player.money += actual_amount
        
        self.add_transaction(
            from_player=from_player.id,
            to_player=to_player_id,
            amount=actual_amount,
            reason="Paiement de loyer"
        )
        
        if from_player.money <= 0:
            self.declare_bankruptcy(from_player, to_player)
    
    def add_money(self, player: Player, amount: int):
        """Ajoute de l'argent à un joueur"""
        player.money += amount
    
    def remove_money(self, player: Player, amount: int):
        """Retire de l'argent à un joueur"""
        player.money -= amount
        if player.money < 0:
            self.declare_bankruptcy(player, None)
    
    def send_to_jail(self, player: Player):
        """Envoie un joueur en prison"""
        player.position = 10
        player.status = PlayerStatus.IN_JAIL
        player.jail_turns = 0
    
    def release_from_jail(self, player: Player):
        """Libère un joueur de prison"""
        player.status = PlayerStatus.ACTIVE
        player.jail_turns = 0
    
    def declare_bankruptcy(self, player: Player, creditor: Optional[Player]):
        """Déclare un joueur en faillite"""
        player.status = PlayerStatus.BANKRUPT
        
        for prop_id in player.properties:
            prop = self.game.board[prop_id]
            if creditor:
                prop.owner = creditor.id
                creditor.properties.append(prop_id)
            else:
                prop.owner = None
                prop.houses = 0
                prop.is_mortgaged = False
        
        player.properties = []
        
        active_players = [p for p in self.game.players if p.status != PlayerStatus.BANKRUPT]
        if len(active_players) == 1:
            self.game.status = GameStatus.FINISHED
            self.game.winner_id = active_players[0].id
    
    def next_turn(self):
        """Passe au tour suivant"""
        self.game.current_turn += 1
        
        while True:
            current_player = self.get_current_player()
            if current_player and current_player.status != PlayerStatus.BANKRUPT:
                break
            self.game.current_turn += 1
    
    def get_player_by_id(self, player_id: str) -> Optional[Player]:
        """Récupère un joueur par son ID"""
        for player in self.game.players:
            if player.id == player_id:
                return player
        return None
    
    def add_transaction(self, amount: int, reason: str, 
                       from_player: Optional[str] = None, 
                       to_player: Optional[str] = None):
        """Ajoute une transaction à l'historique"""
        transaction = Transaction(
            from_player=from_player,
            to_player=to_player,
            amount=amount,
            reason=reason
        )
        self.game.transactions.append(transaction)
    
    def build_house(self, player: Player, property_id: int) -> bool:
        """Construit une maison"""
        property = self.game.board[property_id]
        
        if property.owner != player.id:
            return False
        
        if not self.has_monopoly(player.id, property.color):
            return False
        
        if property.houses >= 5:
            return False
        
        if player.money < property.house_cost:
            return False
        
        player.money -= property.house_cost
        property.houses += 1
        
        self.add_transaction(
            from_player=player.id,
            amount=property.house_cost,
            reason=f"Construction sur {property.name}"
        )
        
        return True
    
    def mortgage_property(self, player: Player, property_id: int) -> bool:
        """Hypothèque une propriété"""
        property = self.game.board[property_id]
        
        if property.owner != player.id:
            return False
        
        if property.is_mortgaged:
            return False
        
        if property.houses > 0:
            return False
        
        property.is_mortgaged = True
        player.money += property.mortgage_value
        
        self.add_transaction(
            to_player=player.id,
            amount=property.mortgage_value,
            reason=f"Hypothèque de {property.name}"
        )
        
        return True
