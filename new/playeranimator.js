import { Animator } from './engine/animator.js';
import * as THREE from '../../build/threemodule.js';

class PlayerAnimator extends Animator{
	constructor(game, character){
		super(game, character);
	}

	init(clips, model){
		var clipRun = THREE.AnimationClip.findByName( clips, 'Run' );
		var clipIdle = THREE.AnimationClip.findByName( clips, 'Survey' );

		this.mixer = new THREE.AnimationMixer( model );

		this.run = this.mixer.clipAction( clipRun );
		this.run.setEffectiveWeight(0);
		this.run.quickAnimationTransition = true;
		this.run.transitionSpeed = 5;
		this.run.defaultTimeScale = 1.5;

		this.idle = this.mixer.clipAction( clipIdle );
		this.idle.setEffectiveWeight(0);
		this.idle.setDuration(clipIdle.duration * 1.5);
		this.idle.quickAnimationTransition = false;
		this.idle.transitionSpeed = 0.5;
	}

	start(){
		super.start(this.idle);
	}

	update(){
		super.fade(this.idle);
		super.fade(this.run);
		if (this.character.bHasJumped)
		{
			if (this.game.settings.current.bBackPed && this.character.bMoveBackward && !this.character.bMoveForward){
				this.run.time = 1.05;
			}
			else
			{
				this.run.time = 0.10;
				this.run.timeScale = 0.7;
			}
			if (this.targetAnimation != this.run){
				if (!this.run.isRunning())
				{
					this.run.play();
				}
				this.previousAnimation = this.targetAnimation;
				this.targetAnimation = this.run;
			}
		}
		else if (this.character.direction.x != 0 || this.character.direction.z != 0){
			if (this.targetAnimation != this.run){
				if (!this.run.isRunning())
				{
					this.run.play();
				}
				this.previousAnimation = this.targetAnimation;
				this.targetAnimation = this.run;
			}
		}
		else if (this.character.fJumpVelocity == 0){
			if (this.targetAnimation != this.idle){
				if (!this.idle.isRunning())
				{
					this.idle.play();
				}
				this.previousAnimation = this.targetAnimation
				this.targetAnimation = this.idle;
			}
		}
		if (this.character.fJumpVelocity < 0)
		{
			this.run.paused = false;
		}
		else if (this.character.fJumpVelocity == 0){
			this.run.paused = false;
			this.run.timeScale = this.run.defaultTimeScale;
		}
		if (this.game.settings.current.bBackPed && this.character.bMoveBackward && !this.character.bMoveForward){
			this.run.timeScale = -0.7;
		}
		this.mixer.update(this.game.currentStage.fDeltaTime);
	}
}

export { PlayerAnimator };
