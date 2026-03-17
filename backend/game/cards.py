from typing import List, Dict

CHANCE_CARDS = [
    {
        "id": 1,
        "text": "Avancez jusqu'à la case Départ",
        "action": "move_to",
        "position": 0
    },
    {
        "id": 2,
        "text": "Avancez jusqu'à la Rue de la Paix",
        "action": "move_to",
        "position": 39
    },
    {
        "id": 3,
        "text": "Avancez jusqu'à l'Avenue Henri-Martin",
        "action": "move_to",
        "position": 24
    },
    {
        "id": 4,
        "text": "Avancez jusqu'à la gare la plus proche",
        "action": "move_to_nearest",
        "type": "station"
    },
    {
        "id": 5,
        "text": "Avancez jusqu'à la compagnie la plus proche",
        "action": "move_to_nearest",
        "type": "utility"
    },
    {
        "id": 6,
        "text": "La banque vous verse un dividende de 50€",
        "action": "receive_money",
        "amount": 50
    },
    {
        "id": 7,
        "text": "Vous êtes libéré de prison",
        "action": "get_out_of_jail_free",
        "keep": True
    },
    {
        "id": 8,
        "text": "Reculez de 3 cases",
        "action": "move_relative",
        "steps": -3
    },
    {
        "id": 9,
        "text": "Allez en prison",
        "action": "go_to_jail"
    },
    {
        "id": 10,
        "text": "Faites des réparations: 25€ par maison, 100€ par hôtel",
        "action": "pay_repairs",
        "house_cost": 25,
        "hotel_cost": 100
    },
    {
        "id": 11,
        "text": "Amende de 15€",
        "action": "pay_money",
        "amount": 15
    },
    {
        "id": 12,
        "text": "Rendez-vous à la Gare de Lyon",
        "action": "move_to",
        "position": 15
    },
    {
        "id": 13,
        "text": "Vous êtes imposé: 40€ par maison, 115€ par hôtel",
        "action": "pay_repairs",
        "house_cost": 40,
        "hotel_cost": 115
    },
    {
        "id": 14,
        "text": "Avancez jusqu'à Boulevard de la Villette",
        "action": "move_to",
        "position": 11
    },
    {
        "id": 15,
        "text": "Votre immeuble rapporte 150€",
        "action": "receive_money",
        "amount": 150
    },
    {
        "id": 16,
        "text": "Vous gagnez le prix de mots croisés: 100€",
        "action": "receive_money",
        "amount": 100
    }
]

COMMUNITY_CHEST_CARDS = [
    {
        "id": 1,
        "text": "Avancez jusqu'à la case Départ",
        "action": "move_to",
        "position": 0
    },
    {
        "id": 2,
        "text": "Erreur de la banque en votre faveur: 200€",
        "action": "receive_money",
        "amount": 200
    },
    {
        "id": 3,
        "text": "Payez la note du médecin: 50€",
        "action": "pay_money",
        "amount": 50
    },
    {
        "id": 4,
        "text": "La vente de votre stock vous rapporte 50€",
        "action": "receive_money",
        "amount": 50
    },
    {
        "id": 5,
        "text": "Vous êtes libéré de prison",
        "action": "get_out_of_jail_free",
        "keep": True
    },
    {
        "id": 6,
        "text": "Allez en prison",
        "action": "go_to_jail"
    },
    {
        "id": 7,
        "text": "Recevez votre revenu annuel: 100€",
        "action": "receive_money",
        "amount": 100
    },
    {
        "id": 8,
        "text": "C'est votre anniversaire: chaque joueur vous donne 10€",
        "action": "birthday",
        "amount_per_player": 10
    },
    {
        "id": 9,
        "text": "Remboursement d'impôt: 20€",
        "action": "receive_money",
        "amount": 20
    },
    {
        "id": 10,
        "text": "Payez une amende de 10€",
        "action": "pay_money",
        "amount": 10
    },
    {
        "id": 11,
        "text": "Payez votre police d'assurance: 50€",
        "action": "pay_money",
        "amount": 50
    },
    {
        "id": 12,
        "text": "Honoraires du médecin: 50€",
        "action": "pay_money",
        "amount": 50
    },
    {
        "id": 13,
        "text": "Vous héritez de 100€",
        "action": "receive_money",
        "amount": 100
    },
    {
        "id": 14,
        "text": "Vous gagnez le deuxième prix de beauté: 10€",
        "action": "receive_money",
        "amount": 10
    },
    {
        "id": 15,
        "text": "Vous avez gagné à la loterie: 100€",
        "action": "receive_money",
        "amount": 100
    },
    {
        "id": 16,
        "text": "Frais de scolarité: 50€",
        "action": "pay_money",
        "amount": 50
    }
]

def get_shuffled_cards(card_type: str) -> List[Dict]:
    """Retourne un deck mélangé de cartes"""
    import random
    cards = CHANCE_CARDS if card_type == "chance" else COMMUNITY_CHEST_CARDS
    shuffled = cards.copy()
    random.shuffle(shuffled)
    return shuffled
