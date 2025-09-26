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
  },
  render: {
    antialias: true,
    roundPixels: false,
    pixelArt: false,
  },
  currentLevel: 1,
  getLevels: function (isPortrait) {
    if (isPortrait) {
      return [
        { pairs: 2, time: 15 },
        { pairs: 3, time: 20 },
        { pairs: 3, time: 15 },
        { pairs: 4, time: 25 },
        { pairs: 4, time: 20 },
        { pairs: 4, time: 15 },
        { pairs: 4, time: 10 },
      ];
    } else {
      return [
        { pairs: 2, time: 15 },
        { pairs: 3, time: 20 },
        { pairs: 4, time: 25 },
        { pairs: 5, time: 30 },
        { pairs: 5, time: 25 },
        { pairs: 5, time: 20 },
        { pairs: 5, time: 15 },
      ];
    }
  },
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
