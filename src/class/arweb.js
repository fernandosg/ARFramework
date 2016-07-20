function ARWeb(configuracion){	
	this.detect=false;
	this.etapas=[];
	this.renderer=new THREE.WebGLRenderer();
  	this.renderer.autoClear = false;
  	this.WIDTH_CANVAS=configuracion["width"];
  	this.HEIGHT_CANVAS=configuracion["height"];
  	this.renderer.setSize(configuracion["width"],configuracion["height"]);  
  	this.Mensajes=require("../libs/mensajes.js");
  	this.raiz=configuracion["elemento"];
  	document.getElementById(configuracion["elemento"]).appendChild(this.renderer.domElement);
  	 THREE.Matrix4.prototype.setFromArray = function(m) {
          return this.set(
            m[0], m[4], m[8], m[12],
            m[1], m[5], m[9], m[13],
            m[2], m[6], m[10], m[14],
            m[3], m[7], m[11], m[15]
          );
  	}
}

ARWeb.prototype.allowDetect=function(detect){
	this.detect=detect;
}

ARWeb.prototype.bloquear=function(){
	this.allowDetect(false);
}
ARWeb.prototype.desbloquear=function(){
	this.allowDetect(true);
}

ARWeb.prototype.lanzarMensaje=function(tipo,datos){
	if(this.mensajes[tipo]!=undefined)
		this.mensajes[tipo](datos);
}

ARWeb.prototype.init=function(){	
	var Escenario=require("./escenario.js");
	var WebcamStream=require("./webcamstream.js");
  	var DetectorAR=require("./detector");
  	var Observador=require("./ManejadorEventos");
  	var Mensajes=require("../libs/mensajes.js");
  	var PositionUtils=require("../libs/position_utils.js");
  	this.observador=new Observador();
  	this.mensajes=new Mensajes(this);
  	this.Elemento=require("./elemento");
	this.planoEscena=new Escenario();
	this.realidadEscena=new Escenario();
	this.videoEscena=new Escenario();
	this.planoEscena.initCamara(function(){
		this.camara=new THREE.PerspectiveCamera();//THREE.Camera(); 
  		this.camara.near=0.1;
  		this.camara.far=2000;
  		this.camara.updateProjectionMatrix();
	});
	this.realidadEscena.initCamara();
	this.videoEscena.initCamara();
	this.webcam=new WebcamStream({"WIDTH":this.WIDTH_CANVAS,"HEIGHT":this.HEIGHT_CANVAS});
	this.videoEscena.anadir(this.webcam.getElemento());	
  	this.detector_ar=DetectorAR(this.webcam.getCanvas());
  	this.detector_ar.init();
  	this.detector_ar.setCameraMatrix(this.realidadEscena.getCamara());
  	this.canvas_video=this.webcam.getCanvas();  	
  	this.position_utils=new PositionUtils({width:this.WIDTH_CANVAS,height:this.HEIGHT_CANVAS,escena:this.planoEscena});
}

ARWeb.prototype.anadirMarcador=function(marcador){
	this.detector_ar.addMarker.call(this,marcador);
	if(marcador.puntero!=undefined)
  		this.realidadEscena.anadir(marcador.puntero);
  	return this;
}

ARWeb.prototype.adjuntarMarcadores=function(){
	this.detector_ar.attach(arguments);
	for(var marker in arguments)
		if(marker.puntero!=undefined)
  			this.realidadEscena.anadir(marker.puntero);	
}

ARWeb.prototype.addStage=function(fn){
	fn.observador=this.observador;
	fn.position_utils=this.position_utils;
	this.etapas.push(fn);
}

ARWeb.prototype.setPuntero=function(obj){
  	obj.matrixAutoUpdate = false;
	this.puntero=obj;
	this.realidadEscena.anadir(this.puntero);
}

ARWeb.prototype.anadir=function(elemento){
	this.planoEscena.anadir(elemento);
}

ARWeb.prototype.prueba=function(){
	return this;
}

ARWeb.prototype.loop=function(){
	this.renderer.clear();
	this.videoEscena.update.call(this,this.videoEscena);
	this.planoEscena.update.call(this,this.planoEscena);
	this.realidadEscena.update.call(this,this.realidadEscena);
	this.webcam.update();	
	if(this.etapas.length>0){
		if(this.detect)
			this.detector_ar.detectMarker(this.etapas[0]);	
		this.etapas[0].loop.call(this,this.etapas[0]);					
		requestAnimationFrame(this.loop.bind(this));
	}else{
		console.log("Finished AR")
	}
}

ARWeb.prototype.run=function(){
	this.etapas[0].init.call(this,this.etapas[0]);
	this.loop();
}

ARWeb.prototype.finishStage=function(){
	this.etapas.shift();
	this.planoEscena.limpiar();
  	this.realidadEscena.limpiar();
  	this.detector_ar.cleanMarkers();
	if(this.etapas.length>0)
		this.etapas[0].init.call(this,this.etapas[0]);
}


module.exports=ARWeb;