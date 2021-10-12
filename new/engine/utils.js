import * as THREE from '../../build/threemodule.js';

class Utils{
	static vectorUp = new THREE.Vector3(0, 1, 0);
	static vectorDown = new THREE.Vector3(0, -1, 0);
	static raycaster = new THREE.Raycaster();
	
	static normalize(val, max, min){
		return (val - min) / (max - min);
	}
}

export { Utils };