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

  createModal() {
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.5);
    let modal = this.add.image(640, 360, "modalBg");
    modal.setDisplaySize(700, 400);
  }

  createTexts() {
    this.add
      .text(640, 300, this.message, {
        font: "38px GardenFlower",
        fill: "#8B4513",
        align: "center",
      })
      .setOrigin(0.5);

    if (!this.isGameComplete) {
      this.add
        .text(640, 350, "Level Score: " + this.levelScore, {
          font: "24px GardenFlower",
          fill: "#8B4513",
          align: "center",
        })
        .setOrigin(0.5);
    }

    this.add
      .text(640, 380, "Total Score: " + this.totalScore, {
        font: "24px GardenFlower",
        fill: "#8B4513",
        align: "center",
      })
      .setOrigin(0.5);
  }

  createButton() {
    let buttonBg = this.add.graphics();
    this.drawButton(buttonBg, 0x8b4513);

    let buttonText = this.isGameComplete ? "Play Again" : "Next Level";
    let button = this.add
      .text(0, 3, buttonText, {
        font: "28px GardenFlower",
        fill: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    let buttonContainer = this.add.container(640, 440, [buttonBg, button]);
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
      this.scene.get("Game").totalScore = 0;
    }

    this.scene.get("Game").restart();
  }
}
