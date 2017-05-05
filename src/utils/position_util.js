function PositionUtil(config){
/*
	var width=config.WIDTH;
	var height=config.HEIGHT;
	var escena=config.SCENE;
	var distancia=config.DISTANCE;
*/
	var obtenerPosicionPantalla=function(obj){
		var vector = new THREE.Vector3();
		vector.setFromMatrixPosition(obj.matrixWorld);
		vector.project(escena.camara);
		var mitadAncho = width / 2, mitadAlto = height / 2;
		vector.x = ( vector.x * mitadAncho ) + mitadAlto;
		vector.y = -( vector.y * mitadAlto ) + mitadAlto;
		return vector;
	}

	var getDistancia=function(pos1,pos2){
		pos1.z=0;
		pos2.z=0;
		return Math.sqrt(Math.pow((pos1.x-pos2.x),2)+Math.pow((pos1.y-pos2.y),2));
	}

	var estaColisionando=function(params){
		var distancia=getDistancia(params[0],params[1]);
		return distancia>0 && distancia<=60;
	}


	var isColliding=function(params){
		var distancia=getDistancia(params[0],params[1]);
		return distancia>0 && distancia<=60;
	}

	return{
		obtenerPosicionPantalla:obtenerPosicionPantalla,
		getDistancia:getDistancia,
		estaColisionando:estaColisionando,
		isColliding:isColliding
	}
}
module.exports=PositionUtil;
