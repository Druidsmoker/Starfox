import * as THREE from '../../build/threemodule.js';
import Stats from '../../build/statsmodule.js';
import { Settings } from './settings.js';

class Game{
	constructor(){
		// renderer
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( window.innerWidth , window.innerHeight );
		document.body.appendChild( this.renderer.domElement );
		
		window.addEventListener( 'resize', () => {this.onWindowResize()}, false );

		// settings
		this.settings = new Settings(this);
	}

	onWindowResize(){
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		if (this.currentStage && this.currentStage.camera){
			this.currentStage.camera.aspect = window.innerWidth / window.innerHeight;
			this.currentStage.camera.updateProjectionMatrix();
		}
	}

	/* to be called when no stage is running, if a stage is loading it will be started when ready */
	start(){
		// if there is a stage running : error
		if (this.currentStage && this.currentStage.bRunning){
			console.error("A stage is already running.");
			return;
		}

		// if there is a stage loading
		if (this.upComingStage){
			// if it's not fully loaded yet, start when loaded
			if (this.upComingStage.bReady == false){
				this.upComingStage.bStartWhenReady = true;
			}
			else{ // if it's loaded, start now
				this.currentStage = this.upComingStage;
				delete this.upComingStage;
				this.currentStage.start();
			}
		}
		else{
			console.error("No stage is currently being loaded.");
			return;
		}
	}

	/* create stats panel if needed and add it to the dom */
	showStats(){
		if (this.stats === undefined){
			this.stats = new Stats();
			document.body.appendChild(this.stats.dom);
		}
	}

	/* create a settings panel and add it to the dom (showing it) */
	createSettingsGUI(){
		this.settings.createPanel();
	}

	/* restore default settings and refresh GUI */
	restoreDefaultSettings(){
		this.settings.restoreDefaults();
	}

	/* hide settings GUI (must have been created first) */
	hideSettingsGUI(){
		this.settings.hidePanel();
	}

	/* show settings GUI (must have been created first) */
	showSettingsGUI(){
		this.settings.showPanel();
	}

	/* called from stage when it's done loading */
	onStageLoaded(stage){
		console.log(stage + " is loaded.");

		// if upComingStage has changed in the meantime, nothing to do (maybe dispose it ?)
		if (stage != this.upComingStage){
			return;
		}

		// if it's been set to start when loaded
		if (stage.bStartWhenReady){
			// end current stage if there's one running
			if (this.currentStage && this.currentStage.bRunning){
				this.currentStage.end();
				delete this.currentStage;
			}
			// start the stage
			this.currentStage = stage;
			delete this.upComingStage;
			this.currentStage.start();
		}
	}

	/* call from a stage derived */
	loadStage(stage, bStartWhenReady = false){
		if (!stage.camera)
			console.warn("Your scene has to implement a camera.");

		// set as upcoming stage
		this.upComingStage = stage;
		this.upComingStage.bStartWhenReady = bStartWhenReady;
	}
}

export { Game };