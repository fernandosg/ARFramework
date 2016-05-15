function Mensajes(juego){
	this.juego=juego;
}

Mensajes.prototype.precaucion=function(datos){
	this.juego.bloquear();
	var parent=this;
	console.log(datos.texto);
	setTimeout(function(){
		console.log("Desbloqueado");
		parent.juego.desbloquear();
	},datos.tiempo);
}

Mensajes.prototype.alerta=function(datos){
	this.juego.bloquear();
	var parent=this;
	console.log(datos.texto);
	setTimeout(function(){
		console.log("Desbloqueado");
		parent.juego.desbloquear();
	},datos.tiempo);
}
module.exports=Mensajes;