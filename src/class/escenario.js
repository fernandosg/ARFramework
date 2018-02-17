/**
 * @file Escenario
 * @author Fernando Segura Gómez, Twitter: @fsgdev
 * @version 0.2
 */

/**
 * Clase Escenario
 * @class Escenario
 * @constructor
*/
class Escenario{
	constructor(){
		this.escena=new THREE.Scene();
	}

	/**
	 * @function initCamara
	 * @memberof Escenario
	 * @summary Permite inicializar la cámara que se encargara de observar este escenario
	 * @param {Function} - (Opcional) Esta función se ejecutara usando el ambito de la función Escenario. Sirve principalmente para definir una configuración predefinida para la cámara
	*/
	initCamara(fn){
		if(fn==undefined){
			this.camara=new THREE.Camera();
		}else
			fn.call(this);
	}

	/**
	 * @function anadir
	 * @memberof Escenario
	 * @summary Permite inicializar la cámara que se encargara de observar este escenario
	 * @param {THREE.Object3D} - Es el objeto que se añadira al escenario
	*/
	anadir(elemento){
		this.escena.add(elemento);
	}

	/**
	 * @function getCamara
	 * @memberof Escenario
	 * @summary Retorna la cámara de esta escena
	 * @returns {THREE.Camera} - La cámara definida en este escenario
	*/
	getCamara(){
		return this.camara;
	}

	/**
	 * @function update
	 * @memberof Escenario
	 * @summary Renderiza el escneario
	 * @param {THREE.Scene}
	*/
	update(scene){
		this.renderer.render(scene.escena,scene.camara);
		this.renderer.clearDepth();
	}

	/**
	 * @function limpiar
	 * @memberof Escenario
	 * @summary Limpia todos los elementos en la escena
	*/
	limpiar(){
		while(this.escena.children.length>0)
			this.escena.remove(this.escena.children[0]);
	}
}
export { Escenario as default}
