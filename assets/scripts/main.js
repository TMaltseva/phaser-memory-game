let config = {
  type: Phaser.WEBGL,
  pixelArt: false,
  antialias: true,
  roundPixels: false,
  //   width: 1280,
  //   height: 720,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 400,
      height: 850,
    },
  },
  render: {
    antialias: true,
    roundPixels: false,
    transparent: false,
    clearBeforeRender: true,
    pixelArt: false,
    antialiasGL: true,
    powerPreference: "high-performance",
    batchSize: 4096,
    maxTextures: 16,
  },
  currentLevel: 1,
  levels: [
    { pairs: 2, time: 15 },
    { pairs: 3, time: 20 },
    { pairs: 3, time: 15 },
    { pairs: 4, time: 25 },
    { pairs: 4, time: 20 },
    { pairs: 4, time: 15 },
    { pairs: 4, time: 10 },
  ],
  scene: [GameScene, LevelCompleteScene, AboutScene, RecordsScene],
};

let game = new Phaser.Game(config);
