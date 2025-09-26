// class CardManager {
//   constructor(scene) {
//     this.scene = scene;
//     this.cards = [];
//     this.positions = [];
//     this.openedCard = null;
//     this.openedCardsCount = 0;
//     this.consecutiveMatches = 0;
//     this.currentCardScale = 1;
//   }

//   createCards(level) {
//     this.clearCards();

//     for (let value = 1; value <= level.pairs; value += 1) {
//       for (let i = 0; i < 2; i++) {
//         const card = new Card(this.scene, value);
//         card.setCardScale(this.currentCardScale);
//         this.cards.push(card);
//       }
//     }

//     return this.cards;
//   }

//   initCardsPositions(level, width, height) {
//     this.updateCardsLayout(width, height);

//     this.positions = this.calculatePositions(level, width, height);
//     let shuffledPositions = Phaser.Utils.Array.Shuffle([...this.positions]);

//     this.cards.forEach((card) => {
//       card.init(shuffledPositions.pop());
//     });
//   }

//   calculatePositions(level, width, height) {
//     const grid = calculateGrid(level.pairs, width, height);
//     const cardDimensions = this.getCardDimensions(level, width, height);
//     this.currentCardScale = cardDimensions.scale;

//     let spacing = cardDimensions.spacing;
//     if (cardDimensions.scale < 0.3) {
//       spacing = Math.max(2, cardDimensions.spacing * cardDimensions.scale);
//     }

//     const cardWidth = cardDimensions.width + spacing;
//     const cardHeight = cardDimensions.height + spacing;

//     const totalGridWidth = cardWidth * grid.cols - spacing;
//     const totalGridHeight = cardHeight * grid.rows - spacing;

//     const offsetX = (width - totalGridWidth) / 2 + cardDimensions.width / 2;
//     const offsetY =
//       (height - totalGridHeight) / 2 + cardDimensions.height / 2 + 30;

//     const positions = [];
//     let id = 0;

//     for (let row = 0; row < grid.rows; row++) {
//       for (let col = 0; col < grid.cols; col++) {
//         id++;
//         positions.push({
//           delay: id * 100,
//           x: offsetX + col * cardWidth,
//           y: offsetY + row * cardHeight,
//         });
//       }
//     }

//     return positions;
//   }

//   getCardDimensions(level, width, height) {
//     const grid = calculateGrid(level.pairs, width, height);
//     const isPortrait = height > width;

//     let cardTexture = this.scene.textures.get("card").getSourceImage();
//     let baseCardWidth = cardTexture.width;
//     let baseCardHeight = cardTexture.height;

//     const margin = isPortrait ? 3 : 5;
//     const topOffset = isPortrait ? 100 : 120;
//     const sideMargin = isPortrait ? 10 : 20;
//     const bottomMargin = isPortrait ? 100 : 60;

//     const availableWidth = width - sideMargin * 2;
//     const availableHeight = height - topOffset - bottomMargin;

//     const maxCardWidth =
//       (availableWidth - margin * (grid.cols - 1)) / grid.cols;
//     const maxCardHeight =
//       (availableHeight - margin * (grid.rows - 1)) / grid.rows;

//     const scaleByWidth = maxCardWidth / baseCardWidth;
//     const scaleByHeight = maxCardHeight / baseCardHeight;

//     let minScale, maxScale;
//     if (isPortrait) {
//       minScale = 0.12;
//       maxScale = 0.5;
//     } else {
//       minScale = 0.2;
//       maxScale = 1.0;
//     }

//     let scale = Math.min(scaleByWidth, scaleByHeight);
//     scale = Math.max(minScale, Math.min(scale, maxScale));

//     if (width < 400 && isPortrait) {
//       scale = Math.min(scale, 0.25);
//     }

//     const finalCardWidth = baseCardWidth * scale;
//     const finalCardHeight = baseCardHeight * scale;

//     return {
//       width: finalCardWidth,
//       height: finalCardHeight,
//       scale: scale,
//       spacing: margin,
//     };
//   }

//   showCards() {
//     this.cards.forEach((card) => {
//       card.depth = card.position.delay;
//       card.move({
//         x: card.position.x,
//         y: card.position.y,
//         delay: card.position.delay,
//       });
//     });
//   }

//   updateCardsLayout(width, height) {
//     if (!this.cards || this.cards.length === 0) return;

