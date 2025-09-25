class Card extends Phaser.GameObjects.Sprite {
  constructor(scene, value) {
    super(scene, 0, 0, "card");
    this.scene = scene;
    this.value = value;
    this.setOrigin(0.5, 0.5);
    this.scene.add.existing(this);

    this.setInteractive();
    this.opened = false;
    this.isAnimating = false;
    this.currentScale = 1;
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
    if (this.isAnimating || this.opened) return;

    this.isAnimating = true;
    this.opened = true;

    this.hide(() => {
      this.show(() => {
        this.isAnimating = false;
        if (callback) callback();
      });
    });
  }

  close(callback) {
    if (!this.opened || this.isAnimating) return;

    this.isAnimating = true;

    this.hide(() => {
      this.opened = false;
      this.show(() => {
        this.isAnimating = false;
        if (callback) callback();
      });
    });
  }

  hide(callback) {
    const targetScale = this.scaleX;

    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      ease: "Linear",
      duration: 100,
      onComplete: () => {
        if (callback) callback();
      },
    });
  }

  show(callback) {
    let texture = this.opened ? "card" + this.value : "card";
    this.setTexture(texture);

    this.scene.tweens.add({
      targets: this,
      scaleX: this.currentScale,
      ease: "Linear",
      duration: 100,
      onComplete: () => {
        if (callback) callback();
      },
    });
  }

  setCardScale(scale) {
    this.currentScale = scale;
    this.setScale(scale);
  }
}
