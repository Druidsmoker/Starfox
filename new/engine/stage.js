import * as THREE from '../../build/three.module.js';

class Stage{
	constructor(game){
		// reference to game
		this.game = game;

		// properties
		this.bRunning = false;
		this.bStartWhenReady = false;
		this.bReady = false;
		this.bDisposeWhenEnded = true;
		this.bPaused = false;

		// elements
		this.scene = new THREE.Scene();

		// meta
		this.fPreviousTime = 0.0; // used to compute the delta on every frame
		this.fDeltaTime = 0.0; // delta time between 2 calls of animate
		this.glRequestAnimate = null; // frame callback

		// load textures and models
		this.load();
	}

	/* if implemented in the derived class, call the super */
	ready(){
		this.bReady = true;
		this.game.onStageLoaded(this);
	}

	/* if implemented in the derived class, call the super */
	start(){
		this.bRunning = true;
		this.fPreviousTime = performance.now();
		this.animate();
	}

	end(){
		this.bRunning = false;

		// abort frame callback
		if (this.glRequestAnimate)
			cancelAnimationFrame( this.glRequestAnimate );

		if (this.bDisposeWhenEnded)
			this.dispose();
	}

	/* if implemented in the derived class, call the super */
	pause(){
		this.bPaused = true;
	}

	/* if implemented in the derived class, call the super */
	resume(){
		this.bPaused = false;
	}

	update(){
		console.warn("Implement update logic in your derived class.");
	}

	animate(){
		this.glRequestAnimate = requestAnimationFrame(()=>this.animate());

		// compute delta time
		var time = performance.now();
		this.fDeltaTime = (time - this.fPreviousTime) / 1000;
		this.fPreviousTime = time;

		// update game logic if not paused
		if (!this.bPaused)
			this.update();

		// update stats if exists
		if (this.game.stats)
			this.game.stats.update();

		this.render();
	}

	render(){
		console.warn("Should be implemented in the derived class with its camera.");
	}

	load(){
		console.warn("Stage.load should be implemented in the derived class. Simulating 3sec loading time ...");
		setTimeout(function(instance){
			instance.ready();
		}, 3000, this);
	}

	dispose(){
		// TODO maybe dispose of the scene here and make derived call super
		console.warn("Stage.dispose should be implemented in the derived class. Get rid of your references.");
	}

	/* called from settings when a change occurs to the camera rotation speed */
	setControlsRotationSpeed(value){
		console.warn("Should be implemented in derived class if using a camera controller.");
	}

	toString(){
		return this.__proto__.constructor.name;
	}
}

export { Stage };