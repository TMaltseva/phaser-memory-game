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
    this.load.audio("theme", "assets/sounds/theme.mp3");
    this.load.audio("card", "assets/sounds/card.mp3");
    this.load.audio("success", "assets/sounds/success.mp3");
    this.load.audio("complete", "assets/sounds/complete.mp3");
    this.load.audio("timeout", "assets/sounds/timeout.mp3");
    this.load.image("modalBg", "assets/sprites/modal-bg.png");
  }

  getCurrentLevel() {
    return config.levels[config.currentLevel - 1];
  }

  nextLevel() {
    this.timer.paused = true;
    this.cleanupPointsAnimations();

    this.totalScore += this.levelScore;
    this.scoreText.setText("Score: " + this.totalScore);

    if (config.currentLevel < config.levels.length) {
      config.currentLevel += 1;
      this.scene.pause();
      this.scene.launch("LevelComplete", {
        message: "Level Complete!",
        isGameComplete: false,
        levelScore: this.levelScore,
        totalScore: this.totalScore,
      });
    } else {
      this.scene.pause();
      this.scene.launch("LevelComplete", {
        message: "You Win!",
        isGameComplete: true,
        levelScore: this.levelScore,
        totalScore: this.totalScore,
      });
      config.currentLevel = 1;
    }
  }

  onTimerTick() {
    // console.log((this.timeout -= 1));
    this.timeoutText.setText("Time: " + this.timeout);

    if (this.timeout <= 0) {
      this.timer.paused = true;
      this.sounds.timeout.play();
      this.restart();
    } else {
      this.timeout -= 1;
    }
  }

  createTimer() {
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.onTimerTick,
      loop: true,
      callbackScope: this,
    });
  }

  showPointsAnimation(points) {
    const pointsText = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2,
        "+" + points,
        {
          font: "48px GardenFlower",
          fill: "#FFD700",
          stroke: "#8B4513",
          strokeThickness: 3,
        }
      )
      .setOrigin(0.5, 0.5);

    pointsText.setDepth(1000);

    this.tweens.add({
      targets: pointsText,
      y: pointsText.y - 500,
      x: pointsText.x + Phaser.Math.Between(-30, 30),
      scaleX: { from: 0.5, to: 1.8 },
      scaleY: { from: 0.5, to: 1.8 },
      alpha: {
        value: 0,
        delay: 600,
        duration: 900,
      },
      ease: "Power2.easeOut",
      //   ease: "Back.easeOut",
      duration: 1500,
      onComplete: () => {
        pointsText.destroy();
      },
    });
  }

  cleanupPointsAnimations() {
    const pointsTexts = this.children.list.filter(
      (child) => child.type === "Text" && child.depth === 1000
    );

    this.tweens.killTweensOf(pointsTexts);

    pointsTexts.forEach((text) => {
      text.destroy();
    });
  }

  createSounds() {
    this.sounds = {
      card: this.sound.add("card"),
      complete: this.sound.add("complete"),
      theme: this.sound.add("theme"),
      success: this.sound.add("success"),
      timeout: this.sound.add("timeout"),
    };

    this.sounds.theme.play({
      volume: 0.05,
      loop: true,
    });
  }

  create() {
    this.totalScore = 0;
    this.createSounds();
    this.createTimer();
    this.createBackground();
    this.createText();
    this.input.on("gameobjectdown", this.onCardClicked, this);
    this.start();
  }

  createText() {
    this.timeoutText = this.add.text(20, 30, "", {
      font: "32px GardenFlower",
      fill: "#ffffff",
    });

    this.levelText = this.add.text(20, 70, "", {
      font: "32px GardenFlower",
      fill: "#ffffff",
    });

    this.scoreText = this.add
      .text(1260, 30, "", {
        font: "32px GardenFlower",
        fill: "#ffffff",
      })
      .setOrigin(1, 0);
  }

  updateTexts() {
    this.timeoutText.setText("Time: " + this.timeout);
    this.levelText.setText("Level: " + config.currentLevel);
    this.scoreText.setText("Score: " + this.totalScore);
  }

  start() {
    this.initCardsPositions();
    const level = this.getCurrentLevel();
    this.timeout = level.time;
    this.openedCard = null;
    this.openedCardsCount = 0;
    this.consecutiveMatches = 0;
    this.levelScore = 0;
    this.timer.paused = false;
    this.updateTexts();
    this.createCards();
    this.initCards();
    this.showCards();
  }

  restart() {
    this.consecutiveMatches = 0;

    let count = 0;
    let onCardMoveComplete = () => {
      count += 1;

      if (count >= this.cards.length) {
        this.start();
      }
    };

    this.cards.forEach((card) => {
      card.move({
        x: this.sys.game.config.width + card.width,
        y: this.sys.game.config.height + card.height,
        delay: card.position.delay,
        callback: onCardMoveComplete,
      });
    });
  }

  initCards() {
    let positions = Phaser.Utils.Array.Shuffle(this.positions);

    this.cards.forEach((card) => {
      card.init(positions.pop());
    });
  }

  showCards() {
    this.cards.forEach((card) => {
      card.depth = card.position.delay;
      card.move({
        x: card.position.x,
        y: card.position.y,
        delay: card.position.delay,
      });
    });
  }

  createBackground() {
    this.add.sprite(0, 0, "background").setOrigin(0, 0);
  }

  createCards() {
    if (this.cards) {
      this.cards.forEach((card) => card.destroy());
    }

    this.cards = [];
    const level = this.getCurrentLevel();

    for (let value = 1; value <= level.pairs; value += 1) {
      for (let i = 0; i < 2; i++) {
        this.cards.push(new Card(this, value));
      }
    }
  }

  initCardsPositions() {
    let positions = [];
    const level = this.getCurrentLevel();
    const grid = calculateGrid(level.pairs);

    let cardTexture = this.textures.get("card").getSourceImage();
    let cardWidth = cardTexture.width + 4;
    let cardHeight = cardTexture.height + 4;
    let offsetX =
      (this.sys.game.config.width - cardWidth * grid.cols) / 2 + cardWidth / 2;
    let offsetY =
      (this.sys.game.config.height - cardHeight * grid.rows) / 2 +
      cardHeight / 2;
    let id = 0;

    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        id++;
        positions.push({
          delay: id * 100,
          x: offsetX + col * cardWidth,
          y: offsetY + row * cardHeight,
        });
      }
    }

    this.positions = positions;
  }

  onCardClicked(_pointer, card) {
    if (card.opened) return false;

    this.sounds.card.play();

    if (this.openedCard) {
      if (this.openedCard.value === card.value) {
        this.consecutiveMatches += 1;
        let earnedPoints = calculateScore(this.consecutiveMatches);
        this.levelScore += earnedPoints;
        this.showPointsAnimation(earnedPoints);
        // this.totalScore += earnedPoints;
        // this.updateTexts();

        if (this.openedCardsCount + 1 !== this.cards.length / 2) {
          this.sounds.success.play();
        }
        this.openedCard = null;
        this.openedCardsCount += 1;
      } else {
        this.consecutiveMatches = 0;
        this.openedCard.close();
        this.openedCard = card;
      }
    } else {
      this.openedCard = card;
    }

    card.open(() => {
      if (this.openedCardsCount === this.cards.length / 2) {
        this.sounds.complete.play();
        this.nextLevel();
      }
    });
  }
}
