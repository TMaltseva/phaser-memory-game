class Card extends Phaser.GameObjects.Sprite {
  constructor(scene, value) {
    super(scene, 0, 0, "card");
    this.scene = scene;
    this.value = value;
    this.setOrigin(0.5, 0.5);
    this.scene.add.existing(this);

    this.setInteractive();
    this.opened = false;
  }

  init(position) {
    this.position = position;
    this.close();
    this.setPosition(-this.width, -this.height);
  }

  move(params) {
    this.scene.tweens.add({
      targets: this,
      x: params.x,
      y: params.y,
      ease: "Linear",
      duration: 300,
      delay: params.delay,
      onComplete: () => {
        if (params.callback) params.callback();
      },
    });
  }

  open(callback) {
    this.opened = true;
    this.hide(callback);
  }

  close() {
    if (this.opened) {
      this.opened = false;
      this.hide();
    }
  }

  hide(callback) {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      ease: "Linear",
      duration: 200,
      onComplete: () => this.show(callback),
    });
  }

  show(callback) {
    let texture = this.opened ? "card" + this.value : "card";

    this.setTexture(texture);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      ease: "Linear",
      duration: 200,
      onComplete: () => {
        if (callback) callback();
      },
    });
  }
}
