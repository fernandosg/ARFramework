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

	/**
	* @function obtenerPosicionPantalla
	* @memberof PositionUtil
	* @summary Permite calcular la posición "VISUAL" (en un plano de 2D) del objeto en escena.
	* @param {THREE.Object3D} obj - Una instancia de THREE.Object3D.
  * @returns {THREE.Vector3}
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

	/**
	* @function getDistancia
	* @memberof PositionUtil
	* @summary Permite obtener la "distancia", aplicando la formula para obtener la distancia euclidiana, entre dos objetos (objeto 1 y objeto 2).
	* @param {Object} pos1 - La posición del objeto 1. Este parámetro es un objeto con 3 propiedades (X, Y y Z), puede ser una instancia de THREE.Vector3, gracias a la similitud de su estuctura.
	* @param {Object} pos2 - La posición del objeto 2. Este parámetro es un objeto con 3 propiedades (X, Y y Z), puede ser una instancia de THREE.Vector3, gracias a la similitud de su estuctura
  * @returns {Float}
	*/
	var getDistancia=function(pos1,pos2){
		pos1.z=0;
		pos2.z=0;
		return Math.sqrt(Math.pow((pos1.x-pos2.x),2)+Math.pow((pos1.y-pos2.y),2));
	}

	/**
	* @function estaColisionando
	* @memberof PositionUtil
	* @summary Permite identificar si dos objetos estan "colisionando", gracias al calculo de la distancia euclidiana
	* @param {Array} params - Un arreglo de 2 objetos, estos objetos deben de tener 3 propiedades, X, Y y Z.
  * @returns {Boolean}
	*/
	var estaColisionando=function(params){
		var distancia=getDistancia(params[0],params[1]);
		return distancia>0 && distancia<=DISTANCE;
	}

	/**
	* @function isColliding
	* @memberof PositionUtil
	* @summary Permite identificar si dos objetos estan "colisionando", gracias al calculo de la distancia euclidiana
	* @param {Array} params - Un arreglo de 2 objetos, estos objetos deben de tener 3 propiedades, X, Y y Z.
  * @returns {Boolean}
	*/
	var isColliding=function(params){
		var distancia=getDistancia(params[0].getWorldPosition(),params[1].get().getWorldPosition());
		return distancia>0 && distancia<=DISTANCE;
	}


	/**
	* @function init
	* @memberof PositionUtil
	* @summary Permite crear una instancia de la función PositionUtil, esto permite pasarle un parámetro para la configuración de la distancia.
	* @param {Object} config - Un objeto, el cual si se desea definir una distancia mínima para la colisión, debe de tener una propiedad "DISTANCE".
  * @returns {PositionUtil}
	*/
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
module.exports=PositionUtil;
