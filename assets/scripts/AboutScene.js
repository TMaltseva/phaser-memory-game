class AboutScene extends Phaser.Scene {
  constructor() {
    super("About");
  }

  create() {
    this.scale.on("resize", this.handleResize, this);
    this.createModal();
    // this.createTitle();
    this.createRulesText();
    this.createCloseButton();
  }

  getRealSize() {
    return {
      width: this.scale.width,
      height: this.scale.height,
    };
  }

  handleResize() {
    if (!this.scene.isActive()) return;

    this.children.removeAll();
    this.create();
  }

  createModal() {
    const { width, height } = this.getRealSize();
    const isPortrait = height > width;
    const isSmallScreen = width < 480;
    const isMediumScreen = width >= 480 && width < 768;
    const isLargeScreen = width >= 768 && width < 1024;

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

    let modalWidth, modalHeight;

    if (isPortrait) {
      if (isSmallScreen) {
        modalWidth = width * 1.7;
        modalHeight = Math.min(height * 0.92, 600);
      } else if (isMediumScreen) {
        modalWidth = width * 1.6;
        modalHeight = Math.min(height * 0.94, 700);
      } else {
        modalWidth = Math.min(width * 1.5, 1000);
        modalHeight = Math.min(height * 0.95, 800);
      }
    } else {
      if (isSmallScreen) {
        modalWidth = width * 0.98;
        modalHeight = Math.min(height * 0.95, 500);
      } else if (isMediumScreen) {
        modalWidth = width * 1.6;
        modalHeight = Math.min(height * 0.95, 600);
      } else if (isLargeScreen) {
        modalWidth = Math.min(width * 1.5, 1200);
        modalHeight = Math.min(height * 0.95, 700);
      } else {
        modalWidth = Math.min(width * 1.2, 1400);
        modalHeight = Math.min(height * 1.1, 800);
      }
    }

    let modal = this.add.image(width / 2, height / 2, "modalBg");
    modal.setDisplaySize(modalWidth, modalHeight);
  }

  drawButton(graphics, color, width = 140, height = 50) {
    graphics.clear();
    graphics.fillStyle(color);
    graphics.fillRoundedRect(-width / 2, -height / 2, width, height, 25);
  }

  createTitle() {
    const pos = TextUtils.getResponsivePositions(this);
    const titleY = pos.isPortrait ? pos.center.y * 0.4 : pos.center.y * 0.35;

    TextUtils.createModalTitle(
      this,
      pos.center.x,
      titleY,
      "How to Play",
      28
    ).setOrigin(0.5);
  }

  createRulesText() {
    const pos = TextUtils.getResponsivePositions(this);
    const textY = pos.isPortrait ? pos.center.y * 0.9 : pos.center.y;

    const rulesText = `Complete all with increasing difficulty.
  Make a mistake? Your streak resets!
  Points count only when you complete the level.`;

    const { width } = this.scale;
    const textWidth = pos.isPortrait
      ? width * 0.85
      : Math.min(width * 0.7, 800);
    const lineSpacing = pos.isSmallScreen ? 8 : 12;

    TextUtils.createModalText(this, pos.center.x, textY, rulesText, 24)
      .setOrigin(0.5)
      .setStyle({
        lineSpacing: lineSpacing,
        wordWrap: { width: textWidth },
      });
  }

  createCloseButton() {
    const { width, height } = this.getRealSize();
    const pos = TextUtils.getResponsivePositions(this);

    let buttonY, buttonWidth, buttonHeight, fontSize;

    if (pos.isPortrait) {
      if (pos.isSmallScreen) {
        buttonY = height * 0.65;
        buttonWidth = 120;
        buttonHeight = 45;
        fontSize = 20;
      } else {
        buttonY = height * 0.7;
        buttonWidth = 140;
        buttonHeight = 50;
        fontSize = 22;
      }
    } else {
      if (pos.isSmallScreen) {
        buttonY = height * 0.75;
        buttonWidth = 120;
        buttonHeight = 45;
        fontSize = 20;
      } else {
        buttonY = height * 0.7;
        buttonWidth = 140;
        buttonHeight = 50;
        fontSize = 22;
      }
    }

    let buttonBg = this.add.graphics();
    this.drawButton(buttonBg, 0x8b4513, buttonWidth, buttonHeight);

    let button = TextUtils.createButtonText(
      this,
      0,
      3,
      "Close",
      fontSize
    ).setOrigin(0.5);

    let buttonContainer = this.add.container(width / 2, buttonY, [
      buttonBg,
      button,
    ]);
    buttonContainer.setSize(buttonWidth, buttonHeight);
    buttonContainer.setInteractive();

    this.setupButtonEvents(
      buttonContainer,
      buttonBg,
      buttonWidth,
      buttonHeight
    );
  }

  setupButtonEvents(container, buttonBg, buttonWidth, buttonHeight) {
    container.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");
      this.animateButton(container, 1.05);
      this.drawButton(buttonBg, 0xa0522d, buttonWidth, buttonHeight);
    });

    container.on("pointerout", () => {
      this.input.setDefaultCursor("default");
      this.animateButton(container, 1);
      this.drawButton(buttonBg, 0x8b4513, buttonWidth, buttonHeight);
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

  destroy() {
    this.scale.off("resize", this.handleResize, this);
    super.destroy();
  }
}
