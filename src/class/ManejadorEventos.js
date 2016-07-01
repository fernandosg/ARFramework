function Manejador(){
	this.lista_eventos={};
};

Manejador.prototype.suscribir=function(evento,objeto){
	if(!this.lista_eventos[evento]) this.lista_eventos[evento]=[];
	if(this.lista_eventos[evento].indexOf(objeto)==-1){
		this.lista_eventos[evento].push(objeto);
	}		
	console.log("Suscribiendo");
}

Manejador.prototype.disparar=function(evento,objeto,callback,extras){
	if(!this.lista_eventos[evento]) return;	
	for(var i=0;i<this.lista_eventos[evento].length;i++){
		objeto_action=this.lista_eventos[evento][i];		
		callback.call(extras.stage,objeto_action.dispatch(objeto),objeto_action);
	}
}

Manejador.prototype.dispararParticular=function(evento,objeto,compara,callback){
	if(!this.lista_eventos[evento]) return;		
	var pos=this.lista_eventos[evento].indexOf(objeto);
	if(pos==-1) return;
	var extras={};
	extras["observador"]=this;
	callback(this.lista_eventos[evento][pos].dispatch(compara),extras);
}

Manejador.prototype.baja=function(evento,objeto){
	if(this.lista_eventos[evento].indexOf(objeto)==-1) return;
	this.lista_eventos[evento].splice(this.lista_eventos[evento].indexOf(objeto),1);
}
module.exports=Manejador;