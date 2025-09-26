class TextUtils {
  static getOptimalResolution() {
    const devicePixelRatio = window.devicePixelRatio || 1;
    return Math.max(1, Math.min(devicePixelRatio, 2));
  }

  static getAdaptiveFontSize(scene, baseSize) {
    const width = scene.scale.width;

    if (width < 400) return Math.max(baseSize * 0.7, 14);
    if (width < 600) return Math.max(baseSize * 0.8, 16);
    if (width < 800) return Math.max(baseSize * 0.9, 20);
    return baseSize;
  }

  static createText(scene, x, y, text, customStyle = {}) {
    const resolution = this.getOptimalResolution();

    const defaultStyle = {
      fontFamily: "GardenFlower, Arial, sans-serif",
      fontSize: "32px",
      color: "#ffffff",
      align: "center",
      resolution: resolution,
    };

    const style = { ...defaultStyle, ...customStyle };
    const textObject = scene.add.text(x, y, text, style);
    textObject.setResolution(resolution);

    return textObject;
  }

  static createAdaptiveText(
    scene,
    x,
    y,
    text,
    baseSize = 32,
    customStyle = {}
  ) {
    const adaptiveSize = this.getAdaptiveFontSize(scene, baseSize);

    return this.createText(scene, x, y, text, {
      fontSize: `${adaptiveSize}px`,
      ...customStyle,
    });
  }

  static createGameText(scene, x, y, text, baseSize = 32) {
    return this.createAdaptiveText(scene, x, y, text, baseSize, {
      color: "#ffffff",
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
    });
  }

  static createModalTitle(scene, x, y, text, baseSize = 28) {
    return this.createAdaptiveText(scene, x, y, text, baseSize, {
      color: "#8B4513",
      align: "center",
    });
  }

  static createModalText(scene, x, y, text, baseSize = 18) {
    return this.createAdaptiveText(scene, x, y, text, baseSize, {
      color: "#8B4513",
      align: "center",
    });
  }

  static createButtonText(scene, x, y, text, baseSize = 20) {
    return this.createAdaptiveText(scene, x, y, text, baseSize, {
      color: "#ffffff",
      align: "center",
    });
  }

  static createTableHeaderText(
    scene,
    x,
    y,
    text,
    baseSize = 20,
    isActive = false
  ) {
    return this.createAdaptiveText(scene, x, y, text, baseSize, {
      color: isActive ? "#FFD700" : "#8B4513",
      align: "center",
    });
  }

  static createTableDataText(scene, x, y, text, baseSize = 16) {
    return this.createAdaptiveText(scene, x, y, text, baseSize, {
      color: "#8B4513",
      align: "center",
    });
  }

  static getResponsivePositions(scene) {
    const { width, height } = scene.scale;
    const isPortrait = height > width;
    const isSmallScreen = width < 480;

    const safePadding = 10;
    const topOffset = isPortrait ? 80 : 40;
    const sideOffset = isPortrait ? 20 : 10;

    return {
      isPortrait,
      isSmallScreen,
      safePadding,
      topOffset,
      sideOffset,
      center: { x: width / 2, y: height / 2 },
    };
  }
}
