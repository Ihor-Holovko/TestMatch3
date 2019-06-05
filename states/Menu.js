export default class extends Phaser.State {

	preload() {
		this.load.image("background", "./assets/images/backgrounds/background.jpg");
		this.load.image("donuts_logo", "./assets/images/donuts_logo.png");
		this.load.image("btn-play", "./assets/images/btn-play.png");
		this.load.image("big-shadow", "./assets/images/big-shadow.png");
		this.load.image("donut", "./assets/images/donut.png");
		this.load.image("btn-sfx", "./assets/images/btn-sfx.png");
		this.load.image("hand", "./assets/images/game/hand.png");
		this.game.load.audio("backgroundAudio", "./assets/audio/background.mp3");
		this.game.load.audio("select-1", "./assets/audio/select-1.mp3");
	}

	create() {
		// this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.music = this.game.add.audio("backgroundAudio", 1, true);
		this.music.play();

		this.audioClick = this.game.add.audio("select-1", 1, false);
		this.input.onDown.add(obj => { this.audioClick.play(); }, this);
		
		this.bgr = this.add.sprite(0, 0, "background");

		this.donutsLogo = this.add.sprite(
			this.game.world.centerX,
			this.game.world.centerY / 3,
			"donuts_logo"
		);
		this.donutsLogo.anchor.setTo(0.5, 0.5);

		this.buttonPlay = this.game.add.button( this.game.world.centerX,
			this.game.world.centerY, "btn-play", this.actionOnClickPlay,
			this, 2, 1, 0 );
		this.buttonPlay.anchor.setTo(0.5, 0.5);
		this.buttonPlay.onInputOver.add(obj => {
			this.buttonPlay.angle += 5;
		}, this);
		this.buttonPlay.onInputOut.add(obj => {
			this.buttonPlay.angle -= 5;
		}, this);

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

		let donutsPosX = this.game.world.left + 50;
		let donutsPosY = this.game.world.bottom - 50;
		this.bigShadow = this.add.sprite(donutsPosX, donutsPosY, "big-shadow");
		this.bigShadow.anchor.setTo(0.5, 0.5);

		this.donuts = this.add.sprite(donutsPosX, donutsPosY, "donut");
		this.donuts.anchor.setTo(0.5, 0.5);

		this.hand = this.add.sprite(130, 130, "hand");
		this.hand.anchor.setTo(0.3, 0.05);
		this.hand.x = this.input.x;
		this.hand.y = this.input.y;

		this.myPlugin = this.game.plugins.add(Phaser.Plugin.MySimplePlugin);
		this.myPlugin.addSprite(this.donuts);
		console.log("Test my simple plugin");

	}

	update() {
		this.hand.x = this.input.x;
		this.hand.y = this.input.y;
	}

	actionOnClickPlay() {
		this.music.stop();
		this.state.start("Level");
	}

	actionOnClickSfx() {
		if (this.music.isPlaying == true) {

			this.audioClick.volume = 0;
			this.music.pause();
		} else {
			this.audioClick.volume = 1;
			this.music.resume();
		}
	}
}
