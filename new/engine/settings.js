import { GUI } from '../../build/datguimodule.js';

/* we keep our own settings in the Settings instance instead of relying on the dat.gui settings array
: better performance, and more flexible if we want to change up dat.gui for something else without refactoring everything */

class Settings{
	static KEYBOARD_LAYOUT = { AZERTY 		: 1, QWERTY 		: 2};
	static KEYBOARD_STRAFE = { TOP_ROW 		: 1, BOTTOM_ROW 	: 2};

	constructor(game){
		this.game = game;

		// player defined
		this.eKeyboardLayout = Settings.KEYBOARD_LAYOUT.AZERTY;
		this.eKeyboardStrafe = Settings.KEYBOARD_STRAFE.TOP_ROW;
		this.fControlsRotationSpeed = 0.5;

		// setup default values
		this.default = {
			fMinimumVelocityY : -32,
			fPlayerTargetRotationTime : 0.15, // seconds, might be going to Animator ..
			fMoveSpeed : 7,
			fTurnSpeed : 3,
			fJumpImpulsion : 4.8,
			fMass : 1.4,
			bAirControl : false,
			bAirRotation : false,
			bBackPed : true,
			bPreserveDirection : false,
			bWowLikeDirection : true,
			bKeepAirDirection : false
		};

		// init current from default
		this.current = {};
		Object.assign(this.current, this.default);

		// for the GUI panel
		this.GUISettings = {};
	}

	/* TODO */
	loadFromDisk(){
	}

	/* copy default into current */
	restoreDefaults(){
		Object.assign(this.current, this.default);

		// refresh gui panel if used
		if (this.panel !== undefined){
			this.setCurrentValues();
			this.updateControllers();
		}
	}

	/* hide panel if it's used */
	hidePanel(){
		if (this.panel !== undefined){
			this.panel.hide();
		}
		else{
			console.error("Can't hide panel, it hasn't been created.");
		}
	}

	/* show panel if it's used */
	showPanel(){
		if (this.panel !== undefined){
			this.panel.show();
		}
		else{
			console.error("Can't show panel, it hasn't been created.");
		}
	}

	/* after changes to current settings outside of the GUI */
	updateControllers(){
		var nIndex;
		for (nIndex = 0; nIndex < this.panel.__folders.Controls.__controllers.length; nIndex++){
			this.panel.__folders.Controls.__controllers[nIndex].updateDisplay();
		}
		for (nIndex = 0; nIndex < this.panel.__folders.General.__controllers.length; nIndex++){
			this.panel.__folders.General.__controllers[nIndex].updateDisplay();
		}
		for (nIndex = 0; nIndex < this.panel.__folders.Aerial.__controllers.length; nIndex++){
			this.panel.__folders.Aerial.__controllers[nIndex].updateDisplay();
		}
		for (nIndex = 0; nIndex < this.panel.__folders.Animation.__controllers.length; nIndex++){
			this.panel.__folders.Animation.__controllers[nIndex].updateDisplay();
		}
	}

	/* populate GUISettings with current settings values */
	setCurrentValues(){
		this.GUISettings['Air Control'] = this.current.bAirControl;
		this.GUISettings['Jump Impulsion'] =  this.current.fJumpImpulsion;
		this.GUISettings['Move Speed'] = this.current.fMoveSpeed;
		this.GUISettings['Turn Speed'] = this.current.fTurnSpeed;
		this.GUISettings['Mass'] = this.current.fMass;
		this.GUISettings['Backpedal'] = this.current.bBackPed;
		this.GUISettings['Always Preserve Direction'] = this.current.bPreserveDirection;
		this.GUISettings['Preserve Direction Right-Click'] = this.current.bWowLikeDirection;
		this.GUISettings['Air Rotation'] = this.current.bAirRotation;
		this.GUISettings['Keep Air Direction'] = this.current.bKeepAirDirection;
		this.GUISettings['Anim RotationY Time'] =  this.current.fPlayerTargetRotationTime;
		// player defined
		this.GUISettings['Camera Speed'] = this.fControlsRotationSpeed;
		this.GUISettings['Keyboard Strafe'] = this.eKeyboardStrafe;
		this.GUISettings['Keyboard Layout'] = this.eKeyboardLayout;
	}

