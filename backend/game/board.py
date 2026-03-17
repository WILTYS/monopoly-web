from models.game import Property, PropertyType, PropertyColor

def create_board() -> list[Property]:
    """Crée le plateau de jeu avec toutes les cases"""
    
    board = [
        Property(
            id=0,
            name="Départ",
            type=PropertyType.SPECIAL,
            color=PropertyColor.NONE,
            price=0,
            rent=[],
            mortgage_value=0
        ),
        Property(
            id=1,
            name="Boulevard de Belleville",
            type=PropertyType.STREET,
            color=PropertyColor.BROWN,
            price=60,
            rent=[2, 10, 30, 90, 160, 250],
            house_cost=50,
            mortgage_value=30
        ),
        Property(
            id=2,
            name="Caisse de Communauté",
            type=PropertyType.SPECIAL,
            color=PropertyColor.NONE,
            price=0,
            rent=[],
            mortgage_value=0
        ),
        Property(
            id=3,
            name="Rue Lecourbe",
            type=PropertyType.STREET,
            color=PropertyColor.BROWN,
            price=60,
            rent=[4, 20, 60, 180, 320, 450],
            house_cost=50,
            mortgage_value=30
        ),
        Property(
            id=4,
            name="Impôts sur le revenu",
            type=PropertyType.SPECIAL,
            color=PropertyColor.NONE,
            price=0,
            rent=[],
            mortgage_value=0
        ),
        Property(
            id=5,
            name="Gare Montparnasse",
            type=PropertyType.STATION,
            color=PropertyColor.STATION,
            price=200,
            rent=[25, 50, 100, 200],
            mortgage_value=100
        ),
        Property(
            id=6,
            name="Rue de Vaugirard",
            type=PropertyType.STREET,
            color=PropertyColor.LIGHT_BLUE,
            price=100,
            rent=[6, 30, 90, 270, 400, 550],
            house_cost=50,
            mortgage_value=50
        ),
        Property(
            id=7,
            name="Chance",
            type=PropertyType.SPECIAL,
            color=PropertyColor.NONE,
            price=0,
            rent=[],
            mortgage_value=0
        ),
        Property(
            id=8,
            name="Rue de Courcelles",
            type=PropertyType.STREET,
            color=PropertyColor.LIGHT_BLUE,
            price=100,
            rent=[6, 30, 90, 270, 400, 550],
            house_cost=50,
            mortgage_value=50
        ),
        Property(
            id=9,
            name="Avenue de la République",
            type=PropertyType.STREET,
            color=PropertyColor.LIGHT_BLUE,
            price=120,
            rent=[8, 40, 100, 300, 450, 600],
            house_cost=50,
            mortgage_value=60
        ),
        Property(
            id=10,
            name="Simple Visite / Prison",
            type=PropertyType.SPECIAL,
            color=PropertyColor.NONE,
            price=0,
            rent=[],
            mortgage_value=0
        ),
        Property(
            id=11,
            name="Boulevard de la Villette",
            type=PropertyType.STREET,
            color=PropertyColor.PINK,
            price=140,
            rent=[10, 50, 150, 450, 625, 750],
            house_cost=100,
            mortgage_value=70
        ),
        Property(
            id=12,
            name="Compagnie d'Électricité",
            type=PropertyType.UTILITY,
            color=PropertyColor.UTILITY,
            price=150,
            rent=[],
            mortgage_value=75
        ),
        Property(
            id=13,
            name="Avenue de Neuilly",
            type=PropertyType.STREET,
            color=PropertyColor.PINK,
            price=140,
            rent=[10, 50, 150, 450, 625, 750],
            house_cost=100,
            mortgage_value=70
        ),
        Property(
            id=14,
            name="Rue de Paradis",
            type=PropertyType.STREET,
            color=PropertyColor.PINK,
            price=160,
            rent=[12, 60, 180, 500, 700, 900],
            house_cost=100,
            mortgage_value=80
        ),
        Property(
            id=15,
            name="Gare de Lyon",
            type=PropertyType.STATION,
            color=PropertyColor.STATION,
            price=200,
            rent=[25, 50, 100, 200],
            mortgage_value=100
        ),
        Property(
            id=16,
            name="Avenue Mozart",
            type=PropertyType.STREET,
            color=PropertyColor.ORANGE,
            price=180,
            rent=[14, 70, 200, 550, 750, 950],
            house_cost=100,
            mortgage_value=90
        ),
        Property(
            id=17,
            name="Caisse de Communauté",
            type=PropertyType.SPECIAL,
            color=PropertyColor.NONE,
            price=0,
            rent=[],
            mortgage_value=0
        ),
        Property(
            id=18,
            name="Boulevard Saint-Michel",
            type=PropertyType.STREET,
            color=PropertyColor.ORANGE,
            price=180,
            rent=[14, 70, 200, 550, 750, 950],
            house_cost=100,
            mortgage_value=90
        ),
        Property(
            id=19,
            name="Place Pigalle",
            type=PropertyType.STREET,
            color=PropertyColor.ORANGE,
            price=200,
            rent=[16, 80, 220, 600, 800, 1000],
            house_cost=100,
            mortgage_value=100
        ),
        Property(
            id=20,
            name="Parc Gratuit",
            type=PropertyType.SPECIAL,
            color=PropertyColor.NONE,
            price=0,
            rent=[],
            mortgage_value=0
        ),
        Property(
            id=21,
            name="Avenue Matignon",
            type=PropertyType.STREET,
            color=PropertyColor.RED,
            price=220,
            rent=[18, 90, 250, 700, 875, 1050],
            house_cost=150,
            mortgage_value=110
        ),
        Property(
            id=22,
            name="Chance",
            type=PropertyType.SPECIAL,
            color=PropertyColor.NONE,
            price=0,
            rent=[],
            mortgage_value=0
        ),
        Property(
            id=23,
            name="Boulevard Malesherbes",
            type=PropertyType.STREET,
            color=PropertyColor.RED,
            price=220,
            rent=[18, 90, 250, 700, 875, 1050],
            house_cost=150,
            mortgage_value=110
        ),
        Property(
            id=24,
            name="Avenue Henri-Martin",
            type=PropertyType.STREET,
            color=PropertyColor.RED,
            price=240,
            rent=[20, 100, 300, 750, 925, 1100],
            house_cost=150,
            mortgage_value=120
        ),
        Property(
            id=25,
            name="Gare du Nord",
            type=PropertyType.STATION,
            color=PropertyColor.STATION,
            price=200,
            rent=[25, 50, 100, 200],
            mortgage_value=100
        ),
        Property(
            id=26,
            name="Faubourg Saint-Honoré",
            type=PropertyType.STREET,
            color=PropertyColor.YELLOW,
            price=260,
            rent=[22, 110, 330, 800, 975, 1150],
            house_cost=150,
            mortgage_value=130
        ),
        Property(
            id=27,
            name="Place de la Bourse",
            type=PropertyType.STREET,
            color=PropertyColor.YELLOW,
            price=260,
            rent=[22, 110, 330, 800, 975, 1150],
            house_cost=150,
            mortgage_value=130
        ),
        Property(
            id=28,
            name="Compagnie des Eaux",
            type=PropertyType.UTILITY,
            color=PropertyColor.UTILITY,
            price=150,
            rent=[],
            mortgage_value=75
        ),
        Property(
            id=29,
            name="Rue La Fayette",
            type=PropertyType.STREET,
            color=PropertyColor.YELLOW,
            price=280,
            rent=[24, 120, 360, 850, 1025, 1200],
            house_cost=150,
            mortgage_value=140
        ),
        Property(
            id=30,
            name="Allez en Prison",
            type=PropertyType.SPECIAL,
            color=PropertyColor.NONE,
            price=0,
            rent=[],
            mortgage_value=0
        ),
        Property(
            id=31,
            name="Avenue de Breteuil",
            type=PropertyType.STREET,
            color=PropertyColor.GREEN,
            price=300,
            rent=[26, 130, 390, 900, 1100, 1275],
            house_cost=200,
            mortgage_value=150
        ),
        Property(
            id=32,
            name="Avenue Foch",
            type=PropertyType.STREET,
            color=PropertyColor.GREEN,
            price=300,
            rent=[26, 130, 390, 900, 1100, 1275],
            house_cost=200,
            mortgage_value=150
        ),
        Property(
            id=33,
            name="Caisse de Communauté",
            type=PropertyType.SPECIAL,
            color=PropertyColor.NONE,
            price=0,
            rent=[],
            mortgage_value=0
        ),
        Property(
            id=34,
            name="Boulevard des Capucines",
            type=PropertyType.STREET,
            color=PropertyColor.GREEN,
            price=320,
            rent=[28, 150, 450, 1000, 1200, 1400],
            house_cost=200,
            mortgage_value=160
        ),
        Property(
            id=35,
            name="Gare Saint-Lazare",
            type=PropertyType.STATION,
            color=PropertyColor.STATION,
            price=200,
            rent=[25, 50, 100, 200],
            mortgage_value=100
        ),
        Property(
            id=36,
            name="Chance",
            type=PropertyType.SPECIAL,
            color=PropertyColor.NONE,
            price=0,
            rent=[],
            mortgage_value=0
        ),
        Property(
            id=37,
            name="Avenue des Champs-Élysées",
            type=PropertyType.STREET,
            color=PropertyColor.DARK_BLUE,
            price=350,
            rent=[35, 175, 500, 1100, 1300, 1500],
            house_cost=200,
            mortgage_value=175
        ),
        Property(
            id=38,
            name="Taxe de Luxe",
            type=PropertyType.SPECIAL,
            color=PropertyColor.NONE,
            price=0,
            rent=[],
            mortgage_value=0
        ),
        Property(
            id=39,
            name="Rue de la Paix",
            type=PropertyType.STREET,
            color=PropertyColor.DARK_BLUE,
            price=400,
            rent=[50, 200, 600, 1400, 1700, 2000],
            house_cost=200,
            mortgage_value=200
        ),
    ]
    
    return board
