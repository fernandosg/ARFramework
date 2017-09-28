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
function Escenario(){
}

Escenario.prototype.initScene=function(scene){
	this.escena=scene;
}

/**
 * @function initCamara
 * @memberof Escenario
 * @summary Permite inicializar la cámara que se encargara de observar este escenario
 * @param {Function} - (Opcional) Esta función se ejecutara usando el ambito de la función Escenario. Sirve principalmente para definir una configuración predefinida para la cámara
*/
Escenario.prototype.initCamara=function(fn){
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
Escenario.prototype.anadir=function(elemento){
	console.dir(elemento);
	this.escena.scene.add(elemento);
}


/**
 * @function getCamara
 * @memberof Escenario
 * @summary Retorna la cámara de esta escena
 * @returns {THREE.Camera} - La cámara definida en este escenario
*/
Escenario.prototype.getCamara=function(){
	return this.camara;
}


/**
 * @function update
 * @memberof Escenario
 * @summary Renderiza el escneario
 * @param {THREE.Scene}
*/
Escenario.prototype.update=function(renderer){
	//this.renderer.render(scene.escena,scene.camara);
	//this.renderer.clearDepth();
	//console.log("ACTUALIZANDO escneario");
	if(renderer!=undefined){
//		console.log("Actualizando");
		this.escena.process();
		this.escena.renderOn(renderer);
	}
}


/**
 * @function limpiar
 * @memberof Escenario
 * @summary Limpia todos los elementos en la escena
*/
Escenario.prototype.limpiar=function(){
	while(this.escena.children.length>0)
		this.escena.remove(this.escena.children[0]);
}
module.exports=Escenario;
