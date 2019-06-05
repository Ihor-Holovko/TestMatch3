import MenuState from './states/Menu.js';
import LevelState from './states/Level.js';
import GameOverState from './states/GameOver.js';

export class Game extends Phaser.Game {

	constructor() {
		const width = 1280;
		const height = 960;

		super(width, height, Phaser.AUTO);

		this.state.add('Menu', MenuState);
		this.state.add('Level', LevelState);
		this.state.add('GameOver', GameOverState);

		this.state.start('Menu');
	}
}

new Game();