//     const level = this.scene.getCurrentLevel();
//     const cardDimensions = this.getCardDimensions(level, width, height);
//     this.currentCardScale = cardDimensions.scale;

//     this.cards.forEach((card) => {
//       if (card && card.scene) {
//         card.setCardScale(cardDimensions.scale);
//       }
//     });

//     this.updateCardPositions(width, height);
//   }

//   onCardClicked(card) {
//     if (!card || !(card instanceof Card) || card.opened) return false;

//     this.scene.sounds.card.play();

//     if (this.openedCard) {
//       if (this.openedCard.value === card.value) {
//         this.handleMatch(card);
//       } else {
//         this.handleMismatch(card);
//       }
//     } else {
//       this.openedCard = card;
//     }

//     card.open(() => {
//       if (this.openedCardsCount === this.cards.length / 2) {
//         this.scene.sounds.complete.play();
//         this.scene.nextLevel();
//       }
//     });
//   }

//   handleMatch(card) {
//     this.consecutiveMatches += 1;
//     let earnedPoints = calculateScore(this.consecutiveMatches);
//     this.scene.levelScore += earnedPoints;
//     this.scene.showPointsAnimation(earnedPoints);

//     if (this.openedCardsCount + 1 !== this.cards.length / 2) {
//       this.scene.sounds.success.play();
//     }
//     this.openedCard = null;
//     this.openedCardsCount += 1;
//   }

//   handleMismatch(card) {
//     this.consecutiveMatches = 0;
//     this.openedCard.close();
//     this.openedCard = card;
//   }

//   updateCardPositions(width, height) {
//     const level = this.scene.getCurrentLevel();
//     const cardDimensions = this.getCardDimensions(level, width, height);

//     let spacing = cardDimensions.spacing;
//     if (cardDimensions.scale < 0.3) {
//       spacing = Math.max(2, cardDimensions.spacing * cardDimensions.scale);
//     }

//     const cardWidth = cardDimensions.width + spacing;
//     const cardHeight = cardDimensions.height + spacing;

//     const grid = calculateGrid(level.pairs, width, height);
//     const totalGridWidth = cardWidth * grid.cols - spacing;
//     const totalGridHeight = cardHeight * grid.rows - spacing;

//     const offsetX = (width - totalGridWidth) / 2 + cardDimensions.width / 2;
//     const offsetY =
//       (height - totalGridHeight) / 2 + cardDimensions.height / 2 + 30;

//     this.cards.forEach((card, index) => {
//       if (card) {
//         const row = Math.floor(index / grid.cols);
//         const col = index % grid.cols;

//         this.scene.tweens.add({
//           targets: card,
//           x: offsetX + col * cardWidth,
//           y: offsetY + row * cardHeight,
//           duration: 300,
//           ease: "Power2",
//         });
//       }
//     });
//   }

//   restart() {
//     this.consecutiveMatches = 0;

//     if (this.cards) {
//       this.cards.forEach((card) => {
//         if (card && card.scene) {
//           this.scene.tweens.killTweensOf(card);
//         }
//       });
//     }

//     let completed = 0;
//     const totalCards = this.cards ? this.cards.length : 0;

//     if (totalCards === 0) {
//       this.scene.start();
//       return;
//     }

//     const screenWidth = this.scene.cameras.main.width;
//     const screenHeight = this.scene.cameras.main.height;

//     this.cards.forEach((card) => {
//       if (card && card.scene) {
//         card.move({
//           x: screenWidth + card.width,
//           y: screenHeight + card.height,
//           delay: card.position.delay,
//           callback: () => {
//             if (++completed >= totalCards) {
//               this.scene.start();
//             }
//           },
//         });
//       } else {
//         if (++completed >= totalCards) {
//           this.scene.start();
//         }
//       }
//     });
//   }

//   clearCards() {
//     if (this.cards) {
//       this.cards.forEach((card) => {
//         if (card && card.scene) {
//           this.scene.tweens.killTweensOf(card);
//           card.destroy();
//         }
//       });
//     }
//     this.cards = [];
//     this.resetState();
//   }

//   resetState() {
//     this.openedCard = null;
//     this.openedCardsCount = 0;
//     this.consecutiveMatches = 0;
//   }

//   destroy() {
//     this.clearCards();
//   }
// }
