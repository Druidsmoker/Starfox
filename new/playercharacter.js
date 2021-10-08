import { Character } from './engine/character.js';
import { PlayerAnimator } from './playeranimator.js';
import * as THREE from '../build/three.module.js';
import { CharacterCollider } from './collider.js';
import { PlayerController } from './playercontroller.js';

class PlayerCharacter extends Character {
	constructor(game) {
		super(game);

		this.animator = new PlayerAnimator(game, this);
		this.collider = new CharacterCollider(game, this, 0.5);
		this.controller = new PlayerController(game, this);
	}

	init(modelImport) {
		this.mesh = modelImport.scene.children[0];
		this.mesh.rotateY(Math.PI);

		this.wrapper = new THREE.Group();
		this.wrapper.scale.set(0.02, 0.02, 0.02);
		this.wrapper.position.set(0, 0, 0);
		this.wrapper.add(this.mesh);

		this.animator.init(modelImport.animations, this.mesh);
	}

	start(stage) {
		stage.camera.getWorldPosition(stage.cameraWorldPos);
		stage.cameraWorldPos.y = stage.playerGroup.position.y;
		this.wrapper.lookAt(stage.cameraWorldPos);

		this.lastFrameWorldPos.copy(stage.playerGroup.position);
		this.fTargetRotationY = this.mesh.rotation.y;

		this.animator.start();
		this.controller.resume();
	}

	postCollisionUpdate(stage) {
		// if we are on the floor
		if (this.bIntersectFloor) {
			// limit velocity above 0
			this.fJumpVelocity = Math.max(0, this.fJumpVelocity);
			if (this.fJumpVelocity == 0) {
				// if we are at velocity 0, we can jump
				this.bCanJump = true;
				this.bDecrementVelocity = false;
			}
		}
		else {
			// we don't intersect with floor so we cannot jump
			this.bCanJump = false;
		}
		// store infos of this frame before actual movements
		this.lastFrameWorldPos.copy(stage.playerGroup.position);
		this.fLastFrameDistanceToFloor = this.fDistanceToFloor;
		this.bIntersectOnLastFrame = this.bIntersectThisFrame;
	}

	/* called from updateDirection */
	updateModelDirection() {
		var fPreviousTargetRotationY = this.fTargetRotationY;
		if (this.modelDirection.z < -0.1 && Math.abs(this.modelDirection.x) > 0.1)
			this.fTargetRotationY = -this.modelDirection.x * this.modelDirection.z * Math.PI / 2;
		else if (this.modelDirection.z > 0.1 && Math.abs(this.modelDirection.x) > 0.1) {
			if (!this.game.settings.current.bBackPed)
				this.fTargetRotationY = this.modelDirection.x * this.modelDirection.z * Math.PI + this.modelDirection.x * Math.PI / 3;
			else
				this.fTargetRotationY = -this.modelDirection.x * this.modelDirection.z * Math.PI + this.modelDirection.x * Math.PI / 3;
		}
		else if (this.modelDirection.z > 0.1) {
			if (!this.game.settings.current.bBackPed)
				this.fTargetRotationY = this.modelDirection.z * Math.PI;
			else
				this.fTargetRotationY = 0;
		}
		else
			this.fTargetRotationY = this.modelDirection.x * Math.PI / 2;
		//--
		if (fPreviousTargetRotationY != this.fTargetRotationY) {
			this.fStartRotationTime = 0;
			var angle = (this.fTargetRotationY - this.mesh.rotation.y);
			if (Math.abs(this.fTargetRotationY - this.mesh.rotation.y) > Math.PI) {
				angle = Math.PI - (Math.abs(this.fTargetRotationY - this.mesh.rotation.y) % Math.PI);
				if (this.fTargetRotationY > this.mesh.rotation.y)
					angle = -angle;
				this.fRotationPerSecondY = angle / this.game.settings.current.fPlayerTargetRotationTime;
			}
			else
				this.fRotationPerSecondY = angle / this.game.settings.current.fPlayerTargetRotationTime;
		}
	}

