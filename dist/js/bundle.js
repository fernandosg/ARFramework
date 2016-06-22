(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//DEBUG=true;
Calibrar=require("../src/calibracion.js");
Memorama=require("../src/memorama.js");
Basketball=require("../src/basketball.js");
calibracion=new Calibrar();
//memorama=new Memorama();
//basketball=new Basketball();
//ColorStage=require("../src/trackingcolor.js");
//var tracking=new ColorStage();
ARWeb=require("../src/class/arweb.js");
arweb=new ARWeb({"width":1000,"height":800,"elemento":"ra"});
arweb.init();
//arweb.addStage(tracking);
arweb.addStage(calibracion);
//arweb.addStage(memorama);
//arweb.addStage(basketball);
arweb.run();
},{"../src/basketball.js":2,"../src/calibracion.js":3,"../src/class/arweb.js":5,"../src/memorama.js":14}],2:[function(require,module,exports){
function Basketball(){

}

Basketball.prototype.init = function(stage) {	
	stage.balon=new this.Elemento(61,60,new THREE.PlaneGeometry(61,60));
	stage.balon.init();
	stage.balon.definir("./assets/img/basket/balon.png",stage.balon);
	stage.balon.visible(false);
	this.setPuntero(stage.balon.get());
	stage.canasta=new this.Elemento(120,134,new THREE.PlaneGeometry(120,134));	
	stage.canasta.init();
	stage.canasta.definir("./assets/img/basket/canasta.png",stage.canasta);
	stage.canasta.position({x:30,y:30,z:-600});
    this.observador.suscribir("colision",stage.canasta);
	this.anadir(stage.canasta.get());
	this.allowDetect(true);
	this.anadirMarcador({id:16,callback:stage.fnAfter,puntero:stage.balon.get()});
};



Basketball.prototype.fnAfter = function(stage) {
	if(this.puntero.getWorldPosition().z>300 && this.puntero.getWorldPosition().z<=500)
		stage.logica(this,stage);
	
};

Basketball.prototype.logica=function(that,stage){	
   that.observador.dispararParticular("colision",stage.canasta,that.puntero,function(esColision,extras){
   	if(esColision){
   		console.log("Enceste");
   	}
   });
}

Basketball.prototype.loop = function(stage) {
	stage.balon.actualizar();
	stage.canasta.actualizar();
};
module.exports=Basketball;
},{}],3:[function(require,module,exports){
function Calibrar(){
  this.bloqueado=false;
}


Calibrar.prototype.bloquear=function(){
  this.bloqueado=true;
}

Calibrar.prototype.desbloquear=function(){
  this.bloqueado=false;
}

Calibrar.prototype.init=function(stage){ 
  Mensajes=require("./libs/mensajes.js");
  mensajes=new Mensajes(this);
  stage.cantidad_cartas=4;
  mensaje="Bienvenido al proceso de calibración.<br>";
  descripcion="Para mayor eficacia en el uso del rehabilitador, es necesario asegurar que puedas hacer los ejercicios de manera adecuada. Te pedimos, te coloques a no más de 90cm con el brazo extendido, una vez en posición, pide a alguien que de clic en la opción Calibrar.<br>";
  descripcion+="Una vez calibrado, aparecerán 4 cuadros, selecciona cada uno, conforme al orden que aparece abajo de este mensaje. Una vez seleccionado todos, iniciara el primer nivel de Memorama";
  document.getElementById("informacion_nivel").innerHTML=mensaje+""+descripcion;  
  //var cantidad_cartas=this.cantidad_cartas;
  stage.objetos=[];
  stage.colores=["rgb(34, 208, 6)","rgb(25, 11, 228)","rgb(244, 6, 6)","rgb(244, 232, 6)"];    

  //CREACION DE OBJETOS A SELECCIONAR PARA CALIBRAR
  limite_renglon=Math.floor(stage.cantidad_cartas/2)+1;
  tamano_elemento=80;
  margenes_espacio=(this.WIDTH_CANVAS-(tamano_elemento*limite_renglon))/limite_renglon;
 

   /*
    FUNCION PARA RENDERIZADO DE LAS ESCENAS.
  */
  stage.calibracion_correcta=false;
  stage.puntos_encontrados=false;  
  stage.umbral=0;  
  stage.pos_elegido=0;
  stage.detener=false;
  calibrar=false;
  document.getElementById("colorSelect").style.backgroundColor=stage.colores[stage.pos_elegido];
  document.getElementById("calibrar").addEventListener("click",function(){
    calibrar=true;    
  });
  var mano_obj=new this.Elemento(60,60,new THREE.PlaneGeometry(60,60));
  mano_obj.init();
  mano_obj.etiqueta("Detector");
  mano_obj.definir("../../assets/img/mano_escala.png",mano_obj);
  var objeto=new THREE.Object3D();
  objeto.add(mano_obj.get());
  objeto.position.z=-1;
  objeto.matrixAutoUpdate = false;
  this.puntero=objeto;
  this.puntero.visible=false;
  this.anadirMarcador({id:16,callback:stage.fnAfter,puntero:this.puntero});
  this.anadirMarcador({id:1,callback:stage.ayuda,puntero:this.puntero});
  this.anadirMarcador({id:2,callback:stage.config,puntero:this.puntero});
}

Calibrar.prototype.ayuda=function(stage){
  console.log("Marker for help");
}

Calibrar.prototype.config=function(){
  console.log("Marker for config");
}

Calibrar.prototype.loop=function(stage){    
    if(calibrar){
      threshold_total=0;
      threshold_conteo=0;
      for(var i=0;i<300;i++){
        this.detector_ar.cambiarThreshold(i);
        if(this.detector_ar.detectMarker(this)){
          threshold_total+=i;
          threshold_conteo++;
        }
      }
      if(threshold_conteo>0){
        threshold_total=threshold_total/threshold_conteo;
        this.detector_ar.cambiarThreshold(threshold_total);        
        stage.calibracion_correcta=true;    
        calibrar=false;
        threshold_conteo=0;
        threshold_total=0;
        stage.Siguiente(this,stage);//PARTE PARA INDICAR LOS OBJETOS A COLISIONAR PARA VER SI FUNCIONA BIE                  
      }
      calibrar=false;
    }
    if(stage.calibracion_correcta && !stage.puntos_encontrados)      
      this.allowDetect(true);
    else if(stage.puntos_encontrados){    
      document.getElementById("informacion_calibrar").setAttribute("style","display:none;");
      stage.detener=true;
    }
    if(stage.detener)
     this.finishStage(); 
  }



Calibrar.prototype.Siguiente=function(parent,stage){    
    stage.objetos=[];
     for(var x=1,cont_fila=1,pos_y=-100,fila_pos=x,pos_x=-200;x<=stage.cantidad_cartas;x++,pos_y=((fila_pos>=limite_renglon-1) ? pos_y+120+50 : pos_y) ,fila_pos=((fila_pos>=limite_renglon-1) ? 1 : fila_pos+1),pos_x=(fila_pos==1 ? -200 : (pos_x+margenes_espacio+tamano_elemento))){             
        var elemento=new parent.Elemento(tamano_elemento,tamano_elemento,new THREE.PlaneGeometry(tamano_elemento,tamano_elemento));
        elemento.init();
        elemento.etiqueta(stage.colores[x-1]);
        elemento.position({x:pos_x,y:pos_y,z:-600});  
        elemento.calculoOrigen();
        stage.objetos.push(elemento);
        elemento.definirBackground(stage.colores[x-1]);
        parent.observador.suscribir("colision",stage.objetos[stage.objetos.length-1]);
        parent.anadir(elemento.get());
      }

}

Calibrar.prototype.fnAfter=function(stage){    
    if(this.puntero.getWorldPosition().z>300 && this.puntero.getWorldPosition().z<=500){  
      this.mano_obj.actualizarPosicionesYescala(this.puntero.getWorldPosition(),this.puntero.getWorldScale());        
      this.observador.dispararParticular("colision",stage.objetos[stage.pos_elegido],this.puntero,function(esColision,extras){
        if(esColision){        
          stage.pos_elegido++;
          document.getElementById("colorSelect").style.backgroundColor=stage.colores[stage.pos_elegido];
          if(stage.pos_elegido==stage.cantidad_cartas)
            stage.puntos_encontrados=true;
        }
      });
    }
  }


module.exports=Calibrar;
},{"./libs/mensajes.js":13}],4:[function(require,module,exports){
function Manejador(){
	this.lista_eventos={};
};

Manejador.prototype.suscribir=function(evento,objeto){
	if(!this.lista_eventos[evento]) this.lista_eventos[evento]=[];
	if(this.lista_eventos[evento].indexOf(objeto)==-1){
		this.lista_eventos[evento].push(objeto);
	}		
	console.log("Suscribiendo");
	console.dir(this.lista_eventos);
}

Manejador.prototype.disparar=function(evento,objeto,callback,extras){
	if(!this.lista_eventos[evento]) return;			
	extras["manejador"]=this;
	for(var i=0;i<this.lista_eventos[evento].length;i++){
		//this.lista_eventos[evento][i].dispatch(objeto);
		objeto_action=this.lista_eventos[evento][i];		
		callback(objeto_action.dispatch(objeto),objeto_action,extras);
	}
}

Manejador.prototype.dispararParticular=function(evento,objeto,compara,callback){
	pos=this.lista_eventos[evento].indexOf(objeto);
	if(pos==-1) return;
	extras={};
	extras["observador"]=this;
	callback(this.lista_eventos[evento][pos].dispatch(compara),extras);
}

Manejador.prototype.baja=function(evento,objeto){
	if(this.lista_eventos[evento].indexOf(objeto)==-1) return;
	this.lista_eventos[evento].splice(this.lista_eventos[evento].indexOf(objeto),1);	
}
module.exports=Manejador;
},{}],5:[function(require,module,exports){
function ARWeb(configuracion){	
	this.detect=false;
	this.etapas=[];
	this.renderer=new THREE.WebGLRenderer();
  	this.renderer.autoClear = false;
  	this.WIDTH_CANVAS=configuracion["width"];
  	this.HEIGHT_CANVAS=configuracion["height"];
  	this.renderer.setSize(configuracion["width"],configuracion["height"]);  	
  	this.DetectorMarker=require("./detectormarker.js");
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
  	var Observador=require("./ManejadorEventos");
  	this.observador=new Observador();
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
}

ARWeb.prototype.anadirMarcador=function(marcador){
	this.detector_ar.addMarker(new this.DetectorMarker(marcador.id,marcador.callback,marcador.puntero));
	if(marcador.puntero!=undefined)
  		this.realidadEscena.anadir(marcador.puntero);
}

ARWeb.prototype.addStage=function(fn){
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
			this.detector_ar.detectMarker(this);	
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
	if(this.etapas.length>0)
		this.etapas[0].init.call(this,this.etapas[0]);
}


module.exports=ARWeb;
},{"./ManejadorEventos":4,"./detector":6,"./detectormarker.js":7,"./elemento":8,"./escenario.js":9,"./webcamstream.js":11}],6:[function(require,module,exports){
module.exports=function(canvas_element){
        var JSARRaster,JSARParameters,detector,result;
        var threshold=120;
        var markers={};
        function init(){
            JSARRaster = new NyARRgbRaster_Canvas2D(canvas_element);
            JSARParameters = new FLARParam(canvas_element.width, canvas_element.height);
            detector = new FLARMultiIdMarkerDetector(JSARParameters, 40);
            result = new Float32Array(16);
            detector.setContinueMode(true);
            JSARParameters.copyCameraMatrix(result, .1, 2000);        
            THREE.Object3D.prototype.transformFromArray = function(m) {
                this.matrix.setFromArray(m);
                this.matrixWorldNeedsUpdate = true;
            }
        }

        var setCameraMatrix=function(realidadCamera){        
            realidadCamera.projectionMatrix.setFromArray(result);
        }
       
        function getMarkerNumber(idx) {
        	var data = detector.getIdMarkerData(idx);
        	if (data.packetLength > 4) {
            	return -1;
        	} 
                    
        	var result=0;
        	for (var i = 0; i < data.packetLength; i++ ) {
            	result = (result << 8) | data.getPacketData(i);
        	}

        	return result;
        }

        function getTransformMatrix(idx) {
            var mat = new NyARTransMatResult();
            detector.getTransformMatrix(idx, mat);

            var cm = new Float32Array(16);
            cm[0] = mat.m00*-1;
            cm[1] = -mat.m10;
            cm[2] = mat.m20;
            cm[3] = 0;
            cm[4] = mat.m01*-1;
            cm[5] = -mat.m11;
            cm[6] = mat.m21;
            cm[7] = 0;
            cm[8] = -mat.m02;
            cm[9] = mat.m12;
            cm[10] = -mat.m22;
            cm[11] = 0;
            cm[12] = mat.m03*-1;
            cm[13] = -mat.m13;
            cm[14] = mat.m23;
            cm[15] = 1;

            return cm;
        }

        function obtenerMarcador(markerCount){
            var matriz_encontrada
            for(var i=0;i<markerCount;i++){
                matriz_encontrada=getTransformMatrix(i);
            }   
            return matriz_encontrada;
        }    

        var detectMarker=function(armarker){
            var markerCount = detector.detectMarkerLite(JSARRaster, threshold); 
            if(markerCount>0){ 
                for(var i=0,marcador_id=-1;i<markerCount;i++){
                    marcador_id=getMarkerNumber(i);
                    if(markers[marcador_id]!=undefined){
                        if(markers[marcador_id].puntero!=undefined){
                            markers[marcador_id].puntero.transformFromArray(obtenerMarcador(markerCount));
                            markers[marcador_id].puntero.matrixWorldNeedsUpdate=true;
                        }
                        markers[marcador_id].detected().call(armarker,marcador_id);
                    }
                }
                return true;            
            }
            return false;
        }

        var addMarker=function(marker){
            markers[marker.id]=marker;
        }

        var cambiarThreshold=function (threshold_nuevo){
            threshold=threshold_nuevo;
        }
        return{
            init:init,
            setCameraMatrix,setCameraMatrix,
            detectMarker:detectMarker,
            addMarker:addMarker,
            cambiarThreshold:cambiarThreshold
        }
}
},{}],7:[function(require,module,exports){
function DetectorMarker(id,callback,puntero){
	this.id=id;
	this.callback=callback;
	this.puntero=puntero;
}

DetectorMarker.prototype.detected = function() {
	return this.callback;
};

module.exports=DetectorMarker;
},{}],8:[function(require,module,exports){
var Animacion=require('../libs/animacion.js');
function Elemento(width_canvas,height_canvas,geometry){
    this.width=width_canvas;
    this.height=height_canvas;
    this.geometry=geometry,this.origen=new THREE.Vector2(),this.cont=0,this.estado=true,this.escalas=new THREE.Vector3(),this.posiciones=new THREE.Vector3();   
    this.animacion=new Animacion();
}


    
Elemento.prototype.cambiarUmbral=function(escala){     
    this.umbral_colision=this.width/4;
}            
Elemento.prototype.init=function(){
    this.elemento_raiz=new THREE.Object3D();
    this.geometria_atras=this.geometry.clone();
    this.textureLoader = new THREE.TextureLoader();
    this.cambiarUmbral(1);    
}


Elemento.prototype.etiqueta=function(etiqueta){
    this.nombre=etiqueta
}

Elemento.prototype.dimensiones=function(){
    return " "+width+" "+height;        
}

Elemento.prototype.calculoOrigen=function(){
    this.x=(this.posiciones.x+(this.width/2));
    this.y=(this.posiciones.y+(this.height/2));
    this.z=this.posiciones.z;
}

Elemento.prototype.cambiarVisible=function(){
    this.elemento_raiz.visible=this.elemento_raiz.visible ? false : true;
}

/*
        Elemento.prototype.calculoAncho=function(height_test){
            vFOV = Math.PI/4;
            height = 2 * Math.tan( Math.PI/8 ) * Math.abs(elemento_raiz.position.z-camera.position.z);
            fraction = height_test / height;
        }*/

        

Elemento.prototype.definirBackground=function(color){
    color_t=new THREE.Color(color);
    this.material_frente=new THREE.MeshBasicMaterial({color: color_t,side: THREE.DoubleSide}); 
    this.mesh=new THREE.Mesh(this.geometry,this.material_frente);
    this.elemento_raiz.add(this.mesh);  
}

Elemento.prototype.definir=function(ruta,objeto){
    parent=this;
    this.textureLoader.load( ruta, function(texture) {
            //texture = THREE.ImageUtils.loadTexture(ruta, undefined, function() {

                // the rest of your code here...
        objeto.actualizarMaterialFrente(texture);

    });
}


Elemento.prototype.actualizarMaterialAtras=function(texture2){
    this.textura_atras = texture2.clone();
    this.textura_atras.minFilter = THREE.LinearFilter;
    this.textura_atras.magFilter = THREE.LinearFilter;
    this.material_atras=new THREE.MeshBasicMaterial({map:this.textura_atras});  
    this.material_atras.transparent=true;

    this.geometria_atras.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI ) );
    this.mesh2=new THREE.Mesh(this.geometria_atras,this.material_atras);
    this.elemento_raiz.add(this.mesh2);  
    this.textura_atras.needsUpdate = true;
}

