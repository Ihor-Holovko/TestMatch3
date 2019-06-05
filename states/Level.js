export default class extends Phaser.State {
	preload() {
		this.levelTime = 120;
		this.fieldSize = 7;
		this.orbColors = 6;
		this.bonuseOrbStartSpr = 6;
		this.bonuseOrbEndSpr = 11;
		this.canMakeBonusOrb = false;
		this.orbSize = 100;
		this.swapSpeed = 100;
		this.fallSpeed = 200;
		this.destroySpeed = 100;
		this.fastFall = true;
		this.gameArray = [];
		this.removeMap = [];
		this.orbGroup;
		this.selectedOrb;
		this.canPick = true;
		this.startPointX = 0;
		this.startPointY = 0;
		this.newInputX = 0;
		this.newInputY = 0;
		this.score = 0;
		this.counter = 0;
		this.complTutorial = true;
		this.load.image("background", "./assets/images/backgrounds/background.jpg");
		this.load.image("bg-score", "./assets/images/bg-score.png");
		this.load.image("text-timeup", "./assets/images/text-timeup.png");
		this.load.image('particle_ex3', './assets/images/particles/particle_ex3.png');
		this.load.image("bgr2-for-level", "./assets/images/bgr2-for-level.png");
		this.load.spritesheet("orbs", "./assets/images/sprites/orbs_all.png",
			this.orbSize,this.orbSize );
		this.game.load.audio("select-1", "./assets/audio/select-1.mp3");
	}

	create() {
		this.bgr = this.add.sprite(0, 0, "background");

		this.bgr2 = this.add.sprite(this.game.world.centerX,
			this.game.world.centerY * 1.165, "bgr2-for-level");
		this.bgr2.anchor.setTo(0.5, 0.5);

		this.music = this.game.add.audio("backgroundAudio", 1, true);
		this.music.play();

		this.audioClick = this.game.add.audio("select-1", 1, false);
		this.input.onDown.add(obj => { this.audioClick.play(); }, this);
		
		this.bgScore = this.add.sprite(
			this.game.world.centerX,
			this.game.world.top,
			"bg-score"
		);
		this.bgScore.anchor.setTo(0.5, 0);

		this.startPointX = this.game.world.centerX - (this.fieldSize * this.orbSize) / 2;
		this.startPointY = this.game.world.centerY/2.3;

		let buttonSfxPosX = this.game.world.right - 10;
		let buttonSfxPosY = this.game.world.top + 10;
		this.buttonSfx = this.game.add.button( buttonSfxPosX, buttonSfxPosY,
			"btn-sfx", this.actionOnClickSfx, this, 2, 1, 0 );
		this.buttonSfx.anchor.setTo(1, 0);
		this.buttonSfx.onInputOver.add(obj => {
			this.buttonSfx.scale.setTo(1.05, 1.05);
		}, this);
		this.buttonSfx.onInputOut.add(obj => {
			this.buttonSfx.scale.setTo(1, 1);
		}, this);

		this.textScore = this.add.text( this.game.world.centerX,
			this.bgScore.height / 2.3);
		this.textScore.anchor.setTo(0.5, 0.5);
		this.textScore.font = "Fredoka One";
		this.textScore.fontSize = 70;
		this.textScore.fill = "#bcf8f6";

		this.textTimer = this.add.text(this.game.world.centerX / 3, 100);
		this.textTimer.anchor.setTo(0.5, 0.5);
		this.textTimer.font = "Fredoka One";
		this.textTimer.fontSize = 70;
		this.textTimer.fill = "#ff704d";
		this.time.events.loop(Phaser.Timer.SECOND, this.levelTimeCounter, this);

		this.textTimeUp = this.add.sprite(this.game.world.centerX / 3 + 20, 100, "text-timeup" );
		this.textTimeUp.anchor.setTo(0.5, 0.5);
		this.textTimeUp.scale.setTo(0.8, 0.8);
		this.textTimeUp.alpha = 0;

		this.drawField();
		this.canPick = true;
		this.input.onDown.add(this.orbSelect, this);
		this.input.onUp.add(this.orbDeselect, this);

		this.textTutorial = this.add.text(this.game.world.centerX - 200, this.game.world.centerY + 30);
		this.textTutorial.anchor.setTo(0.5, 0.5);
		this.textTutorial.font = 'Fredoka One';
		this.textTutorial.fontSize = 90;
		this.textTutorial.fill = '#bcf8f6';
		this.textTutorial.text = 'Click + ';
		this.textTutorial.alpha = 0;

		this.hand = this.add.sprite(130, 130, "hand");
		this.hand.anchor.setTo(0.3, 0.05);
		this.hand.x = this.game.world.centerX;
		this.hand.y = this.game.world.centerY - 15;

		this.emitter = this.add.emitter(0, 0, 100);
		this.emitter.makeParticles('particle_ex3');
		this.emitter.gravity = 500;

		// if(JSON.parse(localStorage.getItem('complTutorial')) === true){
		// 	this.complTutorial = JSON.parse( localStorage.getItem('complTutorial') );
		// 	console.log("Tutorial is complite");
		// } else {
		// 	this.runTutorial();
		// }

		this.runTutorial();

	}

	update() {

		// if(this.complTutorial == true){
		// 	this.hand.x = this.input.x;
		// 	this.hand.y = this.input.y;
		// }

		this.newInputX = this.input.x - this.startPointX;
		this.newInputY = this.input.y - this.startPointY;
	}

	runTutorial(){

		let tutorTextTween =  this.add.tween(this.textTutorial).to( { alpha: 1 },
			300, Phaser.Easing.Linear.None, true, 0, 0, false);
		
		tutorTextTween.onComplete.add(obj => {
			let tutorTextTween2 =  this.add.tween(this.textTutorial).to( { alpha: 0 },
				300, Phaser.Easing.Linear.None, true, 1400, 0, false);
				tutorTextTween2.onComplete.add(obj => {
					this.textTutorial.destroy();
				}, this);
		}, this);

		let tutorTweenX =  this.add.tween(this.hand).to( { x: this.hand.x + 100 }, 
			500, Phaser.Easing.Linear.None, true, 0, 0, true);
		
		tutorTweenX.onComplete.add(obj => {

			let tutorTweenY =  this.add.tween(this.hand).to( { y: this.hand.y + 100 },
				500, Phaser.Easing.Linear.None, true, 0, 0, true);

			tutorTweenY.onComplete.add(obj => {
				this.complTutorial = true;
				this.hand.destroy();
				localStorage.setItem("complTutorial", JSON.stringify(this.complTutorial) );
			}, this);

		}, this);
		
	}

	particleBurst(pointer) {
		this.emitter.x = pointer.x;
		this.emitter.y = pointer.y;
		this.emitter.start(true, 2000, null, 10);
	}


	secToTimer(startTime, timeInSeconds) {
		if (startTime == timeInSeconds) {
			return "game over";
		} else {
			let pad = function (num, size) {
				return ("000" + num).slice(size * -1);
			},
				time = parseFloat(startTime - timeInSeconds).toFixed(3),
				hours = Math.floor(time / 60 / 60),
				minutes = Math.floor(time / 60) % 60,
				seconds = Math.floor(time - minutes * 60),
				milliseconds = time.slice(-3);
			return pad(minutes, 2) + ":" + pad(seconds, 2);
		}
	}

	levelTimeCounter() {
		if (this.textTimer.text != "game over") {
			this.counter++;
			this.textTimer.text = this.secToTimer(this.levelTime, this.counter);
		} else {
			this.textTimer.alpha = 0;
			localStorage.setItem("score", this.score);
			this.music.stop();
			this.state.start("GameOver");
		}

		if (this.levelTime - this.counter == 3) {
			this.textTimer.alpha = 0;
			this.add.tween(this.textTimeUp).to( { alpha: 1 }, 500, 
				Phaser.Easing.Linear.None, true, 0, 10, true);
		}
	}

	actionOnClickSfx() {
		if (this.music.isPlaying == true) {
			this.buttonSfx.alpha = 0.4;
			this.audioClick.volume = 0;
			this.music.pause();
		} else {
			this.buttonSfx.alpha = 0.4;
			this.audioClick.volume = 1;
			this.music.resume();
		}
	}

	drawField() {
		this.orbGroup = this.add.group();
		for (let i = 0; i < this.fieldSize; i++) {
			this.gameArray[i] = [];
			for (let j = 0; j < this.fieldSize; j++) {
				let orb = this.add.sprite(
					this.orbSize * j + this.orbSize / 2 + this.startPointX,
					this.orbSize * i + this.orbSize / 2 + this.startPointY,
					"orbs"
				);
				orb.anchor.set(0.5);
				this.orbGroup.add(orb);
				do {
					let randomColor = this.rnd.between(0, this.orbColors - 1);
					orb.frame = randomColor;
					this.gameArray[i][j] = {
						orbColor: randomColor,
						orbSprite: orb
					};
				} while (this.isMatch(i, j));
			}
		}

		this.selectedOrb = null;
	}

	orbSelect(e) {
		if (this.canPick) {
			let row = Math.floor(this.newInputY / this.orbSize);
			let col = Math.floor(this.newInputX / this.orbSize);

			let pickedOrb = this.gemAt(row, col);
			if (pickedOrb != -1) {
				if (this.selectedOrb == null) {
					pickedOrb.orbSprite.scale.setTo(1.2);
					pickedOrb.orbSprite.bringToTop();
					this.selectedOrb = pickedOrb;
					this.input.addMoveCallback(this.orbMove, this);
				} else {
					if (this.areTheSame(pickedOrb, this.selectedOrb)) {
						this.selectedOrb.orbSprite.scale.setTo(1);
						this.selectedOrb = null;
					} else {
						if (this.areNext(pickedOrb, this.selectedOrb)) {
							this.selectedOrb.orbSprite.scale.setTo(1);
							this.swapOrbs(this.selectedOrb, pickedOrb, true);
						} else {
							this.selectedOrb.orbSprite.scale.setTo(1);
							pickedOrb.orbSprite.scale.setTo(1.2);
							this.selectedOrb = pickedOrb;
							this.input.addMoveCallback(this.orbMove, this);
						}
					}
				}
			}
		}
	}

	orbDeselect(e) {
		this.input.deleteMoveCallback(this.orbMove, this);
	}

	orbMove(event, pX, pY) {
		if (event.id == 0) {
			let distX = pX - this.selectedOrb.orbSprite.x;
			let distY = pY - this.selectedOrb.orbSprite.y;
			let deltaRow = 0;
			let deltaCol = 0;
			if (Math.abs(distX) > this.orbSize / 2) {
				if (distX > 0) {
					deltaCol = 1;
				} else {
					deltaCol = -1;
				}
			} else {
				if (Math.abs(distY) > this.orbSize / 2) {
					if (distY > 0) {
						deltaRow = 1;
					} else {
						deltaRow = -1;
					}
				}
			}

			if (deltaRow + deltaCol != 0) {
				let pickedOrb = this.gemAt(
					this.getOrbRow(this.selectedOrb) + deltaRow,
					this.getOrbCol(this.selectedOrb) + deltaCol
				);
				if (pickedOrb != -1) {
					this.selectedOrb.orbSprite.scale.setTo(1);
					this.swapOrbs(this.selectedOrb, pickedOrb, true);
					this.input.deleteMoveCallback(this.orbMove, this);
				}
			}
		}
	}

	swapOrbs(orb1, orb2, swapBack) {
		this.canPick = false;
		let fromColor = orb1.orbColor;
		let fromSprite = orb1.orbSprite;
		let toColor = orb2.orbColor;
		let toSprite = orb2.orbSprite;

		this.gameArray[this.getOrbRow(orb1)][this.getOrbCol(orb1)].orbColor = toColor;
		this.gameArray[this.getOrbRow(orb1)][this.getOrbCol(orb1)].orbSprite = toSprite;

		this.gameArray[this.getOrbRow(orb2)][this.getOrbCol(orb2)].orbColor = fromColor;
		this.gameArray[this.getOrbRow(orb2)][this.getOrbCol(orb2)].orbSprite = fromSprite;

		let orb1Tween = this.add.tween(
				this.gameArray[this.getOrbRow(orb1)][this.getOrbCol(orb1)].orbSprite
			)
			.to(
				{
					x:
						this.getOrbCol(orb1) * this.orbSize +
						this.orbSize / 2 + this.startPointX,
					y:
						this.getOrbRow(orb1) * this.orbSize +
						this.orbSize / 2 + this.startPointY
				},
				this.swapSpeed, Phaser.Easing.Linear.None, true
			);

		let orb2Tween = this.add.tween(
				this.gameArray[this.getOrbRow(orb2)][this.getOrbCol(orb2)].orbSprite
			)
			.to(
				{
					x:
						this.getOrbCol(orb2) * this.orbSize +
						this.orbSize / 2 + this.startPointX,
					y:
						this.getOrbRow(orb2) * this.orbSize +
						this.orbSize / 2 + this.startPointY
				},
				this.swapSpeed, Phaser.Easing.Linear.None, true
			);

		orb2Tween.onComplete.add(obj => {

			if (orb1.orbColor == 6 || orb2.orbColor == 6){
				this.bonusAction1(orb1, orb2);
			} else if (orb1.orbColor == 7 || orb2.orbColor == 7) {
				this.bonusAction2(orb1, orb2);
			} else if (orb1.orbColor == 8 || orb2.orbColor == 8) {
				this.bonusAction3(orb1, orb2);
			} else if (orb1.orbColor == 9 || orb2.orbColor == 9) {
				this.bonusAction4(orb1, orb2);
			} else if (orb1.orbColor == 10 || orb2.orbColor == 10) {
				this.bonusAction5(orb1, orb2);
			} else if (orb1.orbColor == 11 || orb2.orbColor == 11) {
				this.bonusAction6(orb1, orb2);
			} else {

				if (!this.matchInBoard() && swapBack) {
					this.swapOrbs(orb1, orb2, false);
				} else {
					if (this.matchInBoard()) {
						this.handleMatches();
					} else {
						this.canPick = true;
						this.selectedOrb = null;
					}
				}
			}

		}, this);
	}

	bonusAction1(orb1, orb2){
		this.removeMap[this.getOrbRow(orb1)][this.getOrbCol(orb1)] = 1;
		this.removeMap[this.getOrbRow(orb2)][this.getOrbCol(orb2)] = 1;
		this.destroyOrbs();
	}

	bonusAction2(orb1, orb2){
		if(orb1.orbColor == 7){
			for (let i = 0; i < this.fieldSize; i++) {
				this.removeMap[this.getOrbRow(orb1)][i] = 1;
				this.removeMap[i][this.getOrbCol(orb1)] = 1;
			}
		} else {
			for (let i = 0; i < this.fieldSize; i++) {
				this.removeMap[this.getOrbRow(orb2)][i] = 1;
				this.removeMap[i][this.getOrbCol(orb2)] = 1;
			}
		}
		this.destroyOrbs();
	}

	bonusAction3(orb1, orb2){
		if(orb1.orbColor == 8){
			for (let i = 0; i < this.fieldSize; i++) {
				this.removeMap[i][this.getOrbCol(orb1)] = 1;
			}
		} else {
			for (let i = 0; i < this.fieldSize; i++) {
				this.removeMap[i][this.getOrbCol(orb2)] = 1;
			}
		}
		this.destroyOrbs();
	}

	bonusAction4(orb1, orb2){
		if(orb1.orbColor == 9){
			for (let i = 0; i < this.fieldSize; i++) {
				this.removeMap[this.getOrbRow(orb1)][i] = 1;
			}
		} else {
			for (let i = 0; i < this.fieldSize; i++) {
				this.removeMap[this.getOrbRow(orb2)][i] = 1;
			}
		}
		this.destroyOrbs();
	}

	bonusAction5(orb1, orb2){
		if(orb1.orbColor == 10){
			this.removeMap[this.getOrbRow(orb1)][this.getOrbCol(orb1)] = 1;
			for (let i = 0; i < 5; i++) {
				this.removeMap[this.rnd.between(0, 6)][this.rnd.between(0, 6)] = 1;
			}
		} else {
			this.removeMap[this.getOrbRow(orb2)][this.getOrbCol(orb2)] = 1;
			for (let i = 0; i < 5; i++) {
				this.removeMap[this.rnd.between(0, 6)][this.rnd.between(0, 6)] = 1;
			}
		}
		this.destroyOrbs();
	}

	bonusAction6(orb1, orb2){
		this.removeMap[this.getOrbRow(orb1)][this.getOrbCol(orb1)] = 1;
		this.removeMap[this.getOrbRow(orb2)][this.getOrbCol(orb2)] = 1;
		this.score = this.score * 2;
		this.add.tween(this.textScore).to( { alpha: 0 }, 250, 
			Phaser.Easing.Linear.None, true, 0, 1, true);
		this.destroyOrbs();
	}

	areNext(orb1, orb2) {
		return (
			Math.abs(this.getOrbRow(orb1) - this.getOrbRow(orb2)) +
			Math.abs(this.getOrbCol(orb1) - this.getOrbCol(orb2)) == 1
		);
	}

	areTheSame(orb1, orb2) {
		return (
			this.getOrbRow(orb1) == this.getOrbRow(orb2) &&
			this.getOrbCol(orb1) == this.getOrbCol(orb2)
		);
	}

	gemAt(row, col) {
		if (row < 0 || row >= this.fieldSize || col < 0 || col >= this.fieldSize) {
			return -1;
		}
		return this.gameArray[row][col];
	}

	getOrbRow(orb) {
		return Math.floor((orb.orbSprite.y - this.startPointY) / this.orbSize);
	}

	getOrbCol(orb) {
		return Math.floor((orb.orbSprite.x - this.startPointX) / this.orbSize);
	}

	isHorizontalMatch(row, col) {
		return (
			this.gemAt(row, col).orbColor == this.gemAt(row, col - 1).orbColor &&
			this.gemAt(row, col).orbColor == this.gemAt(row, col - 2).orbColor
		);
	}

	isVerticalMatch(row, col) {
		return (
			this.gemAt(row, col).orbColor == this.gemAt(row - 1, col).orbColor &&
			this.gemAt(row, col).orbColor == this.gemAt(row - 2, col).orbColor
		);
	}

	isMatch(row, col) {
		return this.isHorizontalMatch(row, col) || this.isVerticalMatch(row, col);
	}

	matchInBoard() {
		for (let i = 0; i < this.fieldSize; i++) {
			for (let j = 0; j < this.fieldSize; j++) {
				if (this.isMatch(i, j)) {
					return true;
				}
			}
		}
		return false;
	}

	handleMatches() {
		this.removeMap = [];
		for (let i = 0; i < this.fieldSize; i++) {
			this.removeMap[i] = [];
			for (let j = 0; j < this.fieldSize; j++) {
				this.removeMap[i].push(0);
			}
		}
		this.handleHorizontalMatches();
		this.handleVerticalMatches();
		this.destroyOrbs();
	}

	clearRemoveMap() {
		this.removeMap = [];
		for (let i = 0; i < this.fieldSize; i++) {
			this.removeMap[i] = [];
			for (let j = 0; j < this.fieldSize; j++) {
				this.removeMap[i].push(0);
			}
		}
	}

	handleVerticalMatches() {
		for (let i = 0; i < this.fieldSize; i++) {
			let colorStreak = 1;
			let currentColor = -1;
			let startStreak = 0;
			for (let j = 0; j < this.fieldSize; j++) {
				if (this.gemAt(j, i).orbColor == currentColor) {
					colorStreak++;
				}
				if (this.gemAt(j, i).orbColor != currentColor || j == this.fieldSize - 1 ) {
					if (colorStreak >= 3) {
						for (let k = 0; k < colorStreak; k++) {
							this.removeMap[startStreak + k][i]++;
						}
					}
					startStreak = j;
					colorStreak = 1;
					currentColor = this.gemAt(j, i).orbColor;
				}
			}
		}
	}

	handleHorizontalMatches() {
		for (let i = 0; i < this.fieldSize; i++) {
			let colorStreak = 1;
			let currentColor = -1;
			let startStreak = 0;
			for (let j = 0; j < this.fieldSize; j++) {
				if (this.gemAt(i, j).orbColor == currentColor) {
					colorStreak++;
				}
				if (this.gemAt(i, j).orbColor != currentColor || j == this.fieldSize - 1) {
					if (colorStreak >= 3) {
						for (let k = 0; k < colorStreak; k++) {
							this.removeMap[i][startStreak + k]++;
						}
					}
					startStreak = j;
					colorStreak = 1;
					currentColor = this.gemAt(i, j).orbColor;
				}
			}
		}
	}

	destroyOrbs() {
		let destroyed = 0;
		for (let i = 0; i < this.fieldSize; i++) {
			for (let j = 0; j < this.fieldSize; j++) {
				if (this.removeMap[i][j] > 0) {
					this.particleBurst(this.gameArray[i][j].orbSprite);
					let destroyTween = this.add.tween(this.gameArray[i][j].orbSprite).to(
						{
							alpha: 0
						},
						this.destroySpeed,
						Phaser.Easing.Linear.None,
						true
					);
					destroyed++;

					destroyTween.onComplete.add(orb => {
						orb.destroy();
						destroyed--;
						if (destroyed == 0) {
							this.makeOrbsFall();
							if (this.fastFall) {
								this.replenishField();
							}
						}
					}, this);
					this.gameArray[i][j] = null;
				}
			}
		}
		this.score += destroyed;
		this.textScore.text = this.score;
		if(destroyed > 3){
			this.canMakeBonusOrb = true;
		}
		this.clearRemoveMap()

	}

	makeOrbsFall() {
		let fallen = 0;
		let restart = false;
		for (let i = this.fieldSize - 2; i >= 0; i--) {
			for (let j = 0; j < this.fieldSize; j++) {
				if (this.gameArray[i][j] != null) {
					let fallTiles = this.holesBelow(i, j);
					if (fallTiles > 0) {
						if (!this.fastFall && fallTiles > 1) {
							fallTiles = 1;
							restart = true;
						}
						let orb2Tween = this.add.tween(this.gameArray[i][j].orbSprite).to(
							{
								y: this.gameArray[i][j].orbSprite.y + fallTiles * this.orbSize
							},
							this.fallSpeed,
							Phaser.Easing.Linear.None,
							true
						);
						fallen++;
						orb2Tween.onComplete.add(obj =>  {
							fallen--;
							if (fallen == 0) {
								if (restart) {
									this.makeOrbsFall();
								} else {
									if (!this.fastFall) {
										this.replenishField();
									}
								}
							}
						}, this);
						this.gameArray[i + fallTiles][j] = {
							orbSprite: this.gameArray[i][j].orbSprite,
							orbColor: this.gameArray[i][j].orbColor
						};
						this.gameArray[i][j] = null;
					}
				}
			}
		}
		if (fallen == 0) {
			this.replenishField();
		}
	}

	replenishField() {
		let replenished = 0;
		let restart = false;
		let makeBonus = false;
		for (let j = 0; j < this.fieldSize; j++) {
			let emptySpots = this.holesInCol(j);
			if(emptySpots > 3  ){
				makeBonus = true;
			}
			if (emptySpots > 0) {
				if (!this.fastFall && emptySpots > 1) {
					emptySpots = 1;
					restart = true;
				}
				for (let i = 0; i < emptySpots; i++) {
					let orb = this.add.sprite(this.orbSize * j + this.orbSize / 2 + this.startPointX,
						- (this.orbSize * (emptySpots - 1 - i) + this.orbSize / 2) + this.startPointY, "orbs");
					orb.anchor.set(0.5);
					this.orbGroup.add(orb);
					let randomColor;
					if(this.canMakeBonusOrb == true ){
						randomColor = this.rnd.between(this.bonuseOrbStartSpr, this.bonuseOrbEndSpr);
						orb.frame = randomColor;
						this.canMakeBonusOrb = false;
					} else {
						randomColor = this.rnd.between(0, this.orbColors - 1);
						orb.frame = randomColor;
					}
					this.gameArray[i][j] = {orbColor: randomColor,orbSprite: orb};
					let orb2Tween = this.add.tween(this.gameArray[i][j].orbSprite).to(
						{
							y: this.orbSize * i + this.startPointY + this.orbSize / 2
						},
						this.fallSpeed,
						Phaser.Easing.Linear.None,
						true
					);
					replenished++;
					orb2Tween.onComplete.add(obj =>  {
						replenished--;
						if (replenished == 0) {
							if (restart) {
								this.makeOrbsFall();
							} else {
								if (this.matchInBoard()) {
									this.time.events.add(250, this.handleMatches, this);
								} else {
									this.canPick = true;
									this.selectedOrb = null;
								}
							}
						}
					}, this);
				}
			}
		}
	}

	holesBelow(row, col) {
		let result = 0;
		for (let i = row + 1; i < this.fieldSize; i++) {
			if (this.gameArray[i][col] == null) {
				result++;
			}
		}
		return result;
	}

	holesInCol(col) {
		let result = 0;
		for (let i = 0; i < this.fieldSize; i++) {
			if (this.gameArray[i][col] == null) {
				result++;
			}
		}
		return result;
	}
}
