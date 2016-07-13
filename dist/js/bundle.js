(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//DEBUG=true;
Calibrar=require("./stages/calibracion.js");
Tienda=require("./stages/tienda.js");
calibracion=new Calibrar();
//memorama=new Memorama();
//basketball=new Basketball();
tienda=new Tienda();
//ColorStage=require("../src/trackingcolor.js");
//var tracking=new ColorStage();
ARWeb=require("../src/class/arweb.js");
arweb=new ARWeb({"width":1000,"height":800,"elemento":"ra"});
arweb.init();
//arweb.addStage(tracking);
//arweb.addStage(calibracion);
arweb.addStage(tienda);
//arweb.addStage(memorama);
//arweb.addStage(basketball);
arweb.run();
},{"../src/class/arweb.js":9,"./stages/calibracion.js":3,"./stages/tienda.js":6}],2:[function(require,module,exports){
function Basketball(){

}

Basketball.prototype.init = function(stage) {	
	stage.puntero=new this.Elemento(61,60,new THREE.PlaneGeometry(61,60));
	stage.puntero.init();
	stage.puntero.definir("./assets/img/basket/balon.png",stage.puntero);	
	stage.puntero.get().position.z=-1;
	stage.puntero.get().matrixAutoUpdate = false;
  	stage.puntero.get().visible=false;
	stage.canasta=new this.Elemento(80,80,new THREE.PlaneGeometry(80,80));	
	stage.canasta.init();
	stage.canasta.definir("./assets/img/basket/canasta.png",stage.canasta);
	stage.canasta.position({x:160,y:-90,z:-600});
	stage.canasta.get().visible=false;
	stage.hombro=new this.Elemento(80,80,new THREE.PlaneGeometry(80,80));	
	stage.hombro.init();
	stage.hombro.definir("./assets/img/basket/canasta.png",stage.hombro);		
	stage.hombro.position({x:0,y:0,z:0});
	stage.hombro.get().matrixAutoUpdate = false;
  	stage.hombro.get().visible=false;
	stage.total_canastas=10;
	stage.canastas=0;
	stage.bajar=false;
	stage.altura_concluida=false;
	stage.posicion_canasta_anterior=undefined;
    this.observador.suscribir("colision",stage.canasta);
	this.anadir(stage.canasta.get());
	this.allowDetect(true);	
	this.anadirMarcador({id:16,callback:stage.fnAfter,puntero:stage.puntero.get()});
	this.anadirMarcador({id:2,callback:function(){},puntero:stage.hombro.get()});
};

Basketball.prototype.ayuda=function(){
	document.getElementById("informacion_nivel").innerHTML="<p>Deseas reducir la altura de la canasta</p><p><button id='bajar_nivel'>Bajar nivel</button></p>";
	document.getElementById("bajar_nivel").addEventListener("click",function(){
		if(this.posicion_canasta_anterior!=undefined){
			console.log("La posicion de la canasta actual "+this.canasta.get().position.y+" la posicion anterior de la canasta "+this.posicion_canasta_anterior.y);
			var new_y=this.posicion_canasta_anterior.y-((this.canasta.get().position.y+(Math.abs(this.posicion_canasta_anterior.y)))/2)
			console.log("wow este es el nuevo posicion en "+new_y);
			this.canasta.position({y:new_y});
		}else{
			console.log("Necesitas primero hacer que la canasta se eleve");
		}			
	}.bind(this));
}



Basketball.prototype.fnAfter = function(puntero) {
	puntero.visible=true;
	if(puntero.getWorldPosition().z>300 && puntero.getWorldPosition().z<=500)
		this.logica.call(this,puntero);
/*	Checking the distance between the shoulder and hand
	if(this.hombro!=undefined)
		console.log("Distance between the shoulder and hand "+this.hombro.getDistancia(puntero));	*/	
	
};

Basketball.prototype.logicaBasket=function(puntero){
	this.canastas+=1;
	if(this.canastas<=this.total_canastas){
		console.log("Enceste");
		this.bajar=true;
	}else{
		console.log("Has encestado el total de canastas");	 	
		this.altura_concluida=true;
	}
}

Basketball.prototype.logica=function(puntero){	
	if(!this.altura_concluida)
	   this.observador.dispararParticular("colision",this.canasta,puntero,function(esColision,extras){
	   	if(esColision && !this.bajar)
	   		this.logicaBasket(puntero);
	   	else if(this.bajar)
			if(this.canasta.getDistancia(puntero)>=60 && this.canasta.get().position.y<puntero.position.y){
				console.log("Bien, ahora vuelve a subir")
				this.bajar=false;	
			}		   	
	   }.bind(this));
	else{
		this.posicion_canasta_anterior=this.canasta.get().position.clone();
		this.canasta.incrementar({y:30});
		this.altura_concluida=false;
		this.canastas=0;
		console.log("ALTURA CONCLUIDA");	
	}
}

Basketball.prototype.loop = function(stage) {
	stage.puntero.actualizar();
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
  stage.puntero=new THREE.Object3D();
  stage.puntero.add(mano_obj.get());
  stage.puntero.position.z=-1;
  stage.puntero.matrixAutoUpdate = false;
  stage.puntero.visible=false;
  this.anadirMarcador({id:16,callback:stage.fnAfter,puntero:stage.puntero});
  //this.anadirMarcador({id:1,callback:stage.ayuda,puntero:stage.puntero});
  //this.anadirMarcador({id:2,callback:stage.config,puntero:stage.puntero});
}



Calibrar.prototype.loop=function(stage){    
    if(calibrar){
      threshold_total=0;
      threshold_conteo=0;
      for(var i=0;i<300;i++){
        this.detector_ar.cambiarThreshold(i);
        if(this.detector_ar.detectMarker(stage)){
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

Calibrar.prototype.fnAfter=function(puntero){  
    if(puntero.getWorldPosition().z>300 && puntero.getWorldPosition().z<=500){             
      puntero.visible=true;
      this.observador.dispararParticular("colision",this.objetos[this.pos_elegido],puntero,function(esColision,extras){
        if(esColision){      
          extras["observador"].baja("colision",this.objetos[this.pos_elegido]);  
          this.pos_elegido++;
          document.getElementById("colorSelect").style.backgroundColor=this.colores[this.pos_elegido];
          if(this.pos_elegido==this.cantidad_cartas)
            this.puntos_encontrados=true;
        }
      }.bind(this));//*/
    }
  }


module.exports=Calibrar;
},{}],4:[function(require,module,exports){

function Memorama(){
  this.bloqueado=false;  
  var Animacion=require('../../src/libs/animacion.js');
  this.animacion=new Animacion();
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
  var Labels=require("../../src/class/labels"); 
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

  
  var mano_obj=new this.Elemento(60,60,new THREE.PlaneGeometry(60,60));
  mano_obj.init();
  mano_obj.etiqueta("Detector");
  mano_obj.definir("../../assets/img/mano_escala.png",mano_obj);
  stage.puntero=new THREE.Object3D();
  stage.puntero.add(mano_obj.get());
  stage.puntero.position.z=-1;
  stage.puntero.matrixAutoUpdate = false;
  stage.puntero.visible=false;
  this.anadirMarcador({id:16,callback:stage.fnAfter,puntero:stage.puntero});
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
  clasificarOpcion("bienvenida");
  clasificarOpcion("instrucciones");
}

Memorama.prototype.loop=function(stage){
  for(var i=0;i<stage.objetos.length;i++)
    stage.objetos[i].actualizar();          
  stage.label.material.map.needsUpdate=true;     
  if(!pausado_kathia)
    animate();  
}
Memorama.prototype.logicaMemorama=function(esColisionado,objeto_actual){ 
    if(esColisionado){      
      if(this.detectados.length==1 && this.detectados[0].igualA(objeto_actual)){

      }else if(this.detectados.length==1 && this.detectados[0].esParDe(objeto_actual)){        
          clasificarOpcion("acierto");
          this.indicador_acierto.easein(this.animacion);         
          objeto_actual.voltear(this.animacion);  
          this.observador.baja("colision",objeto_actual);
          this.observador.baja("colision",this.detectados[0]);
          document.getElementById("avances_memorama").innerHTML="Excelente, haz encontrado el par de la carta x";
          this.detectados=[];  
      }else if(this.detectados.length==0){  
          objeto_actual.voltear(this.animacion);
          this.detectados.push(objeto_actual);
      }else if(this.detectados[0].get().id!=objeto_actual.get().id){     
          clasificarOpcion("fallo");
          this.indicador_error.easein(this.animacion);
          document.getElementById("avances_memorama").innerHTML="Al parecer te haz equivocado de par, no te preocupes, puedes seguir intentando con el par de x";
          this.detectados[0].voltear(this.animacion);
          this.detectados.pop();
      }
    }
    //*/
}

Memorama.prototype.fnAfter=function(puntero){  
    if(puntero.getWorldPosition().z>300 && puntero.getWorldPosition().z<=500){
      puntero.visible=true;  
      this.observador.disparar("colision",puntero,this.logicaMemorama,{stage:this});   
    }
}

module.exports=Memorama;
},{"../../src/class/labels":14,"../../src/libs/animacion.js":16}],5:[function(require,module,exports){
function Sequence(){

}

Sequence.prototype.config=function(configuracion){
  this.cantidad_cartas=configuracion.cantidad_cartas || 6;
}


Sequence.prototype.init=function(){ 
  // IMPORTO LAS CLASES Detector,Labels,DetectorAR,Elemento
  var Labels=require("../../src/class/labels");
  var DetectorAR=require("../../src/class/detector");
  var Elemento=require("../../src/class/elemento");
  var pos_elegido=0;
  /*
    MODIFICO LA FUNCION setFromArray DE LA CLASE Matrix4
  */
  THREE.Matrix4.prototype.setFromArray = function(m) {
          return this.set(
            m[0], m[4], m[8], m[12],
            m[1], m[5], m[9], m[13],
            m[2], m[6], m[10], m[14],
            m[3], m[7], m[11], m[15]
          );
  }
  var videoScene=new THREE.Scene(),realidadScene=new THREE.Scene(),planoScene=new THREE.Scene();
  var WIDTH_CANVAS=1000,HEIGHT_CANVAS=800;
  var videoCamera=new THREE.Camera();
  var realidadCamera=new THREE.Camera();
  planoCamera=new THREE.PerspectiveCamera();//THREE.Camera(); 
  planoCamera.near=0.1;
  planoCamera.far=2000;
  planoCamera.updateProjectionMatrix();
  //webglAvailable();
  var renderer = new THREE.WebGLRenderer();
  //planoCamera.lookAt(planoScene.position);
  renderer.autoClear = false;
  renderer.setSize(WIDTH_CANVAS,HEIGHT_CANVAS);
  document.getElementById("ra").appendChild(renderer.domElement);



  canvas=document.createElement("canvas");
  canvas.width=WIDTH_CANVAS;
  canvas.height=HEIGHT_CANVAS;
  var video=new THREEx.WebcamTexture(WIDTH_CANVAS,HEIGHT_CANVAS);
  videoTexture=new THREE.Texture(canvas);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, depthTest: false, depthWrite: false} );//new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );			
  var movieGeometry = new THREE.PlaneGeometry(2,2,0.0);
  movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
  movieScreen.scale.x=-1;
  movieScreen.material.side = THREE.DoubleSide;
  videoScene.add(movieScreen);	

  objetos=[];  
  var colores=["rgb(34, 208, 6)","rgb(25, 11, 228)","rgb(244, 6, 6)","rgb(244, 232, 6)"];
  tamano_elemento=120;
  limite_renglon=Math.floor(this.cantidad_cartas/2)+1;
  margenes_espacio=(WIDTH_CANVAS-(tamano_elemento*limite_renglon))/limite_renglon;
  for(var i=1,cont_fila=1,pos_y=-100,fila_pos=i,pos_x=-200;i<=this.cantidad_cartas;i++,pos_y=((fila_pos>=limite_renglon-1) ? pos_y+120+50 : pos_y) ,fila_pos=((fila_pos>=limite_renglon-1) ? 1 : fila_pos+1),pos_x=(fila_pos==1 ? -200 : (pos_x+margenes_espacio+tamano_elemento))){     
    var elemento=new Elemento(tamano_elemento,tamano_elemento,new THREE.PlaneGeometry(tamano_elemento,tamano_elemento));
    elemento.init();
    elemento.etiqueta(colores[i-1]);
    elemento.position(new THREE.Vector3(pos_x,pos_y,-600));  
    elemento.calculoOrigen();
    objetos.push(elemento);
    elemento.definirBackground(colores[i-1]);
    planoScene.add(elemento.get());
  }

  function aleatorio(){    
    return Math.floor(Math.random() * ((objetos.length-1) - 0 + 1)) + 0;
  }

  pos_elegido=aleatorio();
  document.getElementById("colorSelect").style.backgroundColor=colores[pos_elegido];
  mano_obj=new Elemento(30,30,new THREE.PlaneGeometry(30,30));
  mano_obj.init();
  mano_obj.etiqueta("Detector");
  //mano_obj.definirBackground("0xffffff");  
  mano_obj.definir("./assets/img/mano_escala.png",mano_obj);
  objeto=new THREE.Object3D();
  objeto.add(mano_obj.get());
  objeto.position.z=-1;
  objeto.matrixAutoUpdate = false;
  realidadScene.add(objeto);

  ctx=canvas.getContext("2d");
  detector_ar=DetectorAR(canvas);
  detector_ar.init();
  detector_ar.setCameraMatrix(realidadCamera);


 

  /*
    FUNCION PARA RENDERIZADO DE LAS ESCENAS.

  */
  function rendering(){	
  	renderer.clear();
  	renderer.render( videoScene, videoCamera );
  	renderer.clearDepth();
    renderer.render( planoScene, planoCamera );
    renderer.clearDepth();
  	renderer.render( realidadScene, realidadCamera );
  }


  function mostrarPosicion(posicion,elemento){
    document.getElementById(elemento).getElementsByTagName("span")[0].innerHTML=posicion.x;
    document.getElementById(elemento).getElementsByTagName("span")[1].innerHTML=posicion.y;
    document.getElementById(elemento).getElementsByTagName("span")[2].innerHTML=posicion.z;
  }

  function distancia(distancia){
    document.getElementById("distancia_text").innerHTML=distancia;
  }

  function verificarColision(){    
    mano_obj.actualizarPosicionesYescala(objeto.getWorldPosition(),objeto.getWorldScale());    
    mostrarPosicion(objeto.getWorldPosition(),"mano");    
    mostrarPosicion(objetos[pos_elegido].get().position,"objetivo");
    if(objetos[pos_elegido].dispatch(objeto,distancia)){
      pos_elegido=aleatorio();
      document.getElementById("colorSelect").style.backgroundColor=colores[pos_elegido];
    }
  }

  /*
    FUNCION DE ANIMACION

  */
  function loop(){  	    
    movieScreen.material.map.needsUpdate=true;
    ctx.drawImage(video.video,0,0,WIDTH_CANVAS,HEIGHT_CANVAS);
    canvas.changed=true;
    if(detector_ar.markerToObject(objeto)){
      verificarColision();
    }
  	rendering();
  	requestAnimationFrame(loop);  	
  }

  loop();
}

module.exports=Sequence;
},{"../../src/class/detector":10,"../../src/class/elemento":12,"../../src/class/labels":14}],6:[function(require,module,exports){
function Tienda(){
	
}

Tienda.prototype.init=function(stage){
  stage.conteo_segundos=0;
  stage.conteo=undefined;
	stage.vaso=new this.Elemento(52,122,new THREE.PlaneGeometry(52,122));  
  stage.mensajes_texto=new this.Mensajes({game:stage,div:"container",type:"text"});
  //stage.mensajes_lateral=new this.Mensajes({game:stage,div:"container",type:"text"}).position({top:"150px"});  
  stage.mensaje_imagen=new this.Mensajes({game:stage,div:"container",type:"image"}).srcImage("../../assets/img/tienda/exito.png");
	stage.vaso.init();
  stage.vaso.etiqueta("Detector");
  stage.vaso.definir("../../assets/img/tienda/vaso.png",stage.vaso);
  stage.vaso.position({x:-150,y:-90,z:-620});

  stage.mesa=new this.Elemento(292,285,new THREE.PlaneGeometry(292,285));
  stage.mesa.init();
  stage.mesa.etiqueta("Detector");
  stage.mesa.definir("../../assets/img/tienda/mesa.png",stage.mesa);
  stage.mesa.position({x:160,y:-200,z:-610});

  stage.holder=new this.Elemento(30,30,new THREE.PlaneGeometry(30,30));
  stage.holder.init();
  stage.holder.etiqueta("Detector");
  stage.holder.definirBackground(0xff0000);
  stage.holder.position({x:160,y:-70,z:-600});
  stage.jarra=new this.Elemento(129,154,new THREE.PlaneGeometry(129,154));
  stage.jarra.init();
  stage.jarra.etiqueta("Jarra");
  stage.jarra.definir("../../assets/img/tienda/jarra.png",stage.jarra);
  stage.jarra.position({x:20,y:80,z:-600});
  stage.recoger=true;
  stage.puntero=new this.Elemento(61,60,new THREE.PlaneGeometry(61,60));
	stage.puntero.init();
	stage.puntero.definir("./assets/img/mano_escala.png",stage.puntero);	
	stage.puntero.get().position.z=-1;
	stage.puntero.get().matrixAutoUpdate = false;
  stage.puntero.get().visible=false;
  this.anadir(stage.vaso.get());
  this.anadir(stage.jarra.get());
  this.anadir(stage.holder.get());
  this.anadir(stage.mesa.get());
  this.anadirMarcador({id:16,callback:stage.fnAfter,puntero:stage.puntero.get()});
  this.allowDetect(true);
}

Tienda.prototype.loop=function(stage){

}


Tienda.prototype.actualizarJarra=function(puntero){
  var data=[puntero.getWorldPosition(),puntero.getWorldRotation(),puntero.getWorldQuaternion()];
  this.jarra.position({x:data[0].x,y:data[0].y});
  this.jarra.rotation({x:data[1].x,y:data[1].y,z:data[1].z});
  this.jarra.quaternion({x:data[2].x,y:data[2].y,z:data[2].z});
}

Tienda.prototype.logica=function(puntero){
  if(this.recoger)    
      this.actualizarJarra(puntero); 
  if(this.vaso.abajoDe(puntero,(this.jarra.width/2))){
    if(this.lleno)
      if(puntero.getWorldRotation().x<=0.47062448038075105  && puntero.getWorldRotation().z<=1.50){
        console.log("LLENANDO EL VASO")
        var that=this;
        setTimeout(function(){
          that.conteo_segundos++;
          console.log("comenzando "+that.conteo_segundos)
          if(that.conteo_segundos>=3){
            clearInterval(that.conteo);
            that.lleno=false;
            that.conteo_segundos=0;
            this.mensaje_imagen.position({left:""+(this.vaso.get().position.x+500)+"px",top:""+(400-this.vaso.get().position.y)+"px"}).mostrar();
            //this.mensaje_imagen.position({top:this.vaso.get().position.x+500,left:400-this.vaso.get().position.y}).mostrar();
            this.mensajes_texto.aviso("Esta vacia la jarra, debo llenarlo").mostrar();
            that.conteo=undefined;
          }
        }.bind(this),1000);        
      }else{
        if(this.conteo!=undefined){
          clearInterval(this.conteo); 
          console.log("no estoy en posicion");
        }       
      }
  }else if(this.holder.getDistancia(puntero)<=66.5){
    if(!this.lleno){
      this.actualizarJarra(this.holder.get());
      this.recoger=false;
      setTimeout(function(){
        this.recoger=true;
        this.lleno=true;     
        this.mensaje_imagen.position({left:""+(this.jarra.get().position.x+500)+"px",top:""+(400-this.jarra.get().position.y)+"px"}).mostrar();
        this.mensajes_texto.aviso("Esta llena la jarra, debo llenar el vaso").mostrar();
      }.bind(this),5000);
    }    
  }  
}

Tienda.prototype.fnAfter=function(puntero){
	puntero.visible=true;	
	if(puntero.getWorldPosition().z>300 && puntero.getWorldPosition().z<=500){    //this.logica.call(this,puntero);     
    this.logica(puntero);
  }
}

module.exports=Tienda;
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
function ARWeb(configuracion){	
	this.detect=false;
	this.etapas=[];
	this.renderer=new THREE.WebGLRenderer();
  	this.renderer.autoClear = false;
  	this.WIDTH_CANVAS=configuracion["width"];
  	this.HEIGHT_CANVAS=configuracion["height"];
  	this.renderer.setSize(configuracion["width"],configuracion["height"]);  	
  	this.DetectorMarker=require("./detectormarker.js");
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
	this.detector_ar.addMarker(new this.DetectorMarker(marcador.id,marcador.callback,marcador.puntero));
	if(marcador.puntero!=undefined)
  		this.realidadEscena.anadir(marcador.puntero);
}

ARWeb.prototype.addStage=function(fn){
	fn.observador=this.observador;
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
},{"../libs/mensajes.js":17,"../libs/position_utils.js":18,"./ManejadorEventos":8,"./detector":10,"./detectormarker.js":11,"./elemento":12,"./escenario.js":13,"./webcamstream.js":15}],10:[function(require,module,exports){
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

        var detectMarker=function(stage){
            var markerCount = detector.detectMarkerLite(JSARRaster, threshold); 
            if(markerCount>0){ 
                for(var i=0,marcador_id=-1;i<markerCount;i++){
                    marcador_id=getMarkerNumber(i);
                    if(markers[marcador_id]!=undefined){
                        if(markers[marcador_id].puntero!=undefined){
                            markers[marcador_id].puntero.transformFromArray(obtenerMarcador(markerCount));
                            markers[marcador_id].puntero.matrixWorldNeedsUpdate=true;
                        }
                        //console.log("encontro un marcador");
                        markers[marcador_id].detected().call(stage,markers[marcador_id].puntero);
                    }
                }
                return true;            
            }
            return false;
        }

        var addMarker=function(marker){
            markers[marker.id]=marker;
        }

        var cleanMarkers=function(){
            markers={};
        }

        var cambiarThreshold=function (threshold_nuevo){
            threshold=threshold_nuevo;
        }
        return{
            init:init,
            setCameraMatrix,setCameraMatrix,
            detectMarker:detectMarker,
            addMarker:addMarker,
            cambiarThreshold:cambiarThreshold,
            cleanMarkers:cleanMarkers
        }
}
},{}],11:[function(require,module,exports){
function DetectorMarker(id,callback,puntero){
	this.id=id;
	this.callback=callback;
	this.puntero=puntero;
}

DetectorMarker.prototype.detected = function() {
	return this.callback;
};

module.exports=DetectorMarker;
},{}],12:[function(require,module,exports){
function Elemento(width_canvas,height_canvas,geometry){
    this.width=width_canvas;
    this.height=height_canvas;
    this.geometry=geometry,this.origen=new THREE.Vector2(),this.cont=0,this.estado=true,this.escalas=new THREE.Vector3(),this.posiciones=new THREE.Vector3();       
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
    this.defineBox();
    this.box=new THREE.Box3().setFromObject(this.elemento_raiz);
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
    this.defineBox();
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
    this.defineBox();
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
    this.defineBox();
}

Elemento.prototype.rotation=function(pos){
    for(var prop in pos){
        this.elemento_raiz.rotation[prop]=pos[prop]
    }
}

Elemento.prototype.quaternion=function(pos){
    for(var prop in pos){
        this.elemento_raiz.rotation[prop]=pos[prop]
    }    
}
Elemento.prototype.incrementar=function(pos){
    for(var prop in pos){
        this.elemento_raiz.position[prop]+=pos[prop]
    }
    this.x=pos.x;
    this.y=pos.y;
    this.posiciones=this.elemento_raiz.position;
    this.defineBox();
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
    distancia=this.getDistancia(mano);
    return distancia>0 && distancia<=43;//return medidas1.distanceTo(medidas2); 

}

Elemento.prototype.defineBox=function(){    
    this.box=new THREE.Box3().setFromObject(this.elemento_raiz);
}

Elemento.prototype.getDistancia=function(mano){
    box_mano=new THREE.Box3().setFromObject(mano);    
    pos1=box_mano.center().clone();
    pos1.z=0;
    pos2=this.box.center().clone();
    pos2.z=0;
    return Math.sqrt(Math.pow((pos1.x-pos2.x),2)+Math.pow((pos1.y-pos2.y),2));
}

Elemento.prototype.abajoDe=function(puntero){
    var aument=(arguments.length>1) ? arguments[1] : 0;
     return ((this.box.max.x+aument>=puntero.getWorldPosition().x && (this.box.min.x)<=puntero.getWorldPosition().x)
        && (this.box.min.y<puntero.getWorldPosition().y))              
}


Elemento.prototype.colisiona=function(mano){   
    distancia=this.getDistancia(mano);
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

Elemento.prototype.easein=function(animacion){
    animacion.easein.mostrar(this.get(),-800,-2500,animacion);
}

Elemento.prototype.voltear=function(animacion){
    this.estado=(this.estado) ? false : true;
    if(this.estado){
        animacion.ocultar(this);//this.ocultar(this);
    }else{
        animacion.mostrar(this,180);
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
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
function Animacion(){	
	this.pila_objetos=[];
	this.pila_objetos_animaciones={};
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
Animacion.prototype.run=function(id){
	for(var i=0,length=this.pila_objetos.length;i<length;i++){		
		if(this.pila_objetos_animaciones[this.pila_objetos[i]].params[0]["animado"]===false)
			this.pila_objetos_animaciones[this.pila_objetos[i]]["animacion"](this.pila_objetos_animaciones[this.pila_objetos[i]]);		
	}
		
}


Animacion.prototype.detectarCola=function(arguments,callback){	
	if(this.pila_objetos.indexOf(arguments[0].get().id)!=-1)
		window.cancelAnimationFrame(this.pila_objetos_animaciones[arguments[0].get().id].params[0]["req_anim"]);			
	else{
		this.pila_objetos.push(arguments[0].get().id);
		this.pila_objetos_animaciones[arguments[0].get().id]={};
	}
	this.pila_objetos_animaciones[arguments[0].get().id]["params"]=arguments;
	this.pila_objetos_animaciones[arguments[0].get().id].params[0]["animado"]=false;
	this.pila_objetos_animaciones[arguments[0].get().id]["animacion"]=callback;
}


function mostrarEvent(anim){
	if(anim.params[0].getGradosActual()<=anim.params[1]){	
		anim.params[0].rotarY(THREE.Math.degToRad(anim.params[0].getGradosActual()));
		anim.params[0].incrementGrados();
		anim.params[0]["animado"]=true;
		anim.params[0]["req_anim"]=requestAnimationFrame(mostrarEvent.bind(this,anim));
	}else{
		delete anim.params[0]["animado"];
	};		
}

function ocultarEvent(anim){
	if(anim.params[0].getGradosActual()>=0){
		anim.params[0].rotarY(THREE.Math.degToRad(anim.params[0].getGradosActual()));
		anim.params[0].decrementGrados();
		anim.params[0]["animado"]=true;
		anim.params[0]["req_anim"]=requestAnimationFrame(ocultarEvent.bind(this,anim));			
	}else{	    	   
		delete anim.params[0]["animado"];
	}
}

Animacion.prototype.mostrar=function(){
	this.detectarCola(arguments,mostrarEvent);
	this.run();
}


Animacion.prototype.ocultar=function(){		
	this.detectarCola(arguments,ocultarEvent);
	this.run();
}
module.exports=Animacion;
},{}],17:[function(require,module,exports){
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
		this.capa.id="mensajes";
		document.getElementById(this.elemento).appendChild(this.capa);
		this.capa.style.cssText="width:300px;background-color:white;color:black;position:absolute;top:0px;display:none;";
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
},{}],18:[function(require,module,exports){
function PositionUtils(config){
	this.width=config.width;
	this.height=config.height;	
    this.escena=config.escena;
}

PositionUtils.prototype.getScreenPosition=function(obj){
	var vector = new THREE.Vector3();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(this.escena.camara);
    var widthHalf = this.width / 2, heightHalf = this.height / 2;
    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = -( vector.y * heightHalf ) + heightHalf;
    return vector;
}

module.exports=PositionUtils;

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