Elemento.prototype.actualizarMaterialFrente=function(texture1){
    this.textura_frente = texture1.clone();
    this.textura_frente.minFilter = THREE.LinearFilter;
    this.textura_frente.magFilter = THREE.LinearFilter;
    this.material_frente=new THREE.MeshBasicMaterial({map:this.textura_frente,side: THREE.DoubleSide});  
    this.material_frente.transparent=true;
    this.mesh=new THREE.Mesh(this.geometry,this.material_frente);
    this.elemento_raiz.add(this.mesh);  
    this.textura_frente.needsUpdate = true;
}

Elemento.prototype.definirCaras=function(frontal,trasera,objeto){ 
    parent=this;
    console.dir(this.textureLoader); 
    this.textureLoader.load( frontal, function(texture1) {
        objeto.actualizarMaterialFrente(texture1);
        parent.textureLoader.load(trasera, function(texture2) {                    
            objeto.actualizarMaterialAtras(texture2);                                       
        });  
    });
            
}

Elemento.prototype.getTexturaAtras=function(){
    return this.textura_atras;
}

Elemento.prototype.getTexturaFrente=function(){
    return this.textura_frente;
}

Elemento.prototype.getMaterialAtras=function(){
    return this.material_atras;
}

Elemento.prototype.getMaterialFrente=function(){
    return material_frente;
}

