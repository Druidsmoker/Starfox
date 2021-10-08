class Animator{
	constructor(game, character){
		this.character = character;
		this.game = game;
	}

	start(startAnimation){
		if (!this.mixer){
			console.log("Mixer must be implemented in derived class.");
			return;
		}
		startAnimation.play();
		this.targetAnimation = startAnimation;
		this.previousAnimation = startAnimation;
	}

	update(){
		console.warn("To implement in derived class.");
	}

	fade(animation)
	{
		var fWeight;
		if (this.targetAnimation != animation && animation.getEffectiveWeight() > 0){
			if (this.targetAnimation.quickAnimationTransition)
				fWeight = Math.max(0, animation.getEffectiveWeight() - (this.game.currentStage.fDeltaTime * this.targetAnimation.transitionSpeed));
			else
				fWeight = Math.max(0, animation.getEffectiveWeight() - (this.game.currentStage.fDeltaTime * animation.transitionSpeed));
			animation.setEffectiveWeight(fWeight);
			if (fWeight == 0)
				animation.stop();
		}
		else if (this.targetAnimation == animation && animation.getEffectiveWeight() < 1)
		{
			if (animation.quickAnimationTransition || (this.previousAnimation == animation || this.previousAnimation.getEffectiveWeight() == 0)){
				fWeight = Math.min(1, animation.getEffectiveWeight() + (this.game.currentStage.fDeltaTime * animation.transitionSpeed));
				animation.setEffectiveWeight(fWeight);
			}
		}
	}
}

export { Animator };