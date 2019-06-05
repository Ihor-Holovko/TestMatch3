export default class extends Phaser.State {
	preload() {
		this.load.image('particle_ex1', './assets/images/particles/particle_ex1.png');
		this.game.load.audio("select-1", "./assets/audio/select-1.mp3");
	}

	create() {
		this.bgr = this.add.sprite(0, 0, 'background');
		this.physics.startSystem(Phaser.Physics.ARCADE);

		this.music = this.game.add.audio('backgroundAudio', 1, true);
		this.music.play();

		this.audioClick = this.game.add.audio("select-1", 1, false);
		this.input.onDown.add(obj => { this.audioClick.play(); }, this);

		this.leftEmitter = this.add.emitter(this.world.centerX - 150, 100);
		this.leftEmitter.bounce.setTo(0.5, 0.5);
		this.leftEmitter.setXSpeed(-100, -200);
		this.leftEmitter.setYSpeed(50, -50);
		this.leftEmitter.makeParticles('particle_ex1', 0, 250, true, true);
	
		this.rightEmitter = this.add.emitter(this.world.centerX + 150, 100);
		this.rightEmitter.bounce.setTo(0.5, 0.5);
		this.rightEmitter.setXSpeed(100, 200);
		this.rightEmitter.setYSpeed(-50, 50);
		this.rightEmitter.makeParticles('particle_ex1', 1, 250, true, true);
	
		this.leftEmitter.start(false, 5000, 40);
		this.rightEmitter.start(false, 5000, 40);

		this.bgScore = this.add.sprite(this.game.world.centerX, this.game.world.top, 'bg-score');
		this.bgScore.anchor.setTo(0.5, 0);

		this.textScore = this.add.text(this.game.world.centerX, this.bgScore.height / 2.3);
		this.textScore.anchor.setTo(0.5, 0.5);
		this.textScore.font = 'Fredoka One';
		this.textScore.fontSize = 70;
		this.textScore.fill = '#bcf8f6';
		this.textScore.text = localStorage.getItem('score');

		this.textGameOver = this.add.text(this.game.world.centerX, this.game.world.centerY / 1.7);
		this.textGameOver.anchor.setTo(0.5, 0.5);
		this.textGameOver.font = 'Fredoka One';
		this.textGameOver.fontSize = 120;
		this.textGameOver.fill = '#ff471a';
		this.textGameOver.text = 'Game Over';
		this.textGameOver.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 0);

		this.toMenu = this.add.text(this.game.world.centerX, this.game.world.centerY);
		this.toMenu.anchor.setTo(0.5, 0.5);
		this.toMenu.font = 'Fredoka One';
		this.toMenu.fontSize = 120;
		this.toMenu.fill = '#ff471a';
		this.toMenu.text = 'Menu';
		this.toMenu.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 0);
		this.toMenu.inputEnabled = true;
		this.toMenu.events.onInputDown.add(obj => {
			this.music.stop();
			this.state.start('Menu');
		}, this);

		let donutsPosX = this.game.world.centerX;
		let donutsPosY = this.game.world.bottom - 50;

		this.bigShadow = this.add.sprite(donutsPosX, donutsPosY, 'big-shadow');
		this.bigShadow.anchor.setTo(0.5, 0.5);

		this.donuts = this.add.sprite(donutsPosX, donutsPosY, 'donut');
		this.donuts.anchor.setTo(0.5, 0.5);

		this.hand = this.add.sprite(130, 130, 'hand');
		this.hand.anchor.setTo(0.3, 0.05);
		this.hand.x = this.input.x;
		this.hand.y = this.input.y;



	}

	update() {
		this.donuts.angle += 0.3;
		this.hand.x = this.input.x;
		this.hand.y = this.input.y;

		let offset = this.moveToXY(this.input.activePointer, this.textGameOver.x, this.textGameOver.y, 8);

		this.textGameOver.setShadow(offset.x, offset.y, 'rgba(0, 0, 0, 0.5)', 
		this.distanceToPointer(this.textGameOver, this.input.activePointer) / 30);

		this.toMenu.setShadow(offset.x, offset.y, 'rgba(0, 0, 0, 0.5)', 
		this.distanceToPointer(this.toMenu, this.input.activePointer) / 30);
		
		this.physics.arcade.collide(this.leftEmitter, this.rightEmitter, this.change, null, this);
	}

	distanceToPointer(displayObject, pointer) {
		this._dx = displayObject.x - pointer.x;
		this._dy = displayObject.y - pointer.y;
		return Math.sqrt(this._dx * this._dx + this._dy * this._dy);
	}

	moveToXY(displayObject, x, y, speed) {
		var _angle = Math.atan2(y - displayObject.y, x - displayObject.x);
		var x = Math.cos(_angle) * speed;
		var y = Math.sin(_angle) * speed;
		return { x: x, y: y };
	}

	change(a, b){
		a.frame = 3;
		b.frame = 3;
	}

}