	/* create GUI panel based on current GUISettings */
	createPanel(){
		// initialize settings array
		this.setCurrentValues();

		// create panel and its folders
		this.panel = new GUI( { width: 410 } );
		var folder0 = this.panel.addFolder( 'Controls' );
		var folder1 = this.panel.addFolder( 'General' );
		var folder2 = this.panel.addFolder( 'Aerial' );
		var folder3 = this.panel.addFolder( 'Animation' );


		// creating all the controllers
		var scope = this;

		//-- Controls
		folder0.add( scope.GUISettings, 'Camera Speed', 0, 2, 0.05).listen().onChange(function(value){
			scope.fControlsRotationSpeed = value;
			if (scope.game.currentStage)
				scope.game.currentStage.setControlsRotationSpeed(value);
		});
		var strafeController = null;
		folder0.add( scope.GUISettings, 'Keyboard Layout', {'Azerty':Settings.KEYBOARD_LAYOUT.AZERTY,'Qwerty':Settings.KEYBOARD_LAYOUT.QWERTY}).listen().onChange(function(value){
			scope.eKeyboardLayout = value;

			if (strafeController)
				folder0.remove(strafeController);

			if (value == Settings.KEYBOARD_LAYOUT.AZERTY){
				strafeController = folder0.add(scope.GUISettings, 'Keyboard Strafe', {'< A  E >':Settings.KEYBOARD_STRAFE.TOP_ROW, '< Q  D >':Settings.KEYBOARD_STRAFE.BOTTOM_ROW}).listen().onChange(function(value){
					scope.eKeyboardStrafe = value;
				});
			}
			else if (value == Settings.KEYBOARD_LAYOUT.QWERTY){
				strafeController = folder0.add(scope.GUISettings, 'Keyboard Strafe', {'< Q  E >':Settings.KEYBOARD_STRAFE.TOP_ROW, '< A  D >':Settings.KEYBOARD_STRAFE.BOTTOM_ROW}).listen().onChange(function(value){
					scope.eKeyboardStrafe = value;
				});			
			}
		}).setValue(scope.eKeyboardLayout);

		folder0.open();
		//-- General
		folder1.add( scope.GUISettings, 'Move Speed', scope.default.fMoveSpeed/2, scope.default.fMoveSpeed*2, 0.2).listen().onChange(function(value){
			scope.current.fMoveSpeed = value;
		});
		folder1.add( scope.GUISettings, 'Turn Speed', scope.default.fTurnSpeed/2, scope.default.fTurnSpeed*2, 0.2).listen().onChange(function(value){
			scope.current.fTurnSpeed = value;
		});
		folder1.add( scope.GUISettings, 'Backpedal').onChange(function(value){
			scope.current.bBackPed = value;
		});
		folder1.add( scope.GUISettings, 'Always Preserve Direction').onChange(function(value){
			scope.current.bPreserveDirection = value;
			if(value && scope.current.bWowLikeDirection)
			{
				scope.current.bWowLikeDirection = false;
				scope.GUISettings['Preserve Direction Right-Click'] = false;
				scope.updateControllers();
			}
		});
		folder1.add( scope.GUISettings, 'Preserve Direction Right-Click').onChange(function(value){
			scope.current.bWowLikeDirection = value;
			if(value && scope.current.bPreserveDirection)
			{
				scope.current.bPreserveDirection = false;
				scope.GUISettings['Always Preserve Direction'] = false;
				scope.updateControllers();
			}
		});
		folder1.open();
		//-- Aerials
		folder2.add( scope.GUISettings, 'Air Control' ).onChange(function(value){
			scope.current.bAirControl = value;
			if(value)
			{
				scope.current.bAirRotation = false;
				scope.current.bKeepAirDirection = false;
				scope.GUISettings['Air Rotation'] = false;
				scope.GUISettings['Keep Air Direction'] = false;
				scope.updateControllers();
			}
		});
		folder2.add( scope.GUISettings, 'Air Rotation').onChange(function(value){
			scope.current.bAirRotation = value;
			if(value)
			{
				scope.current.bAirControl = false;
				scope.GUISettings['Air Control'] = false;
				scope.updateControllers();
			}
			else if(scope.current.bKeepAirDirection)
			{
				scope.current.bKeepAirDirection = false;
				scope.GUISettings['Keep Air Direction'] = false;
				scope.updateControllers();
			}
		});
		folder2.add( scope.GUISettings, 'Keep Air Direction').onChange(function(value){
			scope.current.bKeepAirDirection = value;
			if(value)
			{
				scope.current.bAirRotation = true;
				scope.GUISettings['Air Rotation'] = true;
				scope.current.bAirControl = false;
				scope.GUISettings['Air Control'] = false;
				scope.updateControllers();
			}
		});
		folder2.add( scope.GUISettings, 'Jump Impulsion', scope.default.fJumpImpulsion/2, scope.default.fJumpImpulsion*4, 0.2 ).listen().onChange(function(value){scope.current.fJumpImpulsion=value});
		folder2.add( scope.GUISettings, 'Mass', scope.default.fMass/2, scope.default.fMass*4, 0.2 ).listen().onChange(function(value){scope.current.fMass=value});
		folder2.open();
		//-- Animation
		folder3.add( scope.GUISettings, 'Anim RotationY Time', 0, 1, 0.05).listen().onChange(function(value){scope.current.fPlayerTargetRotationTime=value});
		folder3.open();
	}
}

export { Settings };
