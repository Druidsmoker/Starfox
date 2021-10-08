import { Loader } from './engine/loader.js';
import * as THREE from '../build/three.module.js';

class Assets{
	constructor(){
	}

	getGrassTexture(){
		if (this.grassTexture === undefined)
			this.grassTexture = Loader.getTexture("textures/grass.jpg");
		return this.grassTexture;
	}

	getGrassFloorMaterial(){
		if (this.grassFloorMaterial === undefined){
			var grassTexture = this.getGrassTexture();
			grassTexture.magFilter = grassTexture.minFilter = THREE.LinearFilterNearestMipMap;
			grassTexture.repeat.set( 12, 12 );
			grassTexture.wrapT = THREE.MirroredRepeatWrapping;
			grassTexture.wrapS = THREE.MirroredRepeatWrapping;
			this.grassFloorMaterial = new THREE.MeshPhongMaterial( { color: 0x505050, map: grassTexture, side:THREE.DoubleSide } );
		}
		return this.grassFloorMaterial;
	}

	getSpaceSkyBox(){
		if (this.spaceSkyBox === undefined)
			this.spaceSkyBox = Loader.getCubeTexture([
			'textures/space_right.png',
			'textures/space_left.png',
			'textures/space_up.png',
			'textures/space_down.png',
			'textures/space_front.png',
			'textures/space_back.png',
		]);
		return this.spaceSkyBox;
	}

	loadFoxModel(){
		if (this.foxModel === undefined){
			return new Promise((resolve, reject) => {
				Loader.getModel('models/Fox.gltf').then(value => {
					this.foxModel = value;
					resolve();
				}).catch(reason => {
					reject(reason);
				});
			});
		}
		return Promise.resolve();
	}
}

export { Assets };