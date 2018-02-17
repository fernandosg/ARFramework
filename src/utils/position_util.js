/**
* @file PositionUtil
* @author Fernando Segura Gómez, Twitter: @fsgdev
* @version 0.1
*/
/**
* Clase PositionUtil
* @class PositionUtil
* @constructor
* @param {Object} config - Recibe un objeto con 1 propiedad, llamada DISTANCE. Esta propiedad identifica la distancia mìnima para que se identifíque como "colisión"
*/
function PositionUtil(config){
	var DISTANCE=(config && config.DISTANCE) || 60;
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
		return distancia>0 && distancia<=DISTANCE;
	}


	var isColliding=function(params){
		var distancia=getDistancia(params[0].getWorldPosition(),params[1].get().getWorldPosition());
		return distancia>0 && distancia<=DISTANCE;
	}


	//Handle new configuration.
	var init=function(config){
		return new PositionUtil(config);
	}

	return{
		init:init,
		obtenerPosicionPantalla:obtenerPosicionPantalla,
		getDistancia:getDistancia,
		estaColisionando:estaColisionando,
		isColliding:isColliding
	}
}

export { PositionUtil as default}
