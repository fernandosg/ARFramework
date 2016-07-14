function Mensajes(config){
	this.juego=config.game;
	this.elemento=config.div;
	this.capa==null;
	this.tipo=config.type;
	this.imagen=null;
	return this;		
}

Mensajes.prototype.srcImage=function(src){
	if(this.tipo=="image" && this.imagen==null){
		this.imagen=new Image();		
		this.crearCapa();
		this.capa.style.width="0px";
		this.capa.style.height="0px";
		this.capa.appendChild(this.imagen);
	}
	this.imagen.src=src;
	return this;
}

Mensajes.prototype.crearCapa=function(){
	if(this.capa==null){
		this.capa=document.createElement("div");
		this.capa.classList.add("mensajes");
    	this.capa.setAttribute("class", "mensajes");
		document.getElementById(this.elemento).appendChild(this.capa);
	}
}

Mensajes.prototype.aviso=function(texto){	
	this.crearCapa()
	if(this.tipo!="image")
		this.capa.innerHTML=texto;
	return this;
}

Mensajes.prototype.position=function(pos){
	this.crearCapa();
	for(var attr in pos)
		this.capa.style[attr]=pos[attr];
	return this;
}

Mensajes.prototype.mostrar=function(){
	this.capa.style.display="block";			
	setTimeout(function(){
		this.capa.style.display="none";
	}.bind(this),3000);

	return this;
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