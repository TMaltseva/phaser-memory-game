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

  open() {
    this.opened = true;
    this.hide();
  }

  close() {
    if (this.opened) {
      this.opened = false;
      this.hide();
    }
  }

  hide() {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      ease: "Linear",
      duration: 200,
      onComplete: () => this.show(),
    });
  }

  show() {
    let texture = this.opened ? "card" + this.value : "card";

    this.setTexture(texture);
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      ease: "Linear",
      duration: 200,
    });
  }
}
