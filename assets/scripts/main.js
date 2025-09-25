let config = {
  type: Phaser.AUTO,
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
    zoom: 1 / window.devicePixelRatio,
  },
  render: {
    antialias: true,
    roundPixels: false,
    transparent: false,
    clearBeforeRender: true,
    pixelArt: false,
    antialiasGL: true,
  },
  currentLevel: 1,
  levels: [
    { pairs: 2, time: 15 },
    { pairs: 3, time: 20 },
    { pairs: 4, time: 25 },
    { pairs: 5, time: 30 },
    { pairs: 5, time: 25 },
    { pairs: 5, time: 20 },
    { pairs: 5, time: 15 },
  ],
  scene: [GameScene, LevelCompleteScene, AboutScene, RecordsScene],
};

let game = new Phaser.Game(config);
