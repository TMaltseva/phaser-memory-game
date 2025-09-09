class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  preload() {
    this.load.image("background", "assets/sprites/background.png");
    this.load.image("card", "assets/sprites/card.png");
    this.load.image("card1", "assets/sprites/card1.png");
    this.load.image("card2", "assets/sprites/card2.png");
    this.load.image("card3", "assets/sprites/card3.png");
    this.load.image("card4", "assets/sprites/card4.png");
    this.load.image("card5", "assets/sprites/card5.png");
  }

  create() {
    this.createBackground();
    this.createCards();
    this.openedCard = null;
  }

  createBackground() {
    this.add.sprite(0, 0, "background").setOrigin(0, 0);
  }

  createCards() {
    this.cards = [];
    let positions = this.getCardPositions();
    Phaser.Utils.Array.Shuffle(positions);

    for (let value of config.cards) {
      for (let i = 0; i < 2; i += 1) {
        this.cards.push(new Card(this, value, positions.pop()));
      }
    }

    this.input.on("gameobjectdown", this.onCardClicked, this);
  }

  getCardPositions() {
    let positions = [];
    let cardTexture = this.textures.get("card").getSourceImage();
    let cardWidth = cardTexture.width + 4;
    let cardHeight = cardTexture.height + 4;
    let offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2;
    let offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2;

    for (let row = 0; row < config.rows; row += 1) {
      for (let col = 0; col < config.cols; col += 1) {
        positions.push({
          x: offsetX + col * cardWidth,
          y: offsetY + row * cardHeight,
        });
      }
    }

    return positions;
  }

  onCardClicked(_pointer, card) {
    if (card.opened) return false;

    if (this.openedCard) {
      if (this.openedCard.value === card.value) {
        this.openedCard = null;
      } else {
        this.openedCard.close();
        this.openedCard = card;
      }
    } else {
      this.openedCard = card;
    }

    card.open();
  }
}
