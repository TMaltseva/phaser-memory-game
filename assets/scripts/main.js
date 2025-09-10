let config = {
  type: Phaser.AUTO,
  pixelArt: false,
  antialias: true,
  width: 1280,
  height: 720,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
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
  scene: [GameScene, LevelCompleteScene],
};

let game = new Phaser.Game(config);
