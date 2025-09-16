class RecordsScene extends Phaser.Scene {
  constructor() {
    super("Records");
    this.records = [];
    this.sortedRecords = [];
    this.tableContainer = null;
    this.headersContainer = null;
  }

  init() {
    this.sortBy = "date";
    this.sortOrder = "desc";
    this.loadRecords();
  }

  create() {
    const dpi = window.devicePixelRatio || 1;
    this.createModal();
    this.createTitle(dpi);
    this.createTable(dpi);
    this.createClearButton(dpi);
    this.createCloseButton(dpi);
  }

  loadRecords() {
    try {
      const records = localStorage.getItem("memoryGameRecords");
      this.records = records ? JSON.parse(records) : [];
      this.sortedRecords = this.sortRecords(this.records);
    } catch (error) {
      this.records = [];
      this.sortedRecords = [];
    }
  }

  createModal() {
    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.7);
    let modal = this.add.image(640, 360, "modalBg");
    modal.setDisplaySize(1600, 800);
  }

  createTitle(dpi) {
    this.add
      .text(640, 140, "Best 5 records", {
        font: "42px GardenFlower",
        fill: "#8B4513",
        align: "center",
      })
      .setOrigin(0.5)
      .setResolution(dpi);
  }

  createTable(dpi) {
    this.tableContainer = this.add.container(0, 0);
    this.createTableHeaders(220, dpi);
    this.createTableData(290, dpi);
  }

  createTableHeaders(headerY, dpi) {
    this.headersContainer = this.add.container(0, 0);
    this.headersContainer.add(
      this.add
        .text(400, headerY, "Date & Time", {
          font: "28px GardenFlower",
          fill: "#8B4513",
          align: "center",
        })
        .setOrigin(0.5)
        .setResolution(dpi)
    );

    const timeHeader = this.add
      .text(640, headerY, "Total Time", {
        font: "28px GardenFlower",
        fill: this.sortBy === "time" ? "#FFD700" : "#8B4513",
        align: "center",
      })
      .setOrigin(0.5)
      .setResolution(dpi)
      .setInteractive();

    timeHeader.on("pointerover", () => {
      timeHeader.setStyle({ fill: "#FFD700" });
      this.input.setDefaultCursor("pointer");
    });

    timeHeader.on("pointerout", () => {
      timeHeader.setStyle({
        fill: this.sortBy === "time" ? "#FFD700" : "#8B4513",
      });
      this.input.setDefaultCursor("default");
    });

    timeHeader.on("pointerdown", () => {
      this.handleSort("time");
    });

    this.headersContainer.add(timeHeader);

    if (this.sortBy === "time") {
      const arrow = this.sortOrder === "desc" ? "↓" : "↑";
      this.headersContainer.add(
        this.add
          .text(700, headerY, arrow, {
            font: "20px GardenFlower",
            fill: "#FFD700",
            align: "center",
          })
          .setOrigin(0.5)
          .setResolution(dpi)
      );
    }

    const scoreHeader = this.add
      .text(880, headerY, "Total Score", {
        font: "28px GardenFlower",
        fill: this.sortBy === "score" ? "#FFD700" : "#8B4513",
        align: "center",
      })
      .setOrigin(0.5)
      .setResolution(dpi)
      .setInteractive();

    scoreHeader.on("pointerover", () => {
      scoreHeader.setStyle({ fill: "#FFD700" });
      this.input.setDefaultCursor("pointer");
    });

    scoreHeader.on("pointerout", () => {
      scoreHeader.setStyle({
        fill: this.sortBy === "score" ? "#FFD700" : "#8B4513",
      });
      this.input.setDefaultCursor("default");
    });

    scoreHeader.on("pointerdown", () => {
      this.handleSort("score");
    });

    this.headersContainer.add(scoreHeader);

    if (this.sortBy === "score") {
      const arrow = this.sortOrder === "desc" ? "↓" : "↑";
      this.headersContainer.add(
        this.add
          .text(1040, headerY, arrow, {
            font: "20px GardenFlower",
            fill: "#FFD700",
            align: "center",
          })
          .setOrigin(0.5)
          .setResolution(dpi)
      );
    }

    const line = this.add.graphics();
    line.lineStyle(2, 0x8b4513);
    line.moveTo(200, headerY + 20);
    line.lineTo(1080, headerY + 20);
    // line.stroke();
    this.headersContainer.add(line);
  }

  createTableData(startY, dpi) {
    if (this.sortedRecords.length === 0) {
      this.tableContainer.add(
        this.add
          .text(
            640,
            startY + 100,
            "No records yet. Complete the game to set a record!",
            {
              font: "28px GardenFlower",
              fill: "#8B4513",
              align: "center",
            }
          )
          .setOrigin(0.5)
          .setResolution(dpi)
      );
      return;
    }

    const rowHeight = 35;
    const visibleRecords = this.sortedRecords.slice(0, 5);

    visibleRecords.forEach((record, index) => {
      const y = startY + index * rowHeight;

      const dateText = this.add
        .text(400, y, this.formatDate(record.date), {
          font: "28px GardenFlower",
          fill: "#8B4513",
          align: "center",
        })
        .setOrigin(0.5)
        .setResolution(dpi)
        .setAlpha(0);

      const timeText = this.add
        .text(640, y, this.formatTime(record.totalTime), {
          font: "28px GardenFlower",
          fill: "#8B4513",
          align: "center",
        })
        .setOrigin(0.5)
        .setResolution(dpi)
        .setAlpha(0);

      const scoreText = this.add
        .text(880, y, record.totalScore.toString(), {
          font: "28px GardenFlower",
          fill: "#8B4513",
          align: "center",
        })
        .setOrigin(0.5)
        .setResolution(dpi)
        .setAlpha(0);

      this.tableContainer.add(dateText);
      this.tableContainer.add(timeText);
      this.tableContainer.add(scoreText);

      this.tweens.add({
        targets: [dateText, timeText, scoreText],
        alpha: 1,
        y: y,
        duration: 300,
        delay: index * 100,
        ease: "Power2",
      });
    });
  }

  handleSort(column) {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === "desc" ? "asc" : "desc";
    } else {
      this.sortBy = column;
      this.sortOrder = "desc";
    }

    this.tweens.add({
      targets: this.tableContainer,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        this.sortedRecords = this.sortRecords(this.records);
        this.updateTable();
        this.tweens.add({
          targets: this.tableContainer,
          alpha: 1,
          duration: 200,
        });
      },
    });
  }

  updateTable() {
    const dpi = window.devicePixelRatio || 1;

    if (this.tableContainer) {
      this.tableContainer.destroy();
    }
    if (this.headersContainer) {
      this.headersContainer.destroy();
    }

    this.createTable(dpi);
  }

  sortRecords(records) {
    return [...records].sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case "date":
          comparison = new Date(b.date) - new Date(a.date);
          break;
        case "time":
          comparison = a.totalTime - b.totalTime;
          break;
        case "score":
          comparison = b.totalScore - a.totalScore;
          break;
      }

      return this.sortOrder === "desc" ? comparison : -comparison;
    });
  }

  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return `${day}.${month}.${year} ${hours}:${minutes}`;
    } catch (error) {
      return "Invalid date";
    }
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toString().padStart(2, "0")}s`;
  }

  createClearButton(dpi) {
    let buttonBg = this.add.graphics();
    this.drawButton(buttonBg, 0xdc143c, 120, 50);

    let button = this.add
      .text(0, 3, "Clear", {
        font: "24px GardenFlower",
        fill: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setResolution(dpi);

    let buttonContainer = this.add.container(500, 550, [buttonBg, button]);
    buttonContainer.setSize(120, 45);
    buttonContainer.setInteractive();

    this.setupClearButtonEvents(buttonContainer, buttonBg);
  }

  createCloseButton(dpi) {
    let buttonBg = this.add.graphics();
    this.drawButton(buttonBg, 0x8b4513, 120, 50);

    let button = this.add
      .text(0, 3, "Close", {
        font: "24px GardenFlower",
        fill: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setResolution(dpi);

    let buttonContainer = this.add.container(780, 550, [buttonBg, button]);
    buttonContainer.setSize(120, 45);
    buttonContainer.setInteractive();

    this.setupCloseButtonEvents(buttonContainer, buttonBg);
  }

  drawButton(graphics, color, width = 120, height = 40) {
    graphics.clear();
    graphics.fillStyle(color);
    graphics.fillRoundedRect(-width / 2, -height / 2, width, height, 20);
  }

  setupClearButtonEvents(container, buttonBg) {
    const dpi = window.devicePixelRatio || 1;

    container.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");
      this.animateButton(container, 1.05);
      this.drawButton(buttonBg, 0xff1744, 120, 45);
    });

    container.on("pointerout", () => {
      this.input.setDefaultCursor("default");
      this.animateButton(container, 1);
      this.drawButton(buttonBg, 0xdc143c, 120, 45);
    });

    container.on("pointerdown", () => {
      this.showClearConfirmation(dpi);
    });
  }

  setupCloseButtonEvents(container, buttonBg) {
    container.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");
      this.animateButton(container, 1.05);
      this.drawButton(buttonBg, 0xa0522d, 120, 45);
    });

    container.on("pointerout", () => {
      this.input.setDefaultCursor("default");
      this.animateButton(container, 1);
      this.drawButton(buttonBg, 0x8b4513, 120, 45);
    });

    container.on("pointerdown", () => {
      this.handleCloseClick();
    });
  }

  showClearConfirmation(dpi) {
    const overlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.8);

    const confirmModal = this.add.graphics();
    confirmModal.fillStyle(0x8b4513, 0.9);
    confirmModal.lineStyle(3, 0xffffff);
    confirmModal.fillRoundedRect(440, 260, 400, 200, 20);
    confirmModal.strokeRoundedRect(440, 260, 400, 200, 20);

    const confirmText = this.add
      .text(640, 320, "Clear all records?", {
        font: "24px GardenFlower",
        fill: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setResolution(dpi);

    const yesButton = this.add
      .text(580, 390, "Yes", {
        font: "32px GardenFlower",
        fill: "#FFD700",
        align: "center",
      })
      .setOrigin(0.5)
      .setResolution(dpi)
      .setInteractive();

    const noButton = this.add
      .text(700, 390, "No", {
        font: "32px GardenFlower",
        fill: "#FFD700",
        align: "center",
      })
      .setOrigin(0.5)
      .setResolution(dpi)
      .setInteractive();

    yesButton.on("pointerdown", () => {
      overlay.destroy();
      confirmModal.destroy();
      confirmText.destroy();
      yesButton.destroy();
      noButton.destroy();
      this.handleClearRecords();
    });

    noButton.on("pointerdown", () => {
      overlay.destroy();
      confirmModal.destroy();
      confirmText.destroy();
      yesButton.destroy();
      noButton.destroy();
    });
  }

  handleClearRecords() {
    localStorage.removeItem("memoryGameRecords");
    this.records = [];
    this.sortedRecords = [];
    this.updateTable();
  }

  animateButton(target, scale) {
    this.tweens.add({
      targets: target,
      scaleX: scale,
      scaleY: scale,
      duration: 150,
      ease: "Power2",
    });
  }

  handleCloseClick() {
    this.input.setDefaultCursor("default");
    this.scene.stop();
    this.scene.resume("Game");
  }
}
