import { Stage } from './engine/stage.js';
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js';
import { PlayerCharacter } from './playercharacter.js';
import * as THREE from '../build/threemodule.js';

class PlayGroundStage extends Stage {
	constructor(game){
		super(game);

		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 500 );
		this.cameraWorldPos = new THREE.Vector3();

		this.controls = new OrbitControls( this.camera, game.renderer.domElement );

		this.player = new PlayerCharacter(this.game);
	}

	/* called from Game when stage is ready */
	start(){
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		
		this.controls.update();
		this.player.start(this);

		super.start();
	}

	dispose(){
		// dispose textures ?
		delete this.game.playGroundStage;
	}

	setControlsRotationSpeed(value){
		this.controls.rotateSpeed = value;
	}

	/* when models are loaded, init the rest */
	ready(){
		this.player.init(this.game.assets.foxModel);

		this.scene.background = this.game.assets.getSpaceSkyBox();
		this.scene.fog = new THREE.Fog( 0x606060, 0, 200 );

		this.controls.maxPolarAngle = Math.PI * 0.85; // CHARACTER
		this.controls.maxPolarAngle = Math.PI * 0.49; // FLOOR
		this.controls.minDistance = 0;
		this.controls.maxDistance = 30;
		this.controls.enablePan = false;
		this.controls.rotateSpeed = this.game.settings.fControlsRotationSpeed;

		this.controls.mouseButtons = {
			LEFT: THREE.MOUSE.ROTATE,
			RIGHT: THREE.MOUSE.ROTATE
		}

		this.camera.position.set(0,12,-20);
		this.cameraGroup = new THREE.Group();
		this.cameraGroup.add( this.camera );

		this.playerGroup = new THREE.Group();
		this.playerGroup.add( this.player.wrapper );
		this.playerGroup.add( this.cameraGroup );

		this.light = new THREE.DirectionalLight( 0xffffff, 1 );
		this.light.position.set( 0, 1, -1);
		this.light.position.multiplyScalar( 30 );

		this.hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1.3 );
		this.hemiLight.groundColor.setHSL( 0,0,0 );

		this.floor_mesh = new THREE.Mesh(new THREE.PlaneGeometry(), this.game.assets.getGrassFloorMaterial() );
		this.floor_mesh.geometry.scale(50,50,1);
		this.floor_mesh.geometry.rotateX(-Math.PI / 2);

		this.scene.add(this.playerGroup);
		this.scene.add(this.floor_mesh);
		this.scene.add(this.light);
		this.scene.add(this.hemiLight);

		// start will be called shortly after this
		super.ready(); 
	}

	render(){
		this.game.renderer.render(this.scene, this.camera);
	}

	updateCameraRotation(){
		// rotating with right mouse button
		if (this.controls.getState() == 0 && this.controls.getMouseButton() >= 2)
		{
			this.cameraWorldPos.y = this.playerGroup.position.y;
			this.player.wrapper.lookAt(this.cameraWorldPos);
		}
		this.camera.lookAt(this.playerGroup.position);
	}

	update(){
		this.controls.update();

		this.camera.getWorldPosition(this.cameraWorldPos);

		// update the camera and player rotations so they both look at each other
		this.updateCameraRotation();

		this.player.update(this);
	}

	pause(){
		this.controls.enabled = false;
		this.player.controller.pause();
		super.pause();
	}

	resume(){
		this.controls.enabled = true;
		this.player.controller.resume();
		super.resume();
	}

	/* called from the Stage constructor */
	load(){
		// loading heavy assets
		Promise.all([
			this.game.assets.loadFoxModel(),
			// add more models here
		]).then(values => {
			this.ready();
		}).catch(reason => {
			console.error(reason);
		});
	}
}

export { PlayGroundStage };