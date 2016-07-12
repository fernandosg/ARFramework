function Mensajes(juego,capa){
	this.juego=juego;
	this.elemento=capa;
	this.capa==null;
}

Mensajes.prototype.aviso=function(texto){	
	if(this.capa==null){
		this.capa=document.createElement("div");
		this.capa.id="mensajes";
		document.getElementById(this.elemento).appendChild(this.capa);
		this.capa.style.cssText="width:300px;background-color:white;color:black;position:absolute;top:0px";
	}
	this.capa.innerHTML=texto;
	this.capa.style.display="block";		
	setTimeout(function(){
		this.capa.style.display="none";
	}.bind(this),3000);	
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
		console.log("Desbloqueado en alerta");
		parent.juego.desbloquear();
	},datos.tiempo);
}
module.exports=Mensajes;