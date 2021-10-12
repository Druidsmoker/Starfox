import * as THREE from '../../build/threemodule.js';

class Character {
	constructor(game){
		this.game = game;

		/* inputs (move to playerController */
		this.bMoveForward = false;
		this.bMoveBackward = false;
		this.bMoveLeft = false;
		this.bMoveRight = false;
		this.bTurnLeft = false;
		this.bTurnRight = false;

		/* jump/fall related */
		this.fJumpVelocity = 0.0;
		this.bAirControl = false;
		this.bThisJumpPostInput = false;
		this.fThisJumpFallVelocityFactor = 1.0;
		this.fLastFrameDistanceToFloor = 0.0;
		this.bCanJump = true;

		/* general */
		this.fTargetRotationY = 0.0;
		this.direction = new THREE.Vector3();
		this.fMoveSpeed = this.game.settings.current.fMoveSpeed;
		this.worldDirection = new THREE.Vector3();
		this.rotation = new THREE.Vector3();
		this.fRotationPerSecondY = 0.0;
		this.fStartRotationTime = this.game.settings.current.fPlayerTargetRotationTime;
		this.modelDirection = new THREE.Vector3();
		this.lastFrameDirection = new THREE.Vector3();
		this.bLastFrameIntersect = false;
		this.lastFrameWorldPos = new THREE.Vector3();
		this.bHasJumped = false;
		this.bIntersectFloor = true;
		this.fDistanceToFloor = 0.0;
		this.bDecrementVelocity = true;
		this.bIntersectThisFrame = false;
	}
}

export { Character };