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
    this.createModal();
    // this.createTitle();
    this.createTable();
    this.createClearButton();
    this.createCloseButton();
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

    this.createModal();
    this.createTitle();
    this.createTable();
    this.createClearButton();
    this.createCloseButton();
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

  createTitle() {
    const pos = TextUtils.getResponsivePositions(this);
    const titleY = pos.isPortrait ? pos.center.y * 0.48 : pos.center.y * 0.36;

    TextUtils.createModalTitle(
      this,
      pos.center.x,
      titleY,
      "Best 5 Records",
      32
    ).setOrigin(0.5);
  }

  createTable() {
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

    this.createTableHeaders(headerY);
    this.createTableData(dataStartY);
  }

  createTableHeaders(headerY) {
    const { width } = this.getRealSize();
    const pos = TextUtils.getResponsivePositions(this);

    const col1X = pos.isPortrait ? width * 0.25 : width * 0.25;
    const col2X = width * 0.5;
    const col3X = pos.isPortrait ? width * 0.75 : width * 0.75;

    this.headersContainer = this.add.container(0, 0);

    const dateHeader = TextUtils.createTableHeaderText(
      this,
      col1X,
      headerY,
      pos.isPortrait ? "Date" : "Date & Time",
      20
    ).setOrigin(0.5);

    this.headersContainer.add(dateHeader);

    // Заголовок Time (интерактивный)
    const timeHeader = TextUtils.createTableHeaderText(
      this,
      col2X,
      headerY,
      pos.isPortrait ? "Time" : "Total Time",
      20,
      this.sortBy === "time"
    )
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerover", () => {
        timeHeader.setStyle({ color: "#FFD700" });
        this.input.setDefaultCursor("pointer");
      })
      .on("pointerout", () => {
        timeHeader.setStyle({
          color: this.sortBy === "time" ? "#FFD700" : "#8B4513",
        });
        this.input.setDefaultCursor("default");
      })
      .on("pointerdown", () => {
        this.handleSort("time");
      });

    this.headersContainer.add(timeHeader);

    // Стрелка сортировки для времени
    if (this.sortBy === "time") {
      const arrow = this.sortOrder === "desc" ? "↓" : "↑";
      const arrowX = col2X + (pos.isPortrait ? 30 : 60);

      const arrowText = TextUtils.createTableHeaderText(
        this,
        arrowX,
        headerY,
        arrow,
        16,
        true
      ).setOrigin(0.5);

      this.headersContainer.add(arrowText);
    }

    // Заголовок Score (интерактивный) - аналогично Time
    const scoreHeader = TextUtils.createTableHeaderText(
      this,
      col3X,
      headerY,
      pos.isPortrait ? "Score" : "Total Score",
      20,
      this.sortBy === "score"
    )
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerover", () => {
        scoreHeader.setStyle({ color: "#FFD700" });
        this.input.setDefaultCursor("pointer");
      })
      .on("pointerout", () => {
        scoreHeader.setStyle({
          color: this.sortBy === "score" ? "#FFD700" : "#8B4513",
        });
        this.input.setDefaultCursor("default");
      })
      .on("pointerdown", () => {
        this.handleSort("score");
      });

    this.headersContainer.add(scoreHeader);

    // Стрелка для Score
    if (this.sortBy === "score") {
      const arrow = this.sortOrder === "desc" ? "↓" : "↑";
      const arrowX = col3X + (pos.isPortrait ? 30 : 80);

      const arrowText = TextUtils.createTableHeaderText(
        this,
        arrowX,
        headerY,
        arrow,
        16,
        true
      ).setOrigin(0.5);

      this.headersContainer.add(arrowText);
    }
  }

  createTableData(startY) {
    const { width } = this.getRealSize();
    const pos = TextUtils.getResponsivePositions(this);

    if (this.sortedRecords.length === 0) {
      const noRecordsText = pos.isPortrait
        ? "No records yet.\nComplete the game\nto set a record!"
        : "No records yet.\nComplete the game to set a record!";

      TextUtils.createModalText(
        this,
        pos.center.x,
        startY + 80,
        noRecordsText,
        20
      )
        .setOrigin(0.5)
        .setStyle({ lineSpacing: 8 });

      return;
    }

    // Позиции колонок
    const col1X = pos.isPortrait ? width * 0.25 : width * 0.25;
    const col2X = width * 0.5;
    const col3X = pos.isPortrait ? width * 0.75 : width * 0.75;
    const rowHeight = pos.isPortrait ? 40 : 35;

    const visibleRecords = this.sortedRecords.slice(0, 5);

    visibleRecords.forEach((record, index) => {
      const y = startY + index * rowHeight;

      const formattedDate = pos.isPortrait
        ? this.formatDateShort(record.date)
        : this.formatDate(record.date);

      // Дата
      const dateText = TextUtils.createTableDataText(
        this,
        col1X,
        y,
        formattedDate,
        16
      )
        .setOrigin(0.5)
        .setAlpha(0);

      // Время
      const timeText = TextUtils.createTableDataText(
        this,
        col2X,
        y,
        this.formatTime(record.totalTime),
        16
      )
        .setOrigin(0.5)
        .setAlpha(0);

      // Счет
      const scoreText = TextUtils.createTableDataText(
        this,
        col3X,
        y,
        record.totalScore.toString(),
        16
      )
        .setOrigin(0.5)
        .setAlpha(0);

      this.tableContainer.add(dateText);
      this.tableContainer.add(timeText);
      this.tableContainer.add(scoreText);

      // Анимация появления
      this.tweens.add({
        targets: [dateText, timeText, scoreText],
        alpha: 1,
        duration: 300,
        delay: index * 100,
        ease: "Power2",
      });
    });
  }

  createClearButton() {
    const { width, height } = this.getRealSize();
    const pos = TextUtils.getResponsivePositions(this);

    let clearButtonX, buttonY, buttonWidth, buttonHeight, fontSize;

    if (pos.isPortrait) {
      if (pos.isSmallScreen) {
        clearButtonX = width * 0.3;
        buttonY = height * 0.7;
        buttonWidth = 80;
        buttonHeight = 35;
        fontSize = 18;
      } else {
        clearButtonX = width * 0.32;
        buttonY = height * 0.7;
        buttonWidth = 90;
        buttonHeight = 40;
        fontSize = 20;
      }
    } else {
      if (pos.isSmallScreen) {
        clearButtonX = width * 0.35;
        buttonY = height * 0.7;
        buttonWidth = 80;
        buttonHeight = 35;
        fontSize = 18;
      } else {
        clearButtonX = width * 0.37;
        buttonY = height * 0.72;
        buttonWidth = 90;
        buttonHeight = 40;
        fontSize = 20;
      }
    }

    // Создаем фон кнопки (красный для Clear)
    let buttonBg = this.add.graphics();
    this.drawButton(buttonBg, 0xdc143c, buttonWidth, buttonHeight);

    // Создаем текст кнопки с помощью TextUtils
    let button = TextUtils.createButtonText(
      this,
      0,
      3,
      "Clear",
      fontSize
    ).setOrigin(0.5);

    // Создаем контейнер с кнопкой
    let buttonContainer = this.add.container(clearButtonX, buttonY, [
      buttonBg,
      button,
    ]);
    buttonContainer.setSize(buttonWidth, buttonHeight);
    buttonContainer.setInteractive();

    this.setupClearButtonEvents(
      buttonContainer,
      buttonBg,
      buttonWidth,
      buttonHeight
    );
  }

  createCloseButton() {
    const { width, height } = this.getRealSize();
    const pos = TextUtils.getResponsivePositions(this);

    let closeButtonX, buttonY, buttonWidth, buttonHeight, fontSize;

    if (pos.isPortrait) {
      if (pos.isSmallScreen) {
        closeButtonX = width * 0.7;
        buttonY = height * 0.7;
        buttonWidth = 80;
        buttonHeight = 35;
        fontSize = 18;
      } else {
        closeButtonX = width * 0.68;
        buttonY = height * 0.7;
        buttonWidth = 90;
        buttonHeight = 40;
        fontSize = 20;
      }
    } else {
      if (pos.isSmallScreen) {
        closeButtonX = width * 0.65;
        buttonY = height * 0.7;
        buttonWidth = 80;
        buttonHeight = 35;
        fontSize = 18;
      } else {
        closeButtonX = width * 0.63;
        buttonY = height * 0.72;
        buttonWidth = 90;
        buttonHeight = 40;
        fontSize = 20;
      }
    }

    // Создаем фон кнопки
    let buttonBg = this.add.graphics();
    this.drawButton(buttonBg, 0x8b4513, buttonWidth, buttonHeight);

    // Создаем текст кнопки с помощью TextUtils
    let button = TextUtils.createButtonText(
      this,
      0,
      3,
      "Close",
      fontSize
    ).setOrigin(0.5);

    // Создаем контейнер с кнопкой
    let buttonContainer = this.add.container(closeButtonX, buttonY, [
      buttonBg,
      button,
    ]);
    buttonContainer.setSize(buttonWidth, buttonHeight);
    buttonContainer.setInteractive();

    this.setupCloseButtonEvents(
      buttonContainer,
      buttonBg,
      buttonWidth,
      buttonHeight
    );
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

    this.createTableHeaders(headerY);
    this.createTableData(dataStartY);
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

  setupClearButtonEvents(container, buttonBg, buttonWidth, buttonHeight) {
    container.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");
      this.animateButton(container, 1.05);
      this.drawButton(buttonBg, 0xff1744, buttonWidth, buttonHeight); // Более яркий красный при hover
    });

    container.on("pointerout", () => {
      this.input.setDefaultCursor("default");
      this.animateButton(container, 1);
      this.drawButton(buttonBg, 0xdc143c, buttonWidth, buttonHeight); // Обычный красный
    });

    container.on("pointerdown", () => {
      this.showClearConfirmation();
    });
  }

  setupCloseButtonEvents(container, buttonBg, buttonWidth, buttonHeight) {
    container.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");
      this.animateButton(container, 1.05);
      this.drawButton(buttonBg, 0xa0522d, buttonWidth, buttonHeight); // Более светлый коричневый при hover
    });

    container.on("pointerout", () => {
      this.input.setDefaultCursor("default");
      this.animateButton(container, 1);
      this.drawButton(buttonBg, 0x8b4513, buttonWidth, buttonHeight); // Обычный коричневый
    });

    container.on("pointerdown", () => {
      this.handleCloseClick();
    });
  }

  showClearConfirmation() {
    const { width, height } = this.getRealSize();
    const pos = TextUtils.getResponsivePositions(this);

    // Создаем затемняющий оверлей
    const overlay = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.8
    );

    // Параметры модального окна
    const modalWidth = pos.isPortrait ? width * 0.8 : 400;
    const modalHeight = pos.isPortrait ? height * 0.3 : 200;
    const modalX = width / 2 - modalWidth / 2;
    const modalY = height / 2 - modalHeight / 2;

    // Создаем фон модального окна
    const confirmModal = this.add.graphics();
    confirmModal.fillStyle(0x8b4513, 0.9);
    confirmModal.lineStyle(3, 0xffffff);
    confirmModal.fillRoundedRect(modalX, modalY, modalWidth, modalHeight, 20);
    confirmModal.strokeRoundedRect(modalX, modalY, modalWidth, modalHeight, 20);

    // Создаем текст подтверждения с помощью TextUtils
    const confirmText = TextUtils.createModalText(
      this,
      width / 2,
      height / 2 - 30,
      "Clear all records?",
      pos.isPortrait ? 20 : 24
    )
      .setOrigin(0.5)
      .setStyle({ color: "#ffffff" }); // Белый текст для контраста на темном фоне

    // Позиции кнопок
    const buttonY = height / 2 + 30;
    const yesButtonX = pos.isPortrait ? width / 2 - 50 : width / 2 - 60;
    const noButtonX = pos.isPortrait ? width / 2 + 50 : width / 2 + 60;

    // Создаем кнопки Yes и No с помощью TextUtils
    const yesButton = TextUtils.createButtonText(
      this,
      yesButtonX,
      buttonY,
      "Yes",
      28
    )
      .setOrigin(0.5)
      .setStyle({ color: "#FFD700" }) // Золотой цвет
      .setInteractive();

    const noButton = TextUtils.createButtonText(
      this,
      noButtonX,
      buttonY,
      "No",
      28
    )
      .setOrigin(0.5)
      .setStyle({ color: "#FFD700" }) // Золотой цвет
      .setInteractive();

    // Обработчики событий для кнопок
    yesButton.on("pointerover", () => {
      yesButton.setStyle({ color: "#ffffff" });
      this.input.setDefaultCursor("pointer");
    });

    yesButton.on("pointerout", () => {
      yesButton.setStyle({ color: "#FFD700" });
      this.input.setDefaultCursor("default");
    });

    yesButton.on("pointerdown", () => {
      overlay.destroy();
      confirmModal.destroy();
      confirmText.destroy();
      yesButton.destroy();
      noButton.destroy();
      this.handleClearRecords();
    });

    noButton.on("pointerover", () => {
      noButton.setStyle({ color: "#ffffff" });
      this.input.setDefaultCursor("pointer");
    });

    noButton.on("pointerout", () => {
      noButton.setStyle({ color: "#FFD700" });
      this.input.setDefaultCursor("default");
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
