import { Settings } from './engine/settings.js';

class PlayerController{
	constructor(game, player){
		this.game = game;
		this.player = player;
	}

	resume(){
		//document.removeEventListener( 'keyup', () => {this.paused_onKeyUp(event)}, false );
		document.addEventListener( 'keydown', () => {this.playing_onKeyDown(event)}, false );
		document.addEventListener( 'keyup', () => {this.playing_onKeyUp(event)}, false );
	}

	/* WIP - not working as intended
	pause(){
		document.removeEventListener( 'keydown', () => {this.playing_onKeyDown(event)}, false );
		document.removeEventListener( 'keyup', () => {this.playing_onKeyUp(event)}, false );
		document.addEventListener( 'keyup', () => {this.paused_onKeyUp(event)}, false );
	}

	paused_onKeyUp( event ) {
		switch ( event.keyCode ) {
			case 27:
				if (this.game.currentStage)
					this.game.currentStage.resume();
				break;
		}
	}*/

	playing_onKeyDown( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 90: // z
			case 87: // w
				this.player.bMoveForward = true;
				break;
			case 37: // left arrow
			case 81: // q
				if(this.game.settings.eKeyboardLayout == Settings.KEYBOARD_LAYOUT.AZERTY)
				{
					if (Settings.KEYBOARD_STRAFE.TOP_ROW == this.game.settings.eKeyboardStrafe)
						this.player.bTurnLeft = true;
					else
						this.player.bMoveLeft = true;
				}
				else
				{
					if (Settings.KEYBOARD_STRAFE.TOP_ROW == this.game.settings.eKeyboardStrafe)
						this.player.bMoveLeft = true;
					else
						this.player.bTurnLeft = true;
				}
				break;
			case 39: // right arrow
			case 68: // d
				if (Settings.KEYBOARD_STRAFE.TOP_ROW == this.game.settings.eKeyboardStrafe)
					this.player.bTurnRight = true;
				else
					this.player.bMoveRight = true;
				break;
			case 65: // a
				if(this.game.settings.eKeyboardLayout == Settings.KEYBOARD_LAYOUT.AZERTY)
				{
					if (Settings.KEYBOARD_STRAFE.TOP_ROW == this.game.settings.eKeyboardStrafe)
						this.player.bMoveLeft = true;
					else
						this.player.bTurnLeft = true;
				}
				else
				{
					if (Settings.KEYBOARD_STRAFE.TOP_ROW == this.game.settings.eKeyboardStrafe)
						this.player.bTurnLeft = true;
					else
						this.player.bMoveLeft = true;
				}
				break;
			case 40: // down
			case 83: // s
				this.player.bMoveBackward = true;
				break;
			case 69: // e
				if (Settings.KEYBOARD_STRAFE.TOP_ROW == this.game.settings.eKeyboardStrafe)
					this.player.bMoveRight = true;
				else
					this.player.bTurnRight = true;
				break;
			case 32: //space
				if (this.player.bCanJump == true){
					this.player.fJumpVelocity += this.game.settings.current.fJumpImpulsion;
				}
				this.player.bCanJump = false;
				break;
		}
	}

	playing_onKeyUp( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 90: // z
			case 87: // w
				this.player.bMoveForward = false;
				break;
			case 65: // a
				if(this.game.settings.eKeyboardLayout == Settings.KEYBOARD_LAYOUT.AZERTY)
				{
					if (Settings.KEYBOARD_STRAFE.TOP_ROW == this.game.settings.eKeyboardStrafe)
						this.player.bMoveLeft = false;
					else
						this.player.bTurnLeft = false;
				}
				else
				{
					if (Settings.KEYBOARD_STRAFE.TOP_ROW == this.game.settings.eKeyboardStrafe)
						this.player.bTurnLeft = false;
					else
						this.player.bMoveLeft = false;
				}
				break;
			case 37: // left arrow
			case 81: // q
				if(this.game.settings.eKeyboardLayout == Settings.KEYBOARD_LAYOUT.AZERTY)
				{
					if (Settings.KEYBOARD_STRAFE.TOP_ROW == this.game.settings.eKeyboardStrafe)
						this.player.bTurnLeft = false;
					else
						this.player.bMoveLeft = false;
				}
				else
				{
					if (Settings.KEYBOARD_STRAFE.TOP_ROW == this.game.settings.eKeyboardStrafe)
						this.player.bMoveLeft = false;
					else
						this.player.bTurnLeft = false;
				}
				break;
			case 39: // right arrow
			case 68: // d
				if (Settings.KEYBOARD_STRAFE.TOP_ROW == this.game.settings.eKeyboardStrafe)
					this.player.bTurnRight = false;
				else
					this.player.bMoveRight = false;
				break;
			case 40: // down
			case 83: // s
				this.player.bMoveBackward = false;
				break;
			case 32: // space
				//GameState.queuedJump = false;
				break;
			case 69: // e
				if (Settings.KEYBOARD_STRAFE.TOP_ROW == this.game.settings.eKeyboardStrafe)
					this.player.bMoveRight = false;
				else
					this.player.bTurnRight = false;
				break;
			/*
			case 27:
				if (this.game.currentStage)
					this.game.currentStage.pause();
				break;
			*/	
		}
	}
}

export { PlayerController };