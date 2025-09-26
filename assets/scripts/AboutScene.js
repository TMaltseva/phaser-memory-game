class AboutScene extends Phaser.Scene {
  constructor() {
    super("About");
  }

  create() {
    this.scale.on("resize", this.handleResize, this);
    this.createModal();
    this.createTitle();
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

  createTitle() {
    const { width, height } = this.getRealSize();
    const isPortrait = height > width;
    const isSmallScreen = width < 480;
    const isMediumScreen = width >= 480 && width < 768;

    const devicePixelRatio = window.devicePixelRatio || 1;
    const dpi = isPortrait
      ? Math.max(2, Math.min(devicePixelRatio, 4))
      : Math.max(1, Math.min(devicePixelRatio, 3));

    let fontSize, titleY;

    if (isPortrait) {
      if (isSmallScreen) {
        fontSize = "22px";
        titleY = height * 0.23;
      } else if (isMediumScreen) {
        fontSize = "24px";
        titleY = height * 0.23;
      } else {
        fontSize = "28px";
        titleY = height * 0.2;
      }
    } else {
      if (isSmallScreen) {
        fontSize = "24px";
        titleY = height * 0.18;
      } else if (isMediumScreen) {
        fontSize = "28px";
        titleY = height * 0.23;
      } else {
        fontSize = "36px";
        titleY = height * 0.22;
      }
    }

    // this.add
    //   .text(width / 2, titleY, "How to Play", {
    //     font: `${fontSize} GardenFlower`,
    //     fill: "#8B4513",
    //     align: "center",
    //     resolution: dpi * 2,
    //   })
    //   .setOrigin(0.5)
    //   .setResolution(dpi * 2);
  }

  createRulesText() {
    const { width, height } = this.getRealSize();
    const isPortrait = height > width;
    const isSmallScreen = width < 480;
    const isMediumScreen = width >= 480 && width < 768;

    const devicePixelRatio = window.devicePixelRatio || 1;
    const dpi = isPortrait
      ? Math.max(2, Math.min(devicePixelRatio, 4))
      : Math.max(1, Math.min(devicePixelRatio, 3));

    const rulesText = `Complete all with increasing difficulty.
    Make a mistake? Your streak resets!
    Points count only when you complete the level.`;

    let fontSize, textWidth, textY, lineSpacing;

    if (isPortrait) {
      if (isSmallScreen) {
        fontSize = "18px";
        textWidth = width * 0.88;
        textY = height * 0.48;
        lineSpacing = 8;
      } else if (isMediumScreen) {
        fontSize = "18px";
        textWidth = width * 0.85;
        textY = height * 0.5;
        lineSpacing = 10;
      } else {
        fontSize = "22px";
        textWidth = width * 0.82;
        textY = height * 0.52;
        lineSpacing = 12;
      }
    } else {
      if (isSmallScreen) {
        fontSize = "20px";
        textWidth = Math.min(width * 0.75, 600);
        textY = height * 0.48;
        lineSpacing = 10;
      } else if (isMediumScreen) {
        fontSize = "18px";
        textWidth = Math.min(width * 0.7, 700);
        textY = height * 0.5;
        lineSpacing = 11;
      } else {
        fontSize = "24px";
        textWidth = Math.min(width * 0.65, 800);
        textY = height * 0.52;
        lineSpacing = 12;
      }
    }

    this.add
      .text(width / 2, textY, rulesText, {
        font: `${fontSize} GardenFlower`,
        fill: "#8B4513",
        align: "center",
        lineSpacing: lineSpacing,
        wordWrap: { width: textWidth },
        resolution: dpi * 2,
      })
      .setOrigin(0.5)
      .setResolution(dpi * 2);
  }

  createCloseButton() {
    const { width, height } = this.getRealSize();
    const isPortrait = height > width;
    const isSmallScreen = width < 480;
    const isMediumScreen = width >= 480 && width < 768;

    const devicePixelRatio = window.devicePixelRatio || 1;
    const dpi = isPortrait
      ? Math.max(2, Math.min(devicePixelRatio, 4))
      : Math.max(1, Math.min(devicePixelRatio, 3));

    let buttonY, buttonWidth, buttonHeight, fontSize;

    if (isPortrait) {
      if (isSmallScreen) {
        buttonY = height * 0.7;
        buttonWidth = 120;
        buttonHeight = 45;
        fontSize = "20px";
      } else if (isMediumScreen) {
        buttonY = height * 0.7;
        buttonWidth = 140;
        buttonHeight = 50;
        fontSize = "22px";
      } else {
        buttonY = height * 0.75;
        buttonWidth = 160;
        buttonHeight = 60;
        fontSize = "28px";
      }
    } else {
      if (isSmallScreen) {
        buttonY = height * 0.75;
        buttonWidth = 120;
        buttonHeight = 45;
        fontSize = "20px";
      } else if (isMediumScreen) {
        buttonY = height * 0.7;
        buttonWidth = 140;
        buttonHeight = 50;
        fontSize = "22px";
      } else {
        buttonY = height * 0.7;
        buttonWidth = 160;
        buttonHeight = 60;
        fontSize = "28px";
      }
    }

    let buttonBg = this.add.graphics();
    this.drawButton(buttonBg, 0x8b4513, buttonWidth, buttonHeight);

    let button = this.add
      .text(0, 3, "Close", {
        font: `${fontSize} GardenFlower`,
        fill: "#ffffff",
        align: "center",
        resolution: dpi * 2,
      })
      .setOrigin(0.5)
      .setResolution(dpi * 2);

    let buttonContainer = this.add.container(width / 2, buttonY, [
      buttonBg,
      button,
    ]);
    buttonContainer.setSize(buttonWidth, buttonHeight);
    buttonContainer.setInteractive();

    this.setupButtonEvents(buttonContainer, buttonBg);
  }

  drawButton(graphics, color, width = 160, height = 60) {
    graphics.clear();
    graphics.fillStyle(color);
    graphics.fillRoundedRect(-width / 2, -height / 2, width, height, 25);
  }

  setupButtonEvents(container, buttonBg) {
    const buttonWidth = container.width;
    const buttonHeight = container.height;

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
