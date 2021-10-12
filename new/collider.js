import * as THREE from '../build/threemodule.js';
import { Utils } from './engine/utils.js';

class CharacterCollider{
	constructor(game, character, fRadius){
		this.game = game;
		this.character = character;
		this.fRadius = fRadius;
		this.hitbox = new THREE.Sphere(new THREE.Vector3(), fRadius);
	}

	intersectWithFloor(stage){
		// check intersect with floor (raycast straight to -y)
		var raycastPos = new THREE.Vector3();
		raycastPos.copy(stage.playerGroup.position);
		raycastPos.y += this.fRadius; // we give ourself a little offset corresponding to the fRadius of our hitbox
		Utils.raycaster.set(raycastPos, Utils.vectorDown);
		var intersects = Utils.raycaster.intersectObject( stage.floor_mesh );
		for ( var i = 0; i < intersects.length; i++ ) {
			// store the distance to floor
			this.character.fDistanceToFloor = intersects[ i ].distance;
			
			if (intersects[ i ].distance > this.fRadius){
				// we are above the floor
				this.character.bIntersectFloor = false;
			}
			else if (intersects[ i ].distance <= this.fRadius) {
				// we are on the floor : continuously adjust player vertical position to stay on it
				stage.playerGroup.position.y += (this.fRadius - intersects[ i ].distance);
			}
		}
		if (intersects.length == 0){
			// here we are freefalling out of bounds
			this.character.bIntersectFloor = false;
		}
	}

	update(stage){
		this.intersectWithFloor(stage);
	}
}

export { CharacterCollider }