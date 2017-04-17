function ARFramework(configuration){//
  var Animacion=require('./utils/animacion.js');
  var Escenario=require("./class/escenario.js");
  var WebcamStream=require("./utils/webcamstream.js");
  var DetectorAR=require("./utils/detector_ar");
  var Mediador=require("./utils/Mediador.js");
  this.Elemento=require("./class/elemento.js");
  this.configuration=configuration;
  this.mediador=new Mediador();
  this.webcam=new WebcamStream({"WIDTH":configuration.WIDTH,"HEIGHT":configuration.HEIGHT});
  this.renderer=new THREE.WebGLRenderer();
  this.renderer.autoClear = false;
  this.objetos=[]
  this.renderer.setSize(configuration.WIDTH,configuration.HEIGHT);
  //Should be use "ra" in the example of Memorama
  document.getElementById(configuration.canvas_id).appendChild(this.renderer.domElement);
  this.detector_ar=DetectorAR(this.webcam.getCanvas());
  this.detector_ar.init();
  this.animacion=new Animacion();
  this.planoEscena=new Escenario();
  this.realidadEscena=new Escenario();
  this.videoEscena=new Escenario();
  this.stages=[];
}

ARFramework.prototype.getAnimation=function(){
  return this.animacion;
}

ARFramework.prototype.addToScene=function(object,is_an_object_actionable){
  this.planoEscena.anadir(object.get());
  if(is_an_object_actionable)
  this.objetos.push(object);
  return this;
}

ARFramework.prototype.checkLenghtObjects=function(){
  return this.objetos.length;
}

ARFramework.prototype.getObject=function(position){
  return this.objetos[position];
}

ARFramework.prototype.getWidth=function(){
  return this.configuration.WIDTH;
}

ARFramework.prototype.getHeight=function(){
  return this.configuration.HEIGHT;
}

ARFramework.prototype.init=function(){
  this.planoEscena.initCamara(function(){
    this.camara=new THREE.PerspectiveCamera();
    this.camara.near=0.1;
    this.camara.far=2000;
    this.camara.updateProjectionMatrix();
  });
  this.cantidad_cartas=4;
  this.realidadEscena.initCamara();
  this.videoEscena.initCamara();
  this.videoEscena.anadir(this.webcam.getElemento());
  this.detector_ar.setCameraMatrix(this.realidadEscena.getCamara());
}

ARFramework.prototype.createElement=function(configuration){
  return new this.Elemento(configuration.WIDTH,configuration.HEIGHT,configuration.GEOMETRY);
}

ARFramework.prototype.addStage=function(stage){
  this.stages.push(stage);
}

ARFramework.prototype.start=function(){
  this.stages[0].start();
  this.loop();
}

/**
* @function addMarker
* @summary Agrega un marcador a la instancia de DetectorAR, donde una vez que se identifique el marcador se ejecutara el callback especificado
* @param {Object} marcador - Un objeto con 3 propiedades
* 1) id (integer - es el identificador que ocupa JSArtoolkit para un marcador especifico),
* 2) callback (function - es la función a ejecutar una vez que el marcador se haya detectado),
* 3) puntero (THREE.Object3D - es el objeto el cual tendra la posicion del marcador detectado)
*/
ARFramework.prototype.addMarker=function(marcador){
  this.detector_ar.addMarker.call(this,marcador);
  if(marcador.puntero!=undefined)
  this.realidadEscena.anadir(marcador.puntero);
  return this;
}


/**
* @function allowDetect
* @param {boolean} bool
*/
ARFramework.prototype.allowDetect=function(boolean){
  this.detecting_marker=boolean;
}

ARFramework.prototype.allowedDetected=function(){
  return this.detecting_marker;
}

/**
* @function loop
* @summary Esta función se estara ejecutando finitamente hasta que se cierre la aplicación.
* Se encargara del redibujo de todos los elementos agregados a escena y la actualización del canvas con la transmisión de la webcam.
*/
ARFramework.prototype.loop=function(){
  this.renderer.clear();
  this.videoEscena.update.call(this,this.videoEscena);
  this.planoEscena.update.call(this,this.planoEscena);
  this.realidadEscena.update.call(this,this.realidadEscena);
  this.webcam.update();
  if(this.detecting_marker)
  this.detector_ar.detectMarker(this.stages[0]);
  for(var i=0;i<this.objetos.length;i++)
  this.objetos[i].actualizar();
  if(this.stages.length>0){
    this.stages[0].loop();
    requestAnimationFrame(this.loop.bind(this));
  }
}

ARFramework.prototype.watch=function(action){
  this.mediador.suscribir(action,this.objetos[this.objetos.length-1]);
}

ARFramework.prototype.removeWatch=function(action,object){
  this.mediador.baja(action,object);
}

ARFramework.prototype.dispatch=function(action,object,callback,extras){
  this.mediador.comunicar(action,object,callback,extras);
}

ARFramework.prototype.individualDispatch=function(action,object,pointer,callback,reference){
  this.mediador.comunicarParticular(action,object,pointer,callback.bind(reference))
}

ARFramework.prototype.changeThreshold=function(i){
  this.detector_ar.cambiarThreshold(i);
}

ARFramework.prototype.canDetectMarker=function(stage){
  return this.detector_ar.detectMarker(stage);
}

ARFramework.prototype.clean=function(){
  this.planoEscena.limpiar();
  this.realidadEscena.limpiar();
  this.detector_ar.cleanMarkers();
  this.objetos=[];
}

ARFramework.prototype.finishStage=function(){
  this.clean();
  this.stages.shift();
  if(this.stages.length>0)
    this.stages[0].start();
}

window.ARFramework=ARFramework;
