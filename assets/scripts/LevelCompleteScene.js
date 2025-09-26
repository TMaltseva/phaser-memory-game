class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super("LevelComplete");
  }

  init(data) {
    this.message = data.message;
    this.isGameComplete = data.isGameComplete;
    this.levelScore = data.levelScore || 0;
    this.totalScore = data.totalScore || 0;
  }

  create() {
    const dpi = this.getImprovedDPI();
    this.createModal();
    this.createTexts(dpi);
    this.createButton(dpi);
  }

  getImprovedDPI() {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const { width, height } = this.getRealSize();
    const isPortrait = height > width;
    return isPortrait
      ? Math.max(2, Math.min(devicePixelRatio, 4))
      : Math.max(1, Math.min(devicePixelRatio, 3));
  }

  getRealSize() {
    return {
      width: this.scale.width,
      height: this.scale.height,
    };
  }

  createModal() {
    const { width, height } = this.getRealSize();

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5);

    const modalWidth = Math.max(600, width * 0.8);
    const modalHeight = Math.max(400, height * 0.6);

    let modal = this.add.image(width / 2, height / 2, "modalBg");
    modal.setDisplaySize(modalWidth, modalHeight);
  }

  createTexts(dpi) {
    const { width, height } = this.getRealSize();

    const centerX = width / 2;
    const centerY = height / 2;

    this.add
      .text(centerX, centerY - 80, this.message, {
        font: "38px GardenFlower",
        fill: "#8B4513",
        align: "center",
        resolution: dpi * 2,
      })
      .setOrigin(0.5)
      .setResolution(dpi * 2);

    if (!this.isGameComplete) {
      this.add
        .text(centerX, centerY - 30, "Level Score: " + this.levelScore, {
          font: "24px GardenFlower",
          fill: "#8B4513",
          align: "center",
          resolution: dpi * 2,
        })
        .setOrigin(0.5)
        .setResolution(dpi * 2);
    }

    this.add
      .text(centerX, centerY + 10, "Total Score: " + this.totalScore, {
        font: "24px GardenFlower",
        fill: "#8B4513",
        align: "center",
        resolution: dpi * 2,
      })
      .setOrigin(0.5)
      .setResolution(dpi * 2);
  }

  createButton(dpi) {
    const { width, height } = this.getRealSize();

    const centerX = width / 2;
    const centerY = height / 2;

    let buttonBg = this.add.graphics();
    this.drawButton(buttonBg, 0x8b4513);

    let buttonText = this.isGameComplete ? "Play Again" : "Next Level";
    let button = this.add
      .text(0, 3, buttonText, {
        font: "28px GardenFlower",
        fill: "#ffffff",
        align: "center",
        resolution: dpi * 2,
      })
      .setOrigin(0.5)
      .setResolution(dpi * 2);

    let buttonContainer = this.add.container(centerX, centerY + 80, [
      buttonBg,
      button,
    ]);
    buttonContainer.setSize(200, 60);
    buttonContainer.setInteractive();

    this.setupButtonEvents(buttonContainer, buttonBg);
  }

  drawButton(graphics, color) {
    graphics.clear();
    graphics.fillStyle(color);
    graphics.fillRoundedRect(-100, -30, 200, 60, 25);
  }

  setupButtonEvents(container, buttonBg) {
    container.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");
      this.animateButton(container, 1.05);
      this.drawButton(buttonBg, 0xa0522d);
    });

    container.on("pointerout", () => {
      this.input.setDefaultCursor("default");
      this.animateButton(container, 1);
      this.drawButton(buttonBg, 0x8b4513);
    });

    container.on("pointerdown", () => {
      this.handleButtonClick();
    });
  }

  animateButton(target, scale) {
    this.tweens.add({
      targets: target,
      scaleX: scale,
      scaleY: scale,
      duration: 150,
      ease: "Power2",
    });
  }

  handleButtonClick() {
    this.input.setDefaultCursor("default");
    this.scene.stop();
    this.scene.resume("Game");

    if (this.isGameComplete) {
      config.currentLevel = 1;
      this.scene.get("Game").totalScore = 0;
    }

    this.scene.get("Game").start();
  }
}