Elemento.prototype.getDimensiones=function(){
    return {width:width,height:height,position:posiciones,geometry:elemento_raiz.geometry};
}

Elemento.prototype.get=function(){
    return this.elemento_raiz;
}

Elemento.prototype.actualizarMedidas=function(){
    this.width=this.width*this.elemento_raiz.scale.x;
    this.height=this.height*this.elemento_raiz.scale.y;
    this.cambiarUmbral(1);
}

Elemento.prototype.scale=function(x,y){
    this.elemento_raiz.scale.x=x;
    this.elemento_raiz.scale.y=y;        
    this.actualizarMedidas();
}

Elemento.prototype.position=function(pos){
    for(var prop in pos){
        this.elemento_raiz.position[prop]=pos[prop]
    }
    this.x=pos.x;
    this.y=pos.y;
    this.posiciones=this.elemento_raiz.position;
}


Elemento.prototype.visible=function(){
    this.elemento_raiz.visible=true;
}


Elemento.prototype.actualizar=function(){
    for(var i=0;i<this.elemento_raiz.children.length;i++){
        if(this.elemento_raiz.children[i].material.map)
            this.elemento_raiz.children[i].material.map.needsUpdate=true;
    }
    if(this.x!=this.elemento_raiz.position.x ||this.y!=this.elemento_raiz.position.y){           
        this.x=this.elemento_raiz.position.x;
        this.y=this.elemento_raiz.position.y;
        this.posiciones.x=this.elemento_raiz.position.x;
        this.posiciones.y=this.elemento_raiz.position.y;
        this.posiciones.z=this.elemento_raiz.position.z;
        this.calculoOrigen();
    }
}

       

Elemento.prototype.dispatch=function(mano){   
    box_mano=new THREE.Box3().setFromObject(mano);
    box_carta=new THREE.Box3().setFromObject(this.get());
    //medidas=box_mano.center().clone();//box_mano.center().clone();
    //medidas.z=(medidas.z*-1);
    //distancia=box_carta.center().distanceTo(medidas);      
    pos1=box_mano.center().clone();
    pos1.z=0;
    pos2=box_carta.center().clone();
    pos2.z=0;
    distancia=Math.sqrt(Math.pow((pos1.x-pos2.x),2)+Math.pow((pos1.y-pos2.y),2));
    return distancia>0 && distancia<=43;//return medidas1.distanceTo(medidas2); 

}

Elemento.prototype.colisiona=function(mano){   
    box_mano=new THREE.Box3().setFromObject(mano);
    box_carta=new THREE.Box3().setFromObject(this.get());
    //medidas=box_mano.center().clone();//box_mano.center().clone();
    //medidas.z=(medidas.z*-1);
    //distancia=box_carta.center().distanceTo(medidas);      
    pos1=box_mano.center().clone();
    pos1.z=0;
    pos2=box_carta.center().clone();
    pos2.z=0;
    distancia=Math.sqrt(Math.pow((pos1.x-pos2.x),2)+Math.pow((pos1.y-pos2.y),2));
    return distancia>0 && distancia<=43;//return medidas1.distanceTo(medidas2); 

}

