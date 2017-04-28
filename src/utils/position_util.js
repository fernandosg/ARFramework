function PositionUtil(config){
	/*
	this.width=config.WIDTH;
	this.height=config.HEIGHT;
	this.escena=config.SCENE;
	this.distancia=config.DISTANCE;
	*/
}

PositionUtil.prototype.obtenerPosicionPantalla=function(obj){
	var vector = new THREE.Vector3();
	vector.setFromMatrixPosition(obj.matrixWorld);
	vector.project(this.escena.camara);
	var mitadAncho = this.width / 2, mitadAlto = this.height / 2;
	vector.x = ( vector.x * mitadAncho ) + mitadAlto;
	vector.y = -( vector.y * mitadAlto ) + mitadAlto;
	return vector;
}

PositionUtil.prototype.getDistancia=function(pos1,pos2){
	pos1.z=0;
	pos2.z=0;
	return Math.sqrt(Math.pow((pos1.x-pos2.x),2)+Math.pow((pos1.y-pos2.y),2));
}

PositionUtil.prototype.estaColisionando=function(pos1,pos2){
	var distancia=this.getDistancia(pos1,pos2);
	return distancia>0 && distancia<=60;
}


module.exports=PositionUtil;
