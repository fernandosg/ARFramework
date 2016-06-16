function Escenario(){
	this.escena=new THREE.Scene();		
}

Escenario.prototype.initCamara=function(fn){
	if(fn==undefined){
		this.camara=new THREE.Camera();
	}else
		fn.call(this);
}


Escenario.prototype.anadir=function(elemento){
	this.escena.add(elemento);
}

Escenario.prototype.getCamara=function(){
	return this.camara;
}

Escenario.prototype.update=function(scene){
	this.renderer.render(scene.escena,scene.camara);
	this.renderer.clearDepth();
}
module.exports=Escenario;