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
    this.createModal();
    this.createTexts();
    this.createButton();
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

  createTexts() {
    const pos = TextUtils.getResponsivePositions(this);

    TextUtils.createModalTitle(
      this,
      pos.center.x,
      pos.center.y - 80,
      this.message,
      38
    ).setOrigin(0.5);

    if (!this.isGameComplete) {
      TextUtils.createModalText(
        this,
        pos.center.x,
        pos.center.y - 30,
        "Level Score: " + this.levelScore,
        24
      ).setOrigin(0.5);
    }

    TextUtils.createModalText(
      this,
      pos.center.x,
      pos.center.y + 10,
      "Total Score: " + this.totalScore,
      24
    ).setOrigin(0.5);
  }

  createButton() {
    const { width, height } = this.getRealSize();
    const pos = TextUtils.getResponsivePositions(this);

    const centerX = width / 2;
    const centerY = height / 2;
    const buttonWidth = 200;
    const buttonHeight = 60;

    let buttonBg = this.add.graphics();
    this.drawButton(buttonBg, 0x8b4513, buttonWidth, buttonHeight);

    let buttonText = this.isGameComplete ? "Play Again" : "Next Level";

    let button = TextUtils.createButtonText(
      this,
      0,
      3,
      buttonText,
      28
    ).setOrigin(0.5);

    let buttonContainer = this.add.container(centerX, centerY + 80, [
      buttonBg,
      button,
    ]);
    buttonContainer.setSize(buttonWidth, buttonHeight);
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
