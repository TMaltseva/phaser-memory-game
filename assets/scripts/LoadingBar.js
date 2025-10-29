class LoadingBar {
  constructor(scene) {
    this.scene = scene;
    this.style = {
      boxColor: 0xd3d3d3,
      barColor: 0xfff8dc,
      x: 0,
      y: 0,
      width: 900,
      height: 25,
    };

    this.progressBox = this.scene.add.graphics();
    this.progressBar = this.scene.add.graphics();

    this.updatePosition();
    this.showProgressBox();
    this.setEvents();
  }

  updatePosition() {
    const width =
      (this.scene && this.scene.scale && this.scene.scale.width) ||
      window.innerWidth ||
      800;
    const height =
      (this.scene && this.scene.scale && this.scene.scale.height) ||
      window.innerHeight ||
      600;

    if (width <= 0 || height <= 0) return;

    this.style.width = Math.min(900, Math.max(200, width * 0.8));
    this.style.x = width / 2 - this.style.width / 2;
    this.style.y = height / 2 + Math.min(250, height * 0.2);

    this.showProgressBox();
  }

  setEvents() {
    this.scene.load.on("progress", this.showProgressBar, this);
    this.scene.load.on("fileprogress", this.onFileProgress, this);
    this.scene.load.on("complete", this.onLoadComplete, this);

    this.scene.scale.on("resize", this.updatePosition, this);
  }

  showProgressBox() {
    if (!this.progressBox) return;

    this.progressBox
      .clear()
      .fillStyle(this.style.boxColor)
      .fillRect(
        this.style.x,
        this.style.y,
        this.style.width,
        this.style.height
      );
  }

  onFileProgress(file) {
    // console.log(file);
  }

  onLoadComplete() {
    if (this.scene && this.scene.load) {
      this.scene.load.off("progress", this.showProgressBar, this);
      this.scene.load.off("fileprogress", this.onFileProgress, this);
      this.scene.load.off("complete", this.onLoadComplete, this);
    }
    if (this.scene && this.scene.scale) {
      this.scene.scale.off("resize", this.updatePosition, this);
    }

    if (this.progressBar) this.progressBar.destroy();
    if (this.progressBox) this.progressBox.destroy();
  }

  showProgressBar(value) {
    if (typeof value !== "number" || isNaN(value) || value < 0) {
      value = 0;
    }
    if (value > 1) {
      value = 1;
    }

    if (!this.progressBar || !this.progressBox) return;

    this.progressBar
      .clear()
      .fillStyle(this.style.barColor)
      .fillRect(
        this.style.x,
        this.style.y,
        this.style.width * value,
        this.style.height
      );
  }
}
