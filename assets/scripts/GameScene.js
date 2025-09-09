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
    this.createText();
    this.createCards();
    this.start();
  }

  createText() {
    this.timeoutText = this.add.text(20, 330, "Time:", {
      font: "36px GardenFlower",
      fill: "#ffffff",
    });
  }

  start() {
    this.openedCard = null;
    this.openedCardsCount = 0;
    this.initCards();
  }

  initCards() {
    let positions = this.getCardsPositions();

    this.cards.forEach((card) => {
      let position = positions.pop();
      card.close();
      card.setPosition(position.x, position.y);
    });
  }

  createBackground() {
    this.add.sprite(0, 0, "background").setOrigin(0, 0);
  }

  createCards() {
    this.cards = [];

    for (let value of config.cards) {
      for (let i = 0; i < 2; i += 1) {
        this.cards.push(new Card(this, value));
      }
    }

    this.input.on("gameobjectdown", this.onCardClicked, this);
  }

  getCardsPositions() {
    let positions = [];
    let cardTexture = this.textures.get("card").getSourceImage();
    let cardWidth = cardTexture.width + 4;
    let cardHeight = cardTexture.height + 4;
    let offsetX =
      (this.sys.game.config.width - cardWidth * config.cols) / 2 +
      cardWidth / 2;
    let offsetY =
      (this.sys.game.config.height - cardHeight * config.rows) / 2 +
      cardHeight / 2;

    for (let row = 0; row < config.rows; row += 1) {
      for (let col = 0; col < config.cols; col += 1) {
        positions.push({
          x: offsetX + col * cardWidth,
          y: offsetY + row * cardHeight,
        });
      }
    }

    return Phaser.Utils.Array.Shuffle(positions);
  }

  onCardClicked(_pointer, card) {
    if (card.opened) return false;

    if (this.openedCard) {
      if (this.openedCard.value === card.value) {
        this.openedCard = null;
        this.openedCardsCount += 1;
      } else {
        this.openedCard.close();
        this.openedCard = card;
      }
    } else {
      this.openedCard = card;
    }

    card.open();

    if (this.openedCardsCount === this.cards.length / 2) {
      this.start();
    }
  }
}
