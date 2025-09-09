let config = {
  type: Phaser.AUTO, // webgl or canvas
  width: 1280,
  height: 720,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  rows: 2,
  cols: 5,
  cards: [1, 2, 3, 4, 5],
  scene: new GameScene(),
};

let game = new Phaser.Game(config);
