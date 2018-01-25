/**
 * @file Mediador
 * @author Fernando Segura Gómez, Twitter: @fsgdev
 * @version 0.1
 */

 /**
  * Clase Mediador
  * @class Mediador
  * @constructor
 */
class Mediador{
	constructor(){
		this.lista_eventos={};
		this.lista_eventos_a_disparar={};
	}

	/**
	 * @function suscribir
	 * @memberof Mediador
	 * @summary Permite suscribir un evento a la escucha que el Mediador ocupara para comunicar a ciertos objetos que esten escuchando a dicho evento
	 * @param {String} evento - El evento que el Mediador ocupara para comunicarse con el objeto añadido.
	 * @param {Elemento} objeto - El objeto el cual puede tener comunicación con el Mediador con un evento especifico.
	*/
	suscribir(evento,objeto,event){
		if(!this.lista_eventos[evento]) this.lista_eventos[evento]=[];
		if(this.lista_eventos[evento].indexOf(objeto)==-1){
			this.lista_eventos[evento].push(objeto);
			this.lista_eventos_a_disparar[objeto.get().id]=event;
		}
	}

	/**
	 * @function comunicar
	 * @memberof Mediador
	 * @summary Evento comunicar
	 * @param {String} evento
	 * @param {Elemento} objeto
	 * @param {Function} callback
	 * @param {extras} Object
	*/
	comunicar(evento,params_for_event_to_dispatch,callback,stage){//Mediador.prototype.comunicar=function(evento,objeto,callback,stage){
		if(!this.lista_eventos[evento]) return;
		let objeto_action=null,new_params=null;
		for(let i=0;i<this.lista_eventos[evento].length;i++){
			objeto_action=this.lista_eventos[evento][i];
			new_params=params_for_event_to_dispatch.slice();
			new_params.push(objeto_action);
			callback.call(stage,this.lista_eventos_a_disparar[objeto_action.get().id].call(stage,new_params),objeto_action);
			//callback.call(stage,objeto_action.dispatch(objeto),objeto_action);
		}
	}

	/**
	 * @function comunicarParticular
	 * @memberof Mediador
	 * @summary Evento comunicar
	 * @param {String} evento
	 * @param {Elemento} objeto
	 * @param {Function} callback
	 * @param {extras} Object
	*/
	comunicarParticular(evento,objeto,params_for_event_to_dispatch,callback){
		if(!this.lista_eventos[evento]) return;
		var pos=this.lista_eventos[evento].indexOf(objeto);
		if(pos==-1) return;
		var new_params=params_for_event_to_dispatch.slice();
		new_params.push(objeto);
		callback(this.lista_eventos_a_disparar[this.lista_eventos[evento][pos].get().id].call(this,new_params),objeto);
		//callback(this.lista_eventos[evento][pos].dispatch(compara),extras);
	}

	/**
	 * @function baja
	 * @memberof Mediador
	 * @summary Evento comunicar
	 * @param {String} evento
	 * @param {Elemento} objeto
	*/
	baja(evento,objeto){
		if(this.lista_eventos[evento].indexOf(objeto)==-1) return;
		this.lista_eventos[evento].splice(this.lista_eventos[evento].indexOf(objeto),1);
	}
}
export { Mediador as default}
