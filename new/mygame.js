import { Game } from "./engine/game.js"
import { PlayGroundStage } from './playgroundstage.js';
import { Assets } from './assets.js';

class MyGame extends Game {
	constructor(){
		super();

		// assets
		this.assets = new Assets();
	}

	/* load PlayGroundStage */
	loadPlayGround(bStartWhenReady = false){
		// create stage if needed
		if (this.playGroundStage == undefined)
			this.playGroundStage = new PlayGroundStage(this);

		// call parent method
		super.loadStage(this.playGroundStage, bStartWhenReady);
	}
}

export { MyGame };