Elemento.prototype.getEtiqueta=function(){
    console.log(this.nombre);
}

Elemento.prototype.getGradosActual=function(){
    return this.cont;
}

Elemento.prototype.rotarY=function(grados){
    this.elemento_raiz.rotation.y=grados;
}

Elemento.prototype.incrementGrados=function(){
    this.cont++;
}

Elemento.prototype.decrementGrados=function(){
    this.cont--;
}

Elemento.prototype.easein=function(){
    this.animacion.easein.mostrar(this.get(),-800,-2500,this.animacion);
}

Elemento.prototype.voltear=function(){
    this.estado=(this.estado) ? false : true;
    if(this.estado){
        this.animacion.ocultar(this,this.animacion);//this.ocultar(this);
    }else{
        this.animacion.mostrar(this,this.animacion,180);
    }
}


Elemento.prototype.getNombre=function(){
    return this.nombre;
}

Elemento.prototype.esParDe=function(objeto){      
    return this.getNombre()==objeto.getNombre() && this.elemento_raiz.id!=objeto.get().id;
}

Elemento.prototype.igualA=function(objeto){
    return this.elemento_raiz.id==objeto.get().id;
}

Elemento.prototype.getOrigen=function(){
    return origen;
}

Elemento.prototype.getUmbral=function(){
    return this.umbral_colision;
}



