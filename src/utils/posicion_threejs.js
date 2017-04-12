function PosicionThreeJS(config){
	this.width=config.width;
	this.height=config.height;
  this.escena=config.escena;
}

PosicionThreeJS.prototype.obtenerPosicionPantalla=function(obj){
	var vector = new THREE.Vector3();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(this.escena.camara);
    var mitadAncho = this.width / 2, mitadAlto = this.height / 2;
    vector.x = ( vector.x * mitadAncho ) + mitadAlto;
    vector.y = -( vector.y * mitadAlto ) + mitadAlto;
    return vector;
}

module.exports=PosicionThreeJS;
