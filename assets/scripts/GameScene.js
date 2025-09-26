class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
    this.isPortrait = false;
    this.resizeTimeout = null;
  }

  preload() {
    this.load.image("background", "assets/sprites/background.png");
    this.load.image(
      "background-portrait",
      "assets/sprites/background-portrait.png"
    );
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

  getRealSize() {
    return {
      width: this.scale.width,
      height: this.scale.height,
    };
  }

  getCurrentLevel() {
    const levels = config.getLevels(this.isPortrait);
    return levels[config.currentLevel - 1];
  }

  nextLevel() {
    this.timer.paused = true;
    this.cleanupPointsAnimations();

    this.totalScore += this.levelScore;
    this.scoreText.setText("Score: " + this.totalScore);

    const levels = config.getLevels(this.isPortrait);
    if (config.currentLevel < levels.length) {
      config.currentLevel += 1;
      this.scene.pause();
      this.scene.launch("LevelComplete", {
        message: "Level Complete!",
        isGameComplete: false,
        levelScore: this.levelScore,
        totalScore: this.totalScore,
      });
    } else {
      this.saveGameRecord();

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
    const devicePixelRatio = window.devicePixelRatio || 1;
    const dpi = this.isPortrait
      ? Math.max(2, Math.min(devicePixelRatio, 4))
      : Math.max(1, Math.min(devicePixelRatio, 3));
    const { width, height } = this.getRealSize();

    const pointsText = this.add
      .text(width / 2, height / 2, "+" + points, {
        font: "48px GardenFlower",
        fill: "#FFD700",
        stroke: "#8B4513",
        strokeThickness: 3,
      })
      .setOrigin(0.5, 0.5)
      .setResolution(dpi * 2);

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
    this.gameStartTime = Date.now();
    this.createSounds();
    this.createTimer();

    this.scale.on("resize", this.handleResize, this);
    window.addEventListener("resize", this.handleWindowResize);
    this.createBackground();
    this.createText();
    this.input.on("gameobjectdown", this.onCardClicked, this);
    this.checkOrientation();
    this.start();
  }

  handleWindowResize = () => {
    if (!this.scene.isActive()) return;

    if (this.windowResizeTimeout) {
      clearTimeout(this.windowResizeTimeout);
    }

    this.windowResizeTimeout = setTimeout(() => {
      this.forceLayoutUpdate();
      this.windowResizeTimeout = null;
    }, 100);
  };

  destroy() {
    window.removeEventListener("resize", this.handleWindowResize);
    super.destroy();
  }

  checkOrientation() {
    const { width, height } = this.getRealSize();
    const wasPortrait = this.isPortrait;
    this.isPortrait = height > width;
    return this.isPortrait !== wasPortrait;
  }

  handleResize(_gameSize) {
    if (!this.scene.isActive()) return;

    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.forceLayoutUpdate();
      this.resizeTimeout = null;
    }, 100);
  }

  forceLayoutUpdate() {
    const wasPortrait = this.isPortrait;
    this.isPortrait = this.scale.height > this.scale.width;

    if (wasPortrait !== this.isPortrait) {
      this.rebuildLayout();
    } else {
      this.updateLayout();
    }
  }

  rebuildLayout() {
    if (this.bg) this.bg.destroy();
    if (this.timeoutText) this.timeoutText.destroy();
    if (this.levelText) this.levelText.destroy();
    if (this.scoreText) this.scoreText.destroy();

    if (this.recordsButton) this.recordsButton.destroy();
    if (this.aboutButton) this.aboutButton.destroy();

    this.createBackground();
    this.createText();

    if (this.cards && this.cards.length > 0) {
      this.createCards();
      this.initCardsPositions();
      this.initCards();
      this.applyCardScaling();
      this.showCards();
    }
  }

  repositionCards() {
    this.initCardsPositions();
    this.applyCardScaling();

    setTimeout(() => {
      this.cards.forEach((card, index) => {
        if (this.positions[index]) {
          card.move({
            x: this.positions[index].x,
            y: this.positions[index].y,
            delay: 0,
          });
        }
      });
    }, 50);
  }

  getAdaptiveFontSize(baseSize) {
    const { width } = this.getRealSize();
    if (width < 400) {
      return Math.max(baseSize - 10, 16);
    } else if (width < 600) {
      return Math.max(baseSize - 6, 20);
    } else if (width < 800) {
      return Math.max(baseSize - 4, 24);
    } else {
      return baseSize;
    }
  }

  createText() {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const dpi = this.isPortrait
      ? Math.max(2, Math.min(devicePixelRatio, 4))
      : Math.max(1, Math.min(devicePixelRatio, 3));
    const { width, height } = this.getRealSize();

    const fontSize = this.getAdaptiveFontSize(32);

    const textStyle = {
      font: `${fontSize}px GardenFlower`,
      fill: "#ffffff",
      resolution: dpi * 2,
      stroke: "#000000",
      strokeThickness: 2,
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: "#000000",
        blur: 2,
        stroke: true,
        fill: true,
      },
    };

    const safePadding = 5;
    const mobileTopOffset = this.isPortrait ? 30 : 0;
    const mobileLeftOffset = this.isPortrait ? 20 : 5;

    this.timeoutText = this.add
      .text(mobileLeftOffset, 10 + safePadding + mobileTopOffset, "", textStyle)
      .setResolution(dpi * 2)
      .setDepth(10);

    this.levelText = this.add
      .text(mobileLeftOffset, 50 + safePadding + mobileTopOffset, "", textStyle)
      .setResolution(dpi * 2)
      .setDepth(10);

    this.scoreText = this.add
      .text(width / 2, 10 + safePadding + mobileTopOffset, "", textStyle)
      .setOrigin(0.5, 0)
      .setResolution(dpi * 2)
      .setDepth(10);

    this.createRecordsButton();
    this.createAboutButton();
  }

  updateTexts() {
    this.timeoutText.setText("Time: " + this.timeout);
    this.levelText.setText("Level: " + config.currentLevel);
    this.scoreText.setText("Score: " + this.totalScore);
  }

  start() {
    const level = this.getCurrentLevel();
    this.timeout = level.time;
    this.openedCard = null;
    this.openedCardsCount = 0;
    this.consecutiveMatches = 0;
    this.levelScore = 0;
    this.timer.paused = false;
    this.updateTexts();

    this.createCards();
    this.initCardsPositions();
    this.initCards();

    this.applyCardScaling();

    this.showCards();

    if (config.currentLevel === 1) {
      this.gameStartTime = Date.now();
    }
  }

  restart() {
    this.consecutiveMatches = 0;

    if (this.cards) {
      this.cards.forEach((card) => {
        if (card && card.scene) {
          this.tweens.killTweensOf(card);
        }
      });
    }

    let completed = 0;
    const totalCards = this.cards ? this.cards.length : 0;

    if (totalCards === 0) {
      this.start();
      return;
    }

    this.cards.forEach((card) => {
      if (card && card.scene) {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        card.move({
          x: screenWidth + card.width,
          y: screenHeight + card.height,
          delay: card.position.delay,
          callback: () => {
            if (++completed >= totalCards) this.start();
          },
        });
      } else {
        if (++completed >= totalCards) this.start();
      }
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

  updateLayout() {
    const { width, height } = this.getRealSize();

    if (this.bg) {
      if (this.isPortrait) {
        this.bg.setDisplaySize(width, height);
      } else {
        const scale = Math.max(width / this.bg.width, height / this.bg.height);
        this.bg.setScale(scale);
        this.bg.setPosition(
          (width - this.bg.displayWidth) / 2,
          (height - this.bg.displayHeight) / 2
        );
      }
    }

    const safePadding = 5;
    const mobileTopOffset = this.isPortrait ? 30 : 0;
    const mobileLeftOffset = this.isPortrait ? 20 : 5;

    if (this.timeoutText) {
      this.timeoutText.setX(mobileLeftOffset);
      this.timeoutText.setY(10 + safePadding + mobileTopOffset);
    }

    if (this.levelText) {
      this.levelText.setX(mobileLeftOffset);
      this.levelText.setY(50 + safePadding + mobileTopOffset);
    }

    if (this.scoreText) {
      this.scoreText.setX(width / 2);
      this.scoreText.setY(10 + safePadding + mobileTopOffset);
    }

    if (this.recordsButton) {
      if (this.isPortrait) {
        this.recordsButton.setPosition(
          width - mobileLeftOffset,
          10 + safePadding + mobileTopOffset
        );
      } else {
        this.recordsButton.setPosition(width - 50, 30);
      }
    }

    if (this.aboutButton) {
      if (this.isPortrait) {
        this.aboutButton.setPosition(
          width - mobileLeftOffset,
          50 + safePadding + mobileTopOffset
        );
      } else {
        this.aboutButton.setPosition(width - 190, 30);
      }
    }

    if (this.cards && this.cards.length > 0) {
      this.applyCardScaling();

      setTimeout(() => {
        this.updateCardPositions();
      }, 50);
    }
  }

  updateCardPositions() {
    const level = this.getCurrentLevel();
    const { width, height } = this.getRealSize();
    const grid = calculateGrid(level.pairs, width, height);
    const totalCards = level.pairs * 2;

    const cardDimensions = this.getCardDimensions();

    let spacing = cardDimensions.spacing;
    if (cardDimensions.scale < 0.3) {
      spacing = Math.max(2, cardDimensions.spacing * cardDimensions.scale);
    }

    const cardWidth = cardDimensions.width + spacing;
    const cardHeight = cardDimensions.height + spacing;

    const totalGridWidth = cardWidth * grid.cols - spacing;
    const totalGridHeight = cardHeight * grid.rows - spacing;

    const offsetX = (width - totalGridWidth) / 2 + cardDimensions.width / 2;
    const offsetY =
      (height - totalGridHeight) / 2 + cardDimensions.height / 2 + 30;

    this.cards.forEach((card, index) => {
      if (card && index < totalCards) {
        const row = Math.floor(index / grid.cols);
        const col = index % grid.cols;

        this.tweens.add({
          targets: card,
          x: offsetX + col * cardWidth,
          y: offsetY + row * cardHeight,
          duration: 300,
          ease: "Power2",
        });
      }
    });

    this.currentCardScale = cardDimensions.scale;
  }

  createBackground() {
    const { width, height } = this.getRealSize();
    this.isPortrait = height > width;

    if (this.bg) this.bg.destroy();

    if (this.isPortrait) {
      this.bg = this.add.sprite(0, 0, "background-portrait").setOrigin(0, 0);
      this.bg.setDisplaySize(width, height);
    } else {
      this.bg = this.add.sprite(0, 0, "background").setOrigin(0, 0);

      const scale = Math.max(width / this.bg.width, height / this.bg.height);
      this.bg.setScale(scale);

      this.bg.setPosition(
        (width - this.bg.displayWidth) / 2,
        (height - this.bg.displayHeight) / 2
      );
    }
  }

  createCards() {
    if (this.cards) {
      this.cards.forEach((card) => {
        if (card && card.scene) {
          this.tweens.killTweensOf(card);
          card.destroy();
        }
      });
    }

    this.cards = [];
    const level = this.getCurrentLevel();

    for (let value = 1; value <= level.pairs; value += 1) {
      for (let i = 0; i < 2; i++) {
        const card = new Card(this, value);
        card.setCardScale(this.currentCardScale || 1);
        this.cards.push(card);
      }
    }
  }

  initCardsPositions() {
    let positions = [];
    const level = this.getCurrentLevel();
    const { width, height } = this.getRealSize();
    const grid = calculateGrid(level.pairs, width, height);
    const totalCards = level.pairs * 2;

    const cardDimensions = this.getCardDimensions();
    this.currentCardScale = cardDimensions.scale;

    let spacing = cardDimensions.spacing;
    if (cardDimensions.scale < 0.3) {
      spacing = Math.max(2, cardDimensions.spacing * cardDimensions.scale);
    }

    const cardWidth = cardDimensions.width + spacing;
    const cardHeight = cardDimensions.height + spacing;

    const totalGridWidth = cardWidth * grid.cols - spacing;
    const totalGridHeight = cardHeight * grid.rows - spacing;

    const offsetX = (width - totalGridWidth) / 2 + cardDimensions.width / 2;
    const offsetY =
      (height - totalGridHeight) / 2 + cardDimensions.height / 2 + 30;

    let id = 0;

    for (let i = 0; i < totalCards; i++) {
      const row = Math.floor(i / grid.cols);
      const col = i % grid.cols;
      id++;
      positions.push({
        delay: id * 100,
        x: offsetX + col * cardWidth,
        y: offsetY + row * cardHeight,
      });
    }

    this.positions = positions;

    if (this.cards) {
      this.cards.forEach((card) => {
        if (card && card.setCardScale) {
          card.setCardScale(this.currentCardScale);
        }
      });
    }
  }

  onCardClicked(_pointer, card) {
    if (!card || !(card instanceof Card) || card.opened) return false;

    this.sounds.card.play();

    if (this.openedCard) {
      if (this.openedCard.value === card.value) {
        this.consecutiveMatches += 1;
        let earnedPoints = calculateScore(this.consecutiveMatches);
        this.levelScore += earnedPoints;
        this.showPointsAnimation(earnedPoints);

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

  getCardDimensions() {
    const { width, height } = this.getRealSize();
    const level = this.getCurrentLevel();
    const grid = calculateGrid(level.pairs, width, height);
    const totalCards = level.pairs * 2;

    let cardTexture = this.textures.get("card").getSourceImage();
    let baseCardWidth = cardTexture.width;
    let baseCardHeight = cardTexture.height;

    const margin = this.isPortrait ? 3 : 5;
    const topOffset = this.isPortrait ? 100 : 120;
    const sideMargin = this.isPortrait ? 10 : 20;
    const bottomMargin = this.isPortrait ? 100 : 60;

    const availableWidth = width - sideMargin * 2;
    const availableHeight = height - topOffset - bottomMargin;

    const maxCardWidth =
      (availableWidth - margin * (grid.cols - 1)) / grid.cols;
    const maxCardHeight =
      (availableHeight - margin * (grid.rows - 1)) / grid.rows;

    const scaleByWidth = maxCardWidth / baseCardWidth;
    const scaleByHeight = maxCardHeight / baseCardHeight;

    let scale = Math.min(scaleByWidth, scaleByHeight);

    if (totalCards > 4) {
      const extraCards = totalCards - 4;
      const reductionFactor = Math.max(0.92, 1 - (extraCards / 2) * 0.015);
      scale *= reductionFactor;
    }

    if (this.isPortrait) {
      scale = Math.max(0.28, Math.min(scale, 0.9));
    } else {
      scale = Math.max(0.35, Math.min(scale, 1.8));
    }

    if (totalCards >= 6 && totalCards <= 8) {
      scale *= 1.1;
    }

    if (width < 500 && config.currentLevel >= 4) {
      scale *= 1.2;
    }

    if (this.isPortrait && width < 400 && config.currentLevel === 1) {
      scale *= 0.85;
    }

    if (this.isPortrait && level.pairs >= 4) {
      scale *= 0.8;
    }

    const finalCardWidth = baseCardWidth * scale;
    const finalCardHeight = baseCardHeight * scale;

    return {
      width: finalCardWidth,
      height: finalCardHeight,
      scale: scale,
      spacing: margin,
    };
  }

  applyCardScaling() {
    if (!this.cards || this.cards.length === 0) return;

    const cardDimensions = this.getCardDimensions();
    this.currentCardScale = cardDimensions.scale;

    this.cards.forEach((card) => {
      if (card && card.scene) {
        card.setCardScale(cardDimensions.scale);
      }
    });
  }

  createRecordsButton() {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const dpi = this.isPortrait
      ? Math.max(2, Math.min(devicePixelRatio, 4))
      : Math.max(1, Math.min(devicePixelRatio, 3));
    const { width, height } = this.getRealSize();

    const fontSize = this.getAdaptiveFontSize(32);
    const safePadding = 5;
    const mobileTopOffset = this.isPortrait ? 30 : 0;
    const mobileLeftOffset = this.isPortrait ? 20 : 5;

    let buttonX, buttonY;

    if (this.isPortrait) {
      buttonX = width - mobileLeftOffset;
      buttonY = 10 + safePadding + mobileTopOffset;
    } else {
      buttonX = width - 50;
      buttonY = 30;
    }

    this.recordsButton = this.add
      .text(buttonX, buttonY, "Records", {
        font: `${fontSize}px GardenFlower`,
        fill: "#ffffff",
        resolution: dpi * 2,
        stroke: "#000000",
        strokeThickness: 2,
        shadow: {
          offsetX: 1,
          offsetY: 1,
          color: "#000000",
          blur: 2,
          stroke: true,
          fill: true,
        },
      })
      .setOrigin(1, 0)
      .setResolution(dpi * 2)
      .setInteractive()
      .on("pointerover", () => {
        this.recordsButton.setStyle({ fill: "#FFD700" });
        this.input.setDefaultCursor("pointer");
      })
      .on("pointerout", () => {
        this.recordsButton.setStyle({ fill: "#ffffff" });
        this.input.setDefaultCursor("default");
      })
      .on("pointerdown", () => {
        this.showRecords();
      });
  }

  createAboutButton() {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const dpi = this.isPortrait
      ? Math.max(2, Math.min(devicePixelRatio, 4))
      : Math.max(1, Math.min(devicePixelRatio, 3));
    const { width, height } = this.getRealSize();

    const fontSize = this.getAdaptiveFontSize(32);
    const safePadding = 5;
    const mobileTopOffset = this.isPortrait ? 30 : 0;
    const mobileLeftOffset = this.isPortrait ? 20 : 5;

    let buttonX, buttonY;

    if (this.isPortrait) {
      buttonX = width - mobileLeftOffset;
      buttonY = 50 + safePadding + mobileTopOffset;
    } else {
      buttonX = width - 190;
      buttonY = 30;
    }

    this.aboutButton = this.add
      .text(buttonX, buttonY, "About", {
        font: `${fontSize}px GardenFlower`,
        fill: "#ffffff",
        resolution: dpi * 2,
        stroke: "#000000",
        strokeThickness: 2,
        shadow: {
          offsetX: 1,
          offsetY: 1,
          color: "#000000",
          blur: 2,
          stroke: true,
          fill: true,
        },
      })
      .setOrigin(1, 0)
      .setResolution(dpi * 2)
      .setInteractive()
      .on("pointerover", () => {
        this.aboutButton.setStyle({ fill: "#FFD700" });
        this.input.setDefaultCursor("pointer");
      })
      .on("pointerout", () => {
        this.aboutButton.setStyle({ fill: "#ffffff" });
        this.input.setDefaultCursor("default");
      })
      .on("pointerdown", () => {
        event.stopPropagation();
        this.showAbout();
      });
  }

  showRecords() {
    this.scene.pause();
    this.scene.launch("Records");
  }

  showAbout() {
    this.scene.pause();
    this.scene.launch("About");
  }

  saveGameRecord() {
    const gameEndTime = Date.now();
    const totalGameTime = Math.floor((gameEndTime - this.gameStartTime) / 1000);
    const record = {
      date: new Date().toISOString(),
      totalTime: totalGameTime,
      totalScore: this.totalScore,
    };

    let records = [];
    const existingRecords = localStorage.getItem("memoryGameRecords");
    if (existingRecords) {
      records = JSON.parse(existingRecords);
    }

    records.push(record);
    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    records = records.slice(0, 20);
    localStorage.setItem("memoryGameRecords", JSON.stringify(records));
  }
}
