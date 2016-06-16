function ARWeb(configuracion){	
	this.detect=false;
	this.etapas=[];
	this.renderer=new THREE.WebGLRenderer();
  	this.renderer.autoClear = false;
  	this.WIDTH_CANVAS=configuracion["width"];
  	this.HEIGHT_CANVAS=configuracion["height"];
  	this.renderer.setSize(configuracion["width"],configuracion["height"]);  	
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

ARWeb.prototype.init=function(){	
	var Escenario=require("./escenario.js");
	var WebcamStream=require("./webcamstream.js");
  	var DetectorAR=require("./detector");
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
	this.mano_obj=new this.Elemento(60,60,new THREE.PlaneGeometry(60,60));
  	this.mano_obj.init();
  	this.mano_obj.etiqueta("Detector");
  	this.mano_obj.definir("../../assets/img/mano_escala.png",this.mano_obj);
  	this.objeto=new THREE.Object3D();
  	this.objeto.add(this.mano_obj.get());
  	this.objeto.position.z=-1;
  	this.objeto.matrixAutoUpdate = false;
  	this.realidadEscena.anadir(this.objeto);
  	this.detector_ar=DetectorAR(this.webcam.getCanvas());
  	this.detector_ar.init();
  	this.detector_ar.setCameraMatrix(this.realidadEscena.getCamara());
}

ARWeb.prototype.addStage=function(fn){
	this.etapas.push(fn);
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
	if(this.detect)
		if(this.detector_ar.markerToObject(this.objeto))
			this.etapas[0].fnAfter.call(this,this.etapas[0]);
	if(this.etapas.length>0)
		this.etapas[0].loop.call(this,this.etapas[0]);	

	requestAnimationFrame(this.loop.bind(this));
}

ARWeb.prototype.run=function(){
	this.etapas[0].init.call(this,this.etapas[0]);
	this.loop();
}

ARWeb.prototype.finishStage=function(){
	this.etapas.shift();
}


module.exports=ARWeb;