	updateDirection(stage) {
		var goRight = Number(this.bMoveRight);
		var goLeft = Number(this.bMoveLeft);
		var goStraight = Number(this.bMoveForward);
		var goBack = Number(this.bMoveBackward);

		// holding right click (change turn into strafe)
		if (stage.controls.getMouseButton() == 2) {
			if (!this.bMoveLeft && this.bTurnLeft) {
				goLeft = 1;
			}
			if (!this.bMoveRight && this.bTurnRight) {
				goRight = 1;
			}
			// rotationY is set to 0 because it looks at the same direction as the camera
			this.rotation.y = 0;
			this.rotation.normalize();
		}
		else {
			this.rotation.y = Number(this.bTurnLeft) - Number(this.bTurnRight);
			this.rotation.normalize();
		}

		// can we move to a direction in the middle of a jump (we can do it just once)
		var bJumpPostInput = false;
		if (!this.bAirControl && !this.bCanJump && goRight + goLeft + goStraight + goBack != 0 && !this.bThisJumpPostInput && this.direction.z == 0 && this.direction.x == 0) {
			this.bThisJumpPostInput = true;
			bJumpPostInput = true;
		}

		// these are the case where we can input something and change the direction
		if (this.bAirControl || this.bCanJump || bJumpPostInput) {
			if (stage.controls.getMouseButton() == 3 && !this.bMoveForward && !this.bMoveBackward) // left + right hold
				this.direction.z = - 1;
			else
				this.direction.z = -goStraight + goBack;
			this.direction.x = goRight - goLeft;

			if (goRight + goLeft + goStraight + goBack != 0
				|| (this.game.settings.current.bWowLikeDirection && stage.controls.getMouseButton() != 2)
				|| ((!this.game.settings.current.bPreserveDirection && !this.game.settings.current.bWowLikeDirection) || (!this.game.settings.current.bWowLikeDirection && stage.controls.getMouseButton() >= 2))) {
				this.modelDirection.copy(this.direction);
				this.modelDirection.normalize();
				this.updateModelDirection();
			}

			this.worldDirection.copy(this.direction).normalize();
			this.direction.applyQuaternion(this.wrapper.quaternion).normalize();
		}
		else if (this.game.settings.current.bAirRotation && (goRight + goLeft + goStraight + goBack != 0 || !this.game.settings.current.bKeepAirDirection)) {
			if (stage.controls.getMouseButton() == 3 && !this.bMoveForward && !this.bMoveBackward) // left + right hold
				this.modelDirection.z = - 1;
			else
				this.modelDirection.z = -goStraight + goBack;
			this.modelDirection.x = goRight - goLeft;
			this.modelDirection.normalize();
			this.updateModelDirection();
		}
	}

	updateMovements(stage) {
		// left clicking (camera stays still)
		if (stage.controls.getMouseButton() == 1) {
			this.wrapper.rotateY(this.rotation.y * stage.fDeltaTime * this.game.settings.current.fTurnSpeed);
		}
		else {
			// camera follows the movement
			this.wrapper.rotateY(this.rotation.y * stage.fDeltaTime * this.game.settings.current.fTurnSpeed);
			stage.cameraGroup.rotateY(this.rotation.y * stage.fDeltaTime * this.game.settings.current.fTurnSpeed);
		}

		if (this.bDecrementVelocity)
			this.fJumpVelocity = Math.max(this.game.settings.current.fMinimumVelocityY, this.fJumpVelocity - (9.8 * this.game.settings.current.fMass * stage.fDeltaTime));

		stage.playerGroup.position.y += this.fJumpVelocity * stage.fDeltaTime;

		// if we are in the middle of a static jump and we moved, it moves but twice as slow
		if (this.bThisJumpPostInput && !this.bCanJump)
			this.fMoveSpeed /= 2;

		// going backward is slow
		if (this.game.settings.current.bBackPed && this.worldDirection.z > 0)
			this.fMoveSpeed /= 2;

		stage.playerGroup.translateZ(this.direction.z * stage.fDeltaTime * this.fMoveSpeed);
		stage.playerGroup.translateX(this.direction.x * stage.fDeltaTime * this.fMoveSpeed);

		// update the model (mesh) rotation
		if (this.fStartRotationTime < this.game.settings.current.fPlayerTargetRotationTime) {
			this.mesh.rotation.y += stage.fDeltaTime * this.fRotationPerSecondY;
			//--
			if (this.mesh.rotation.y > (Math.PI + 0.01)) {
				this.mesh.rotation.y = -Math.PI + (this.mesh.rotation.y % Math.PI);
			}
			else if (this.mesh.rotation.y < (-Math.PI - 0.01)) {
				this.mesh.rotation.y = Math.PI + (this.mesh.rotation.y % -Math.PI);
			}
			//--
			this.fStartRotationTime += stage.fDeltaTime;
			if (this.fStartRotationTime >= this.game.settings.current.fPlayerTargetRotationTime) {
				this.mesh.rotation.y = this.fTargetRotationY;
			}
		}

		if (!this.bIntersectThisFrame)
			this.lastFrameDirection.copy(this.direction);
	}
	
	recoverFromOutOfBounds(stage)
	{
		if(stage.playerGroup.position.y < -10)
		{
			stage.playerGroup.position.set(0,0,0);
		}
	}

	update(stage) {
		this.bIntersectFloor = true;
		this.fDistanceToFloor = 0.0;
		this.bDecrementVelocity = true;
		this.bIntersectThisFrame = false;
		this.fMoveSpeed = this.game.settings.current.fMoveSpeed;
		this.bHasJumped = (this.fJumpVelocity == this.game.settings.current.fJumpImpulsion);
		if (this.bHasJumped) {
			this.bThisJumpPostInput = false;
			this.bAirControl = this.game.settings.current.bAirControl;
		}

		// recover from falling out of bounds
		this.recoverFromOutOfBounds(stage);

		// check for collisions with floor and act accordingly
		this.collider.update(stage);

		// set some variables based collision with floor or not
		this.postCollisionUpdate(stage);

		// compute direction and rotation based on inputs and constraints
		this.updateDirection(stage);

		// does all rotations and translations computed above
		this.updateMovements(stage);

		this.animator.update();
	}
}

export { PlayerCharacter };