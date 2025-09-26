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
    this.scale.on("resize", this.handleResize, this);
    const dpi = this.getImprovedDPI();
    this.createModal();
    this.createTitle(dpi);
    this.createTable(dpi);
    this.createClearButton(dpi);
    this.createCloseButton(dpi);
  }

  getImprovedDPI() {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const { width, height } = this.getRealSize();
    const isPortrait = height > width;
    return isPortrait
      ? Math.max(2, Math.min(devicePixelRatio, 4))
      : Math.max(1, Math.min(devicePixelRatio, 3));
  }

  getRealSize() {
    return {
      width: this.scale.width,
      height: this.scale.height,
    };
  }

  handleResize() {
    if (!this.scene.isActive()) return;

    this.children.removeAll();
    this.tableContainer = null;
    this.headersContainer = null;

    const dpi = this.getImprovedDPI();
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
    const { width, height } = this.getRealSize();
    const isPortrait = height > width;
    const isSmallScreen = width < 480;
    const isMediumScreen = width >= 480 && width < 768;
    const isLargeScreen = width >= 768 && width < 1024;
    const isXLargeScreen = width >= 1024;

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

    let modalWidth, modalHeight;

    if (isPortrait) {
      if (isSmallScreen) {
        modalWidth = width * 1.5;
        modalHeight = Math.min(height * 0.92, 700);
      } else if (isMediumScreen) {
        modalWidth = width * 1.5;
        modalHeight = Math.min(height * 0.94, 800);
      } else {
        modalWidth = Math.min(width * 0.5, 1200);
        modalHeight = Math.min(height * 0.9, 900);
      }
    } else {
      if (isSmallScreen) {
        modalWidth = width * 0.98;
        modalHeight = Math.min(height * 0.95, 600);
      } else if (isMediumScreen) {
        modalWidth = width * 1.5;
        modalHeight = Math.min(height * 0.95, 700);
      } else if (isLargeScreen) {
        modalWidth = Math.min(width * 1.5, 1400);
        modalHeight = Math.min(height * 1.2, 800);
      } else {
        modalWidth = Math.min(width * 1.5, 1850);
        modalHeight = Math.min(height * 1.2, 900);
      }
    }

    let modal = this.add.image(width / 2, height / 2, "modalBg");
    modal.setDisplaySize(modalWidth, modalHeight);
  }

  createTitle(dpi) {
    const { width, height } = this.getRealSize();
    const isPortrait = height > width;
    const isSmallScreen = width < 480;
    const isMediumScreen = width >= 480 && width < 768;

    let fontSize, titleY;

    if (isPortrait) {
      if (isSmallScreen) {
        fontSize = "24px";
        titleY = height * 0.24;
      } else if (isMediumScreen) {
        fontSize = "28px";
        titleY = height * 0.23;
      } else {
        fontSize = "32px";
        titleY = height * 0.235;
      }
    } else {
      if (isSmallScreen) {
        fontSize = "28px";
        titleY = height * 0.2;
      } else if (isMediumScreen) {
        fontSize = "30px";
        titleY = height * 0.23;
      } else {
        fontSize = "36px";
        titleY = height * 0.18;
      }
    }

    // this.add
    //   .text(width / 2, titleY, "Best 5 records", {
    //     font: `${fontSize} GardenFlower`,
    //     fill: "#8B4513",
    //     align: "center",
    //     resolution: dpi * 2,
    //   })
    //   .setOrigin(0.5)
    //   .setResolution(dpi * 2);
  }

  createTable(dpi) {
    const { width, height } = this.getRealSize();
    const isPortrait = height > width;
    const isSmallScreen = width < 480;

    this.tableContainer = this.add.container(0, 0);

    let headerY, dataStartY;

    if (isPortrait) {
      if (isSmallScreen) {
        headerY = height * 0.32;
        dataStartY = headerY + 35;
      } else {
        headerY = height * 0.33;
        dataStartY = headerY + 40;
      }
    } else {
      if (isSmallScreen) {
        headerY = height * 0.3;
        dataStartY = headerY + 40;
      } else {
        headerY = height * 0.32;
        dataStartY = headerY + 50;
      }
    }

    this.createTableHeaders(headerY, dpi);
    this.createTableData(dataStartY, dpi);
  }

  createTableHeaders(headerY, dpi) {
    const { width } = this.getRealSize();
    const isPortrait = width < 600;
    const isSmallScreen = width < 480;
    const isMediumScreen = width >= 480 && width < 768;

    this.headersContainer = this.add.container(0, 0);

    let col1X, col2X, col3X;
    let fontSize, arrowFontSize;

    if (isPortrait) {
      if (isSmallScreen) {
        fontSize = "16px";
        arrowFontSize = "12px";
      } else if (isMediumScreen) {
        fontSize = "18px";
        arrowFontSize = "14px";
      } else {
        fontSize = "20px";
        arrowFontSize = "16px";
      }
    } else {
      if (isSmallScreen) {
        fontSize = "18px";
        arrowFontSize = "14px";
      } else if (isMediumScreen) {
        fontSize = "22px";
        arrowFontSize = "16px";
      } else {
        fontSize = "24px";
        arrowFontSize = "20px";
      }
    }

    if (isPortrait) {
      if (isSmallScreen) {
        col1X = width * 0.2;
        col2X = width * 0.5;
        col3X = width * 0.8;
      } else {
        col1X = width * 0.25;
        col2X = width * 0.5;
        col3X = width * 0.75;
      }
    } else {
      if (isSmallScreen) {
        col1X = width * 0.3;
        col2X = width * 0.5;
        col3X = width * 0.7;
      } else if (isMediumScreen) {
        col1X = width * 0.25;
        col2X = width * 0.5;
        col3X = width * 0.75;
      } else {
        col1X = width * 0.25;
        col2X = width * 0.5;
        col3X = width * 0.75;
      }
    }

    this.headersContainer.add(
      this.add
        .text(col1X, headerY, isPortrait ? "Date" : "Date & Time", {
          font: `${fontSize} GardenFlower`,
          fill: "#8B4513",
          align: "center",
          resolution: dpi * 2,
        })
        .setOrigin(0.5)
        .setResolution(dpi * 2)
    );

    const timeHeader = this.add
      .text(col2X, headerY, isPortrait ? "Time" : "Total Time", {
        font: `${fontSize} GardenFlower`,
        fill: this.sortBy === "time" ? "#FFD700" : "#8B4513",
        align: "center",
        resolution: dpi * 2,
      })
      .setOrigin(0.5)
      .setResolution(dpi * 2)
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
      let arrowX;

      if (isPortrait) {
        arrowX = isSmallScreen ? col2X + 20 : col2X + 30;
      } else {
        arrowX = isSmallScreen
          ? col2X + 40
          : isMediumScreen
          ? col2X + 50
          : col2X + 60;
      }

      this.headersContainer.add(
        this.add
          .text(arrowX, headerY, arrow, {
            font: `${arrowFontSize} GardenFlower`,
            fill: "#FFD700",
            align: "center",
            resolution: dpi * 2,
          })
          .setOrigin(0.5)
          .setResolution(dpi * 2)
      );
    }

    const scoreHeader = this.add
      .text(col3X, headerY, isPortrait ? "Score" : "Total Score", {
        font: `${fontSize} GardenFlower`,
        fill: this.sortBy === "score" ? "#FFD700" : "#8B4513",
        align: "center",
        resolution: dpi * 2,
      })
      .setOrigin(0.5)
      .setResolution(dpi * 2)
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
      let arrowX;

      if (isPortrait) {
        arrowX = isSmallScreen ? col3X + 20 : col3X + 30;
      } else {
        arrowX = isSmallScreen
          ? col3X + 50
          : isMediumScreen
          ? col3X + 65
          : col3X + 80;
      }

      this.headersContainer.add(
        this.add
          .text(arrowX, headerY, arrow, {
            font: `${arrowFontSize} GardenFlower`,
            fill: "#FFD700",
            align: "center",
            resolution: dpi * 2,
          })
          .setOrigin(0.5)
          .setResolution(dpi * 2)
      );
    }
  }

  createTableData(startY, dpi) {
    const { width, height } = this.getRealSize();
    const isPortrait = width < 600;
    const isSmallScreen = width < 480;
    const isMediumScreen = width >= 480 && width < 768;

    if (this.sortedRecords.length === 0) {
      let noRecordsText, fontSize;

      if (isPortrait) {
        if (isSmallScreen) {
          noRecordsText =
            "No records yet.\nComplete the game\nto set a record!";
          fontSize = "16px";
        } else {
          noRecordsText =
            "No records yet.\nComplete the game\nto set a record!";
          fontSize = "20px";
        }
      } else {
        if (isSmallScreen) {
          noRecordsText = "No records yet.\nComplete the game to set a record!";
          fontSize = "18px";
        } else if (isMediumScreen) {
          noRecordsText = "No records yet.\nComplete the game to set a record!";
          fontSize = "22px";
        } else {
          noRecordsText = "No records yet.\nComplete the game to set a record!";
          fontSize = "24px";
        }
      }

      this.tableContainer.add(
        this.add
          .text(width / 2, startY + 80, noRecordsText, {
            font: `${fontSize} GardenFlower`,
            fill: "#8B4513",
            align: "center",
            lineSpacing: 8,
            resolution: dpi * 2,
          })
          .setOrigin(0.5)
          .setResolution(dpi * 2)
      );
      return;
    }

    let col1X, col2X, col3X;
    let fontSize;

    if (isPortrait) {
      if (isSmallScreen) {
        fontSize = "14px";
      } else if (isMediumScreen) {
        fontSize = "16px";
      } else {
        fontSize = "18px";
      }
    } else {
      if (isSmallScreen) {
        fontSize = "16px";
      } else if (isMediumScreen) {
        fontSize = "20px";
      } else {
        fontSize = "24px";
      }
    }

    if (isPortrait) {
      if (isSmallScreen) {
        col1X = width * 0.2;
        col2X = width * 0.5;
        col3X = width * 0.8;
      } else {
        col1X = width * 0.25;
        col2X = width * 0.5;
        col3X = width * 0.75;
      }
    } else {
      if (isSmallScreen) {
        col1X = width * 0.3;
        col2X = width * 0.5;
        col3X = width * 0.7;
      } else if (isMediumScreen) {
        col1X = width * 0.25;
        col2X = width * 0.5;
        col3X = width * 0.75;
      } else {
        col1X = width * 0.25;
        col2X = width * 0.5;
        col3X = width * 0.75;
      }
    }

    let rowHeight;
    if (isPortrait) {
      rowHeight = 30;
    } else {
      rowHeight = isSmallScreen ? 28 : isMediumScreen ? 32 : 35;
    }

    const visibleRecords = this.sortedRecords.slice(0, 5);

    visibleRecords.forEach((record, index) => {
      const y = startY + index * rowHeight;

      const formattedDate = isPortrait
        ? this.formatDateShort(record.date)
        : this.formatDate(record.date);

      const dateText = this.add
        .text(col1X, y, formattedDate, {
          font: `${fontSize} GardenFlower`,
          fill: "#8B4513",
          align: "center",
          resolution: dpi * 2,
        })
        .setOrigin(0.5)
        .setResolution(dpi * 2)
        .setAlpha(0);

      const timeText = this.add
        .text(col2X, y, this.formatTime(record.totalTime), {
          font: `${fontSize} GardenFlower`,
          fill: "#8B4513",
          align: "center",
          resolution: dpi * 2,
        })
        .setOrigin(0.5)
        .setResolution(dpi * 2)
        .setAlpha(0);

      const scoreText = this.add
        .text(col3X, y, record.totalScore.toString(), {
          font: `${fontSize} GardenFlower`,
          fill: "#8B4513",
          align: "center",
          resolution: dpi * 2,
        })
        .setOrigin(0.5)
        .setResolution(dpi * 2)
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

  createClearButton(dpi) {
    const { width, height } = this.getRealSize();
    const isPortrait = height > width;
    const isSmallScreen = width < 480;
    const isMediumScreen = width >= 480 && width < 768;

    let clearButtonX, buttonY, buttonWidth, buttonHeight, fontSize;

    if (isPortrait) {
      if (isSmallScreen) {
        clearButtonX = width * 0.3;
        buttonY = height * 0.7;
        buttonWidth = 80;
        buttonHeight = 35;
        fontSize = "18px";
      } else if (isMediumScreen) {
        clearButtonX = width * 0.32;
        buttonY = height * 0.7;
        buttonWidth = 90;
        buttonHeight = 40;
        fontSize = "20px";
      } else {
        clearButtonX = width * 0.35;
        buttonY = height * 0.88;
        buttonWidth = 100;
        buttonHeight = 45;
        fontSize = "22px";
      }
    } else {
      if (isSmallScreen) {
        clearButtonX = width * 0.35;
        buttonY = height * 0.7;
        buttonWidth = 80;
        buttonHeight = 35;
        fontSize = "18px";
      } else if (isMediumScreen) {
        clearButtonX = width * 0.37;
        buttonY = height * 0.72;
        buttonWidth = 90;
        buttonHeight = 40;
        fontSize = "20px";
      } else {
        clearButtonX = width * 0.4;
        buttonY = height * 0.75;
        buttonWidth = 100;
        buttonHeight = 45;
        fontSize = "22px";
      }
    }

    let buttonBg = this.add.graphics();
    this.drawButton(buttonBg, 0xdc143c, buttonWidth, buttonHeight);

    let button = this.add
      .text(0, 3, "Clear", {
        font: `${fontSize} GardenFlower`,
        fill: "#ffffff",
        align: "center",
        resolution: dpi * 2,
      })
      .setOrigin(0.5)
      .setResolution(dpi * 2);

    let buttonContainer = this.add.container(clearButtonX, buttonY, [
      buttonBg,
      button,
    ]);
    buttonContainer.setSize(buttonWidth, buttonHeight);
    buttonContainer.setInteractive();

    this.setupClearButtonEvents(buttonContainer, buttonBg);
  }

  createCloseButton(dpi) {
    const { width, height } = this.getRealSize();
    const isPortrait = height > width;
    const isSmallScreen = width < 480;
    const isMediumScreen = width >= 480 && width < 768;

    let closeButtonX, buttonY, buttonWidth, buttonHeight, fontSize;

    if (isPortrait) {
      if (isSmallScreen) {
        closeButtonX = width * 0.7;
        buttonY = height * 0.7;
        buttonWidth = 80;
        buttonHeight = 35;
        fontSize = "18px";
      } else if (isMediumScreen) {
        closeButtonX = width * 0.68;
        buttonY = height * 0.7;
        buttonWidth = 90;
        buttonHeight = 40;
        fontSize = "20px";
      } else {
        closeButtonX = width * 0.65;
        buttonY = height * 0.88;
        buttonWidth = 100;
        buttonHeight = 45;
        fontSize = "22px";
      }
    } else {
      if (isSmallScreen) {
        closeButtonX = width * 0.65;
        buttonY = height * 0.7;
        buttonWidth = 80;
        buttonHeight = 35;
        fontSize = "18px";
      } else if (isMediumScreen) {
        closeButtonX = width * 0.63;
        buttonY = height * 0.72;
        buttonWidth = 90;
        buttonHeight = 40;
        fontSize = "20px";
      } else {
        closeButtonX = width * 0.6;
        buttonY = height * 0.75;
        buttonWidth = 100;
        buttonHeight = 45;
        fontSize = "22px";
      }
    }

    let buttonBg = this.add.graphics();
    this.drawButton(buttonBg, 0x8b4513, buttonWidth, buttonHeight);

    let button = this.add
      .text(0, 3, "Close", {
        font: `${fontSize} GardenFlower`,
        fill: "#ffffff",
        align: "center",
        resolution: dpi * 2,
      })
      .setOrigin(0.5)
      .setResolution(dpi * 2);

    let buttonContainer = this.add.container(closeButtonX, buttonY, [
      buttonBg,
      button,
    ]);
    buttonContainer.setSize(buttonWidth, buttonHeight);
    buttonContainer.setInteractive();

    this.setupCloseButtonEvents(buttonContainer, buttonBg);
  }

  formatDateShort(dateString) {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      return `${day}.${month}\n${hours}:${minutes}`;
    } catch (error) {
      return "Invalid";
    }
  }

  drawButton(graphics, color, width = 120, height = 40) {
    graphics.clear();
    graphics.fillStyle(color);
    graphics.fillRoundedRect(-width / 2, -height / 2, width, height, 20);
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
    const { height } = this.getRealSize();

    if (this.tableContainer) {
      this.tableContainer.destroy();
    }
    if (this.headersContainer) {
      this.headersContainer.destroy();
    }

    this.tableContainer = this.add.container(0, 0);

    const headerY = height * 0.25;
    const dataStartY = height * 0.35;

    this.createTableHeaders(headerY, dpi);
    this.createTableData(dataStartY, dpi);
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

  setupClearButtonEvents(container, buttonBg) {
    const dpi = window.devicePixelRatio || 1;

    container.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");
      this.animateButton(container, 1.05);
      this.drawButton(buttonBg, 0xff1744, 100, 45);
    });

    container.on("pointerout", () => {
      this.input.setDefaultCursor("default");
      this.animateButton(container, 1);
      this.drawButton(buttonBg, 0xdc143c, 100, 45);
    });

    container.on("pointerdown", () => {
      this.showClearConfirmation(dpi);
    });
  }

  setupCloseButtonEvents(container, buttonBg) {
    container.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");
      this.animateButton(container, 1.05);
      this.drawButton(buttonBg, 0xa0522d, 100, 45);
    });

    container.on("pointerout", () => {
      this.input.setDefaultCursor("default");
      this.animateButton(container, 1);
      this.drawButton(buttonBg, 0x8b4513, 100, 45);
    });

    container.on("pointerdown", () => {
      this.handleCloseClick();
    });
  }

  showClearConfirmation(dpi) {
    const { width, height } = this.getRealSize();
    const isPortrait = height > width;

    const overlay = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.8
    );

    const confirmModal = this.add.graphics();

    const modalWidth = isPortrait ? width * 0.8 : 400;
    const modalHeight = isPortrait ? height * 0.3 : 200;
    const modalX = width / 2 - modalWidth / 2;
    const modalY = height / 2 - modalHeight / 2;

    confirmModal.fillStyle(0x8b4513, 0.9);
    confirmModal.lineStyle(3, 0xffffff);
    confirmModal.fillRoundedRect(modalX, modalY, modalWidth, modalHeight, 20);
    confirmModal.strokeRoundedRect(modalX, modalY, modalWidth, modalHeight, 20);

    const confirmText = this.add
      .text(width / 2, height / 2 - 30, "Clear all records?", {
        font: isPortrait ? "20px GardenFlower" : "24px GardenFlower",
        fill: "#ffffff",
        align: "center",
        resolution: dpi * 2,
      })
      .setOrigin(0.5)
      .setResolution(dpi * 2);

    const buttonY = height / 2 + 30;
    const yesButtonX = isPortrait ? width / 2 - 50 : width / 2 - 60;
    const noButtonX = isPortrait ? width / 2 + 50 : width / 2 + 60;

    const yesButton = this.add
      .text(yesButtonX, buttonY, "Yes", {
        font: "28px GardenFlower",
        fill: "#FFD700",
        align: "center",
        resolution: dpi * 2,
      })
      .setOrigin(0.5)
      .setResolution(dpi * 2)
      .setInteractive();

    const noButton = this.add
      .text(noButtonX, buttonY, "No", {
        font: "28px GardenFlower",
        fill: "#FFD700",
        align: "center",
        resolution: dpi * 2,
      })
      .setOrigin(0.5)
      .setResolution(dpi * 2)
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

  destroy() {
    this.scale.off("resize", this.handleResize, this);
    super.destroy();
  }
}
