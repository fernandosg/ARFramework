/**
 * Clase Escenario
*/
function Escenario(){
	this.escena=new THREE.Scene();
}

/**
 * @desc Permite inicializar la cámara que se encargara de observar este escenario
 * @public
 * @param {Function} - (Opcional) Esta función se ejecutara usando el ambito de la función Escenario. Sirve principalmente para definir una configuración predefinida para la cámara
*/
Escenario.prototype.initCamara=function(fn){
	if(fn==undefined){
		this.camara=new THREE.Camera();
	}else
		fn.call(this);
}


/**
 * @desc Permite inicializar la cámara que se encargara de observar este escenario
 * @public
 * @param {THREE.Object3D} - Es el objeto que se añadira al escenario
*/
Escenario.prototype.anadir=function(elemento){
	this.escena.add(elemento);
}


/**
 * @desc Retorna la cámara de esta escena
 * @return {THREE.Camera} - La cámara definida en este escenario
*/
Escenario.prototype.getCamara=function(){
	return this.camara;
}


/**
 * @desc Renderiza el escneario
 * @param {THREE.Scene}
*/
Escenario.prototype.update=function(scene){
	this.renderer.render(scene.escena,scene.camara);
	this.renderer.clearDepth();
}


/**
 * @desc Limpia todos los elementos en la escena
*/
Escenario.prototype.limpiar=function(){
	while(this.escena.children.length>0)
		this.escena.remove(this.escena.children[0]);
}
module.exports=Escenario;