Elemento.prototype.actualizarPosicionesYescala=function(posicion,escala){

    this.posiciones.x=posicion.x;
    this.posiciones.y=posicion.y;
    this.posiciones.z=posicion.z;
    this.escalas.x=escala.x;
    this.escalas.y=escala.y;
    this.escalas.z=escala.z;
    this.elemento_raiz.position=posicion;
    this.elemento_raiz.scale=escala;
    this.calculoOrigen();
}
module.exports=Elemento;
},{"../libs/animacion.js":12}],9:[function(require,module,exports){
function Escenario(){
	this.escena=new THREE.Scene();		
}

Escenario.prototype.initCamara=function(fn){
	if(fn==undefined){
		this.camara=new THREE.Camera();
	}else
		fn.call(this);
}


Escenario.prototype.anadir=function(elemento){
	this.escena.add(elemento);
}

Escenario.prototype.getCamara=function(){
	return this.camara;
}

Escenario.prototype.update=function(scene){
	this.renderer.render(scene.escena,scene.camara);
	this.renderer.clearDepth();
}

Escenario.prototype.limpiar=function(){
	while(this.escena.children.length>0)
		this.escena.remove(this.escena.children[0]);
}
module.exports=Escenario;
},{}],10:[function(require,module,exports){
module.exports=function(width,height){
	//var Labels=function(){
		var canvas,context,material,textura,sprite,x_origen,y_origen;
		function init(){
			canvas=document.createElement("canvas");
			canvas.width=width;
			canvas.height=height;
			context=canvas.getContext("2d");
		}
		var definir=function(parametros){
			context.fillStyle=parametros.color;
			context.textAlign=parametros.alineacion;
			context.font=parametros.tipografia;	
			x_origen=parametros.x;
			y_origen=parametros.y;
		}

		var crear=function(texto){
			context.fillText(texto,x_origen,y_origen);
			textura = new THREE.Texture(canvas);
			textura.minFilter = THREE.LinearFilter;
			textura.magFilter = THREE.LinearFilter;
		    textura.needsUpdate = true;

		    var material = new THREE.SpriteMaterial({
		        map: textura,
		        transparent: false,
		        useScreenCoordinates: false,
		        color: 0xffffff // CHANGED
		    });

		    sprite = new THREE.Sprite(material);
		    sprite.scale.set(15,15, 1 ); // CHANGED
		    return sprite;
		}

		var actualizar=function(texto){		
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.fillText(texto,x_origen,y_origen);
			textura.needsUpdate=true;
		}
		return{
			init:init,
			definir:definir,
			crear:crear,
			actualizar:actualizar
		}

	//}
}
},{}],11:[function(require,module,exports){
function WebcamStream(configuracion){
  this.canvas=document.createElement("canvas");
  this.canvas.width=configuracion["WIDTH"];
  this.canvas.height=configuracion["HEIGHT"];
  this.ctx=this.canvas.getContext("2d");
  this.video=new THREEx.WebcamTexture(configuracion["WIDTH"],configuracion["HEIGHT"]);
  var textura=new THREE.Texture(this.canvas);
  textura.minFilter = THREE.LinearFilter;
  textura.magFilter = THREE.LinearFilter;
  var material = new THREE.MeshBasicMaterial( { map: textura, depthTest: false, depthWrite: false} );//new THREE.MeshBasicMaterial( { map: textura, overdraw: true, side:THREE.DoubleSide } );     
  var geometria = new THREE.PlaneGeometry(2,2,0.0);
  this.elemento = new THREE.Mesh( geometria, material );
  this.elemento.scale.x=-1;
  this.elemento.material.side = THREE.DoubleSide;  
}

WebcamStream.prototype.getElemento=function(){
	return this.elemento;
}

WebcamStream.prototype.update=function(web){
	this.ctx.drawImage(this.video.video,0,0,this.canvas.width,this.canvas.height);
    this.canvas.changed=true;        
    this.elemento.material.map.needsUpdate=true;
}

WebcamStream.prototype.getCanvas=function(){
	return this.canvas;
}

module.exports=WebcamStream;
},{}],12:[function(require,module,exports){
function Animacion(){	
}

Animacion.prototype.easein={
	mostrado:false,
	mostrar:function(objeto,limit_z,limit_z_fuera,animation){		
		window.requestAnimationFrame(function(){
        	animation.easein.mostrar(objeto,limit_z,limit_z_fuera,animation);
        });
		if(objeto.position.z<=limit_z){
			objeto.position.z+=100
			animation.easein.mostrado=true; 		 
		}else if(animation.easein.mostrado){
			limit_z_ocultar=limit_z_fuera;
			setTimeout(function(){
				animation.easein.ocultar(objeto,limit_z,limit_z_ocultar,animation);				
				animation.easein.mostrado=false;
			},3000)
		}
	},
	ocultar:function(objeto,limit_z,limit_z_oculta,animation){
		if(objeto.position.z>limit_z_ocultar){
			objeto.position.z-=100;	
			window.requestAnimationFrame(function(){	        	
				animation.easein.ocultar(objeto,limit_z,limit_z_ocultar,animation);	
	        });
		}else
			animation.easein.mostrado=false;
	}
}

Animacion.prototype.mostrar=function(objeto,animation,grados){
	if(objeto.getGradosActual()<=grados){
        window.requestAnimationFrame(function(){
        	animation.mostrar(objeto,animation,grados);
        });    
        objeto.rotarY(THREE.Math.degToRad(objeto.getGradosActual()));
        objeto.incrementGrados();
    }
}

Animacion.prototype.ocultar=function(objeto,animation){
	 if(objeto.getGradosActual()>=0){
        window.requestAnimationFrame(function(){
            animation.ocultar(objeto,animation);
        }); 
        objeto.rotarY(THREE.Math.degToRad( objeto.getGradosActual()));
        objeto.decrementGrados();
    }
}
module.exports=Animacion;


},{}],13:[function(require,module,exports){
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
		console.log("Desbloqueado en alerta");
		parent.juego.desbloquear();
	},datos.tiempo);
}
module.exports=Mensajes;
},{}],14:[function(require,module,exports){
function Memorama(){
  this.bloqueado=false;  
}

Memorama.prototype.bloquear=function(){
  this.bloqueado=false;
}

Memorama.prototype.desbloquear=function(){
  this.bloqueado=true;
}

Memorama.prototype.config=function(configuracion){
}


Memorama.prototype.init=function(stage){ 
  // IMPORTO LAS CLASES Detector,Labels,DetectorAR,Elemento  

  stage.tipo_memorama="animales";
  stage.cantidad_cartas=4;
  mensaje="Bienvenido al ejercicio Memorama<br>";

  //var Mensajes=require("./libs/mensajes");
  //mensajes=new this.Mensajes(this);
  descripcion="El objetivo de este ejercicio, es tocar los pares de cada carta.<br>No te preocupes si no logras en el primer intento, puedes seguir jugando hasta seleccionar cada uno de los pares<br><br>";
  document.getElementById("informacion_nivel").innerHTML=mensaje+descripcion;
  avances=document.createElement("id");
  avances.id="avances_memorama";
  document.getElementById("informacion_nivel").appendChild(avances);
  var Labels=require("./class/labels"); 
  stage.detectados=[];

   // CREACION DEL ELEMENTO ACIERTO (LA IMAGEN DE LA ESTRELLA)
  stage.indicador_acierto=new this.Elemento(500,500,new THREE.PlaneGeometry(500,500));
  stage.indicador_acierto.init();
  stage.indicador_acierto.definir("./assets/img/scale/star.png",stage.indicador_acierto);
  stage.indicador_acierto.position({x:0,y:0,z:-2500});
  this.anadir(stage.indicador_acierto.get());

  // CREACION DEL ELEMENTO ERROR (LA IMAGEN DE LA X)
  stage.indicador_error=new this.Elemento(500,500,new THREE.PlaneGeometry(500,500));
  stage.indicador_error.init();
  stage.indicador_error.definir("./assets/img/scale/error.png",stage.indicador_error);
  stage.indicador_error.position({x:0,y:0,z:-2500});
  this.anadir(stage.indicador_error.get());

///*
  // CREACION DE LAS CARTAS COMO ELEMENTOS
  console.log("veamos la cantidad de cartas "+stage.cantidad_cartas);
 var cartas={animales:["medusa","ballena","cangrejo","pato"],cocina:["pinzas","refractorio","sarten","rallador"]};  
  stage.objetos=[]     
  limite_renglon=Math.floor(stage.cantidad_cartas/2)+1;
  for(var i=1,cont_fila=1,pos_y=-100,fila_pos=i,pos_x=-200;i<=stage.cantidad_cartas;i++,pos_y=((i%2!=0) ? pos_y+130 : pos_y) ,fila_pos=((fila_pos>=limite_renglon-1) ? 1 : fila_pos+1),pos_x=(i%2==0 ? 200 : -200)){         
    var elemento=new this.Elemento(120,120,new THREE.PlaneGeometry(120,120));
    elemento.init();
    elemento.etiqueta(cartas[stage.tipo_memorama][fila_pos-1]);
    elemento.scale(.7,.7);
    elemento.position({x:pos_x,y:pos_y,z:-600});  
    stage.objetos.push(elemento);
    this.anadir(elemento.get());
    stage.objetos[stage.objetos.length-1].definirCaras("./assets/img/memorama/sin_voltear.jpg","./assets/img/memorama/"+stage.tipo_memorama+"/cart"+fila_pos+"_"+cartas[stage.tipo_memorama][fila_pos-1]+".jpg",
      stage.objetos[stage.objetos.length-1]); 
    capa_elemento=document.createElement("div");
    this.observador.suscribir("colision",stage.objetos[stage.objetos.length-1]);
  }
//*/


  //CREACION DE KATHIA
  document.getElementById("kathia").appendChild(kathia_renderer.view);

  //CREACION DE LA ETIQUETA DONDE SE ESCRIBE LA RESPUESTA DE KATHIA
  texto=Labels(250,250);
  texto.init();
  texto.definir({
    color:'#ff0000',
    alineacion:'center',
    tiporafia:'200px Arial',
    x:250/2,
    y:250/2
  });
  stage.label=texto.crear("HELLO WORLD");
  //this.anadir(stage.label);

  //stage.label.position.set(-1.5,-6.6,-20);
   
  iniciarKathia(texto);
}

Memorama.prototype.loop=function(stage){
  for(var i=0;i<stage.objetos.length;i++)
    stage.objetos[i].actualizar();          
  stage.label.material.map.needsUpdate=true;     
  if(!pausado_kathia)
    animate();  
}
Memorama.prototype.logicaMemorama=function(esColisionado,objeto_actual,extras){ 
    if(esColisionado){
      if(extras["detectados"].length==1 && extras["detectados"][0].igualA(objeto_actual)){

      }else if(extras["detectados"].length==1 && extras["detectados"][0].esParDe(objeto_actual)){        
          clasificarOpcion("acierto");
          extras["stage"].indicador_acierto.easein();         
          objeto_actual.voltear();  
          extras["manejador"].baja("colision",objeto_actual);
          extras["manejador"].baja("colision",extras["detectados"][0]);
          document.getElementById("avances_memorama").innerHTML="Excelente, haz encontrado el par de la carta x";
          extras["detectados"]=[];  
      }else if(extras["detectados"].length==0){     
          objeto_actual.voltear();
          extras["detectados"].push(objeto_actual);
      }else if(extras["detectados"][0].get().id!=objeto_actual.get().id){     
          clasificarOpcion("fallo");
          //mensajes.alerta({texto:"Bloqueando por problemas de fallo",tiempo:3000});
           extras["stage"].indicador_error.easein();
          document.getElementById("avances_memorama").innerHTML="Al parecer te haz equivocado de par, no te preocupes, puedes seguir intentando con el par de x";
          extras["detectados"][0].voltear();
          extras["detectados"].pop();
      }
      detectados=extras["detectados"];
    }
    //*/
}

Memorama.prototype.fnAfter=function(stage){  
    if(this.objeto.getWorldPosition().z>300 && this.objeto.getWorldPosition().z<=500){  
      this.mano_obj.actualizarPosicionesYescala(this.objeto.getWorldPosition(),this.objeto.getWorldScale()); 
      this.observador.disparar("colision",this.objeto,stage.logicaMemorama,{detectados:stage.detectados,stage:stage,manejador:this.observador});   
    }
  }

module.exports=Memorama;
},{"./class/labels":10}],15:[function(require,module,exports){
function ColorStage(){
	this.colors;
	this.codesColors=[];
	this.countingColors=false;
}
ColorStage.prototype.RGBtoHSV=function(r,g,b){
	var r=r/255;
	var g=g/255;
	var b=b/255;
	max=Math.max(r,g,b);
	min=Math.min(r,g,b);
	delta=max-min;
	v=max;
	var h=0;
	if(max==r){
		mod=((g-b)/delta) % 6;
		h=60*mod;
	}else if(max==g){
		mod=((b-r)/delta) +2;
		h=60*mod;
	}else if(max==b){
		mod=((r-g)/delta) +4;
		h=60*mod;
	}
	s=(max==0) ? 0 : (delta/max);
	return {h:h,s:s,v:v}
}

ColorStage.prototype.registerColor=function(stage){
	stage.countingColors=stage.countingColors ? false : true;
}

ColorStage.prototype.checkColors=function(stage){
	stage.codesColors.forEach(function(elem){
		console.dir(elem);
	})
}

ColorStage.prototype.fnAfter=function(stage){

}


ColorStage.prototype.loop=function(stage){
	stage.elemento.actualizar();
}

ColorStage.prototype.init=function(stage){
	stage.elemento=new this.Elemento(60,60,new THREE.PlaneGeometry(60,60));
	stage.elemento.init();
	stage.elemento.definirBackground("rgb(255, 0, 0)");
	stage.elemento.position(0,0,-400);
	stage.elemento.cambiarVisible();
	this.anadir(stage.elemento.get());
      tracking.ColorTracker.registerColor('green', function(r, g, b) {
        colors=stage.RGBtoHSV(r,g,b);           
        //Range of color green
        if ((colors["h"]<=140 && colors["h"]>=78) && (colors["s"]<=.97 && colors["s"]>=.40) &&(colors["v"]<=1 && colors["v"]>=.30)) {        
          return true;
        }
        return false;
      });
      var tracker = new tracking.ColorTracker(["green"]);
      tracking.track(this.canvas_video, tracker, { camera: true,context:this.canvas_video.getContext("2d") });
      tracker.on('track', function(event) {
      	//Data attribute have the two colors detected
        event.data.forEach(function(rect) {
          if (rect.color === 'custom') {
            rect.color = tracker.customColor;
          }
          //Call the registerColors and then checkColors for all the colors detected
          if(stage.countingColors){
          	stage.codesColors.push(event);
          	if(stage.codesColors.length==10)
          		stage.registerColor();
          }
          stage.elemento.position((rect.x- (this.canvas_video.width / 2)),((this.canvas_video.height / 2) - rect.y),-400);
          stage.elemento.visible();
        });
      });
}
module.exports=ColorStage;
},{}]},{},[1,2,3,8,6,10,15,9,11,7]);
