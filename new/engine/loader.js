import * as THREE from '../../build/three.module.js';
import { GLTFLoader } from '../../examples/jsm/loaders/GLTFLoader.js';

class Loader{
	/* loaders */
	static textureLoader = new THREE.TextureLoader();
	static cubeTextureLoader = new THREE.CubeTextureLoader();
	static modelLoader = new GLTFLoader();

	static getTexture(path){
		return Loader.textureLoader.load(path);
	}

	static getCubeTexture(pathArray){
		return Loader.cubeTextureLoader.load(pathArray);
	}

	static getModel(path){
		return new Promise((resolve, reject) => {
	 		Loader.modelLoader.load(path,
				function(modelImport){
					resolve(modelImport);
				}, 
				function(){
					// progress
				},
				function(error){
					reject("Failed to load model from " + path);
				}
			)
		});
	}
}

export { Loader };