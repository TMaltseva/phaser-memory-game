class AboutScene extends Phaser.Scene {
  constructor() {
    super("About");
  }

  create() {
    this.createModal();
    this.createTitle();
    this.createRulesText();
    this.createCloseButton();
  }

  createModal() {
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.7);

    let modal = this.add.image(640, 360, "modalBg");
    const scale = 1.5;
    modal.setDisplaySize(900 * scale, 500 * scale);
  }

  createTitle() {
    this.add
      .text(640, 150, "How to Play", {
        font: "38px GardenFlower",
        fill: "#8B4513",
        align: "center",
      })
      .setOrigin(0.5)
      .setResolution(window.devicePixelRatio || 1);
  }

  createRulesText() {
    const rulesText = `
      Complete 7 levels with increasing difficulty 
      with scoring system of points.
  
      Make a mistake? Your streak resets!
      Points count only when you complete the level.`;

    const textObject = this.add
      .text(620, 320, rulesText, {
        font: "28px GardenFlower",
        fill: "#8B4513",
        align: "center",
        lineSpacing: 12,
        wordWrap: { width: 900 },
      })
      .setOrigin(0.5)
      .setResolution(window.devicePixelRatio || 1);
  }

  createCloseButton() {
    let buttonBg = this.add.graphics();
    this.drawButton(buttonBg, 0x8b4513);

    let button = this.add
      .text(0, 3, "Close", {
        font: "32px GardenFlower",
        fill: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setResolution(window.devicePixelRatio || 1);

    let buttonContainer = this.add.container(640, 520, [buttonBg, button]);
    buttonContainer.setSize(120, 50);
    buttonContainer.setInteractive();

    this.setupButtonEvents(buttonContainer, buttonBg);
  }

  drawButton(graphics, color) {
    graphics.clear();
    graphics.fillStyle(color);
    graphics.fillRoundedRect(-100, -35, 200, 70, 30);
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
      this.handleCloseClick();
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

  handleCloseClick() {
    this.input.setDefaultCursor("default");
    this.scene.stop();
    this.scene.resume("Game");
  }
}
