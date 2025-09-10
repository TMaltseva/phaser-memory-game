class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super("LevelComplete");
  }

  init(data) {
    this.message = data.message;
    this.isGameComplete = data.isGameComplete;
  }

  create() {
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.5);

    let modal = this.add.image(640, 360, "modalBg");
    modal.setDisplaySize(700, 400);

    this.add
      .text(640, 330, this.message, {
        font: "38px GardenFlower",
        fill: "#8B4513",
        align: "center",
      })
      .setOrigin(0.5);
    let buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x8b4513);
    buttonBg.fillRoundedRect(-100, -30, 200, 60, 25);

    let buttonText = this.isGameComplete ? "Play Again" : "Next Level";
    let button = this.add
      .text(0, 0, buttonText, {
        font: "28px GardenFlower",
        fill: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    let buttonContainer = this.add.container(640, 410, [buttonBg, button]);
    buttonContainer.setSize(200, 60);
    buttonContainer.setInteractive();

    buttonContainer.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");

      this.tweens.add({
        targets: buttonContainer,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 150,
        ease: "Power2",
      });

      buttonBg.clear();
      buttonBg.fillStyle(0xa0522d);
      buttonBg.fillRoundedRect(-100, -30, 200, 60, 25);
    });

    buttonContainer.on("pointerout", () => {
      this.input.setDefaultCursor("default");

      this.tweens.add({
        targets: buttonContainer,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: "Power2",
      });

      buttonBg.clear();
      buttonBg.fillStyle(0x8b4513);
      buttonBg.fillRoundedRect(-100, -30, 200, 60, 25);
    });

    buttonContainer.on("pointerdown", () => {
      this.input.setDefaultCursor("default");
      this.scene.stop();
      this.scene.resume("Game");
      this.scene.get("Game").restart();
    });
  }
}
