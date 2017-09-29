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
function EscenarioReal(){
	this.scene=new THREE.Scene();
}


/**
 * @function initCamara
 * @memberof Escenario
 * @summary Permite inicializar la cámara que se encargara de observar este escenario
 * @param {Function} - (Opcional) Esta función se ejecutara usando el ambito de la función Escenario. Sirve principalmente para definir una configuración predefinida para la cámara
*/
EscenarioReal.prototype.initCamara=function(fn){
	if(fn==undefined){
		this.camera=new THREE.Camera();
    //this.camera.lookAt(this.scene.position);
	}else
		fn.call(this);
  //this.camera.lookAt(this.scene.position);
}


/**
 * @function anadir
 * @memberof Escenario
 * @summary Permite inicializar la cámara que se encargara de observar este escenario
 * @param {THREE.Object3D} - Es el objeto que se añadira al escenario
*/
EscenarioReal.prototype.anadir=function(elemento){
		this.scene.add(elemento);
}


/**
 * @function getCamara
 * @memberof Escenario
 * @summary Retorna la cámara de esta escena
 * @returns {THREE.Camera} - La cámara definida en este escenario
*/
EscenarioReal.prototype.getCamara=function(){
	return this.camera;
}


/**
 * @function update
 * @memberof Escenario
 * @summary Renderiza el escneario
 * @param {THREE.Scene}
*/
EscenarioReal.prototype.update=function(renderer){
	//this.renderer.render(scene.escena,scene.camara);
	//console.log("ACTUALIZANDO escneario");
	if(renderer!=undefined){
//		console.log("Actualizando");
    renderer.autoClear=false;
    renderer.render(this.scene,this.camera);
    //renderer.autoClear=true;
	}
}


/**
 * @function limpiar
 * @memberof Escenario
 * @summary Limpia todos los elementos en la escena
*/
EscenarioReal.prototype.limpiar=function(){
	while(this.escena.children.length>0)
		this.escena.remove(this.escena.children[0]);
}
module.exports=EscenarioReal;
