(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//DEBUG=true;
Calibrar=require("../src/calibracion.js");
Memorama=require("../src/memorama.js");
memorama=new Memorama();
calibracion=new Calibrar();
calibracion.config({cantidad_cartas:4});

calibracion.init(function(){
	configuracion_init=calibracion.getConfiguracion();
	configuracion_init["tipo_memorama"]="cocina";
	memorama.config(configuracion_init);
	memorama.init();
	mensajes.alerta({texto:"Bienvenido al memorama"});
	clasificarOpcion("bienvenida");	
	/* DE ALGUNA MANERA ENCADENAR LOS SONIDOS 
	//mensajes.alerta({texto:"Instrucciones al memorama",tiempo:4000});
	//
	*/	
	clasificarOpcion("instrucciones");
})
},{"../src/calibracion.js":2,"../src/memorama.js":9}],2:[function(require,module,exports){
function Calibrar(){
  this.bloqueado=false;
}


Calibrar.prototype.config=function(configuracion){
  this.cantidad_cartas=configuracion.cantidad_cartas || 4;  
}

Calibrar.prototype.bloquear=function(){
  this.bloqueado=true;
}

Calibrar.prototype.desbloquear=function(){
  this.bloqueado=false;
}

Calibrar.prototype.init=function(callback){ 
  var Observador=require("./class/ManejadorEventos");
  Mensajes=require("./libs/mensajes.js");
  mensajes=new Mensajes(this);
  observador=new Observador();
  mensaje="Bienvenido al proceso de calibración.<br>";
  descripcion="Para mayor eficacia en el uso del rehabilitador, es necesario asegurar que puedas hacer los ejercicios de manera adecuada. Te pedimos, te coloques a no más de 90cm con el brazo extendido, una vez en posición, pide a alguien que de clic en la opción Calibrar.<br>";
  descripcion+="Una vez calibrado, aparecerán 4 cuadros, selecciona cada uno, conforme al orden que aparece abajo de este mensaje. Una vez seleccionado todos, iniciara el primer nivel de Memorama";
  document.getElementById("informacion_nivel").innerHTML=mensaje+""+descripcion;
  var req_id,calibrar=false;
  var cantidad_cartas=this.cantidad_cartas;
  DetectorAR=require("./class/detector");
  Elemento=require("./class/elemento");
    THREE.Matrix4.prototype.setFromArray = function(m) {
          return this.set(
            m[0], m[4], m[8], m[12],
            m[1], m[5], m[9], m[13],
            m[2], m[6], m[10], m[14],
            m[3], m[7], m[11], m[15]
          );
  }
  objetos=[];
  var colores=["rgb(34, 208, 6)","rgb(25, 11, 228)","rgb(244, 6, 6)","rgb(244, 232, 6)"];
  var planoScene=new THREE.Scene(),realidadScene=new THREE.Scene(),videoScene=new THREE.Scene();
    var WIDTH_CANVAS=1000,HEIGHT_CANVAS=800;
  videoCamera=new THREE.Camera();
  realidadCamera=new THREE.Camera();
  planoCamera=new THREE.PerspectiveCamera();//THREE.Camera(); 
  planoCamera.near=0.1;
  planoCamera.far=2000;
  planoCamera.updateProjectionMatrix();
  //webglAvailable();
  renderer = new THREE.WebGLRenderer();
  //planoCamera.lookAt(planoScene.position);
  renderer.autoClear = false;
  renderer.setSize(WIDTH_CANVAS,HEIGHT_CANVAS);
  document.getElementById("ra").appendChild(renderer.domElement);

  // Elementos para detectar camara
  canvas=document.createElement("canvas");
  canvas.width=WIDTH_CANVAS;
  canvas.height=HEIGHT_CANVAS;
  video=new THREEx.WebcamTexture(WIDTH_CANVAS,HEIGHT_CANVAS);
  videoTexture=new THREE.Texture(canvas);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, depthTest: false, depthWrite: false} );//new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );     
  var movieGeometry = new THREE.PlaneGeometry(2,2,0.0);
  movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
  movieScreen.scale.x=-1;
  movieScreen.material.side = THREE.DoubleSide;
  videoScene.add(movieScreen);  

  mano_obj=new Elemento(60,60,new THREE.PlaneGeometry(60,60));
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

  //CREACION DE OBJETOS A SELECCIONAR PARA CALIBRAR
  limite_renglon=Math.floor(this.cantidad_cartas/2)+1;
  tamano_elemento=80;
  margenes_espacio=(WIDTH_CANVAS-(tamano_elemento*limite_renglon))/limite_renglon;
 


   /*
    FUNCION PARA RENDERIZADO DE LAS ESCENAS.
  */
  var calibracion_correcta=false,puntos_encontrados;  
  umbral=0;
  function rendering(){ 
    renderer.clear();
    renderer.render( videoScene, videoCamera );
    renderer.clearDepth();
    renderer.render( planoScene, planoCamera );
    renderer.clearDepth();
    renderer.render( realidadScene, realidadCamera );
  }
  detener=false;
  function loop(){        
    movieScreen.material.map.needsUpdate=true;
    ctx.drawImage(video.video,0,0,WIDTH_CANVAS,HEIGHT_CANVAS);
    canvas.changed=true;    
    if(calibrar){
      threshold_total=0;
      threshold_conteo=0;
      for(var i=0;i<300;i++){
        detector_ar.cambiarThreshold(i);
        if(detector_ar.markerToObject(objeto)){
          threshold_total+=i;
          threshold_conteo++;
          //umbral=i+5;          
        }
      }
      if(threshold_conteo>0){
        threshold_total=threshold_total/threshold_conteo;
        detector_ar.cambiarThreshold(threshold_total);
        window.cancelAnimationFrame(req_id);  
        umbral=threshold_total;
        calibracion_correcta=true;    
        calibrar=false;
        threshold_conteo=0;
        threshold_total=0;
        Siguiente();//PARTE PARA INDICAR LOS OBJETOS A COLISIONAR PARA VER SI FUNCIONA BIE                  
      }
      console.log("error");
      calibrar=false;
    }
    rendering();
    if(calibracion_correcta && !puntos_encontrados){      
      if(detector_ar.markerToObject(objeto))
        verificarColision();      
    }else if(puntos_encontrados){ 
      window.cancelAnimationFrame(req_id);    
      document.getElementById("informacion_calibrar").setAttribute("style","display:none;");
      detener=true;
      callback();
    }
    if(!detener)
     req_id=requestAnimationFrame(loop);  
  }
  var pos_elegido=0;
  document.getElementById("colorSelect").style.backgroundColor=colores[pos_elegido];
  document.getElementById("calibrar").addEventListener("click",function(){
    console.log("calibrando");
    calibrar=true;
    
  });

  function verificarColision(){    
    mano_obj.actualizarPosicionesYescala(objeto.getWorldPosition(),objeto.getWorldScale());    
    observador.dispararParticular("colision",objetos[pos_elegido],objeto,function(esColision,extras){
      if(esColision){        
        pos_elegido++;
        document.getElementById("colorSelect").style.backgroundColor=colores[pos_elegido];
        if(pos_elegido==cantidad_cartas)
          puntos_encontrados=true;
      }
    });
  }

  function Siguiente(){    
    objetos=[];
     for(var x=1,cont_fila=1,pos_y=-100,fila_pos=x,pos_x=-200;x<=cantidad_cartas;x++,pos_y=((fila_pos>=limite_renglon-1) ? pos_y+120+50 : pos_y) ,fila_pos=((fila_pos>=limite_renglon-1) ? 1 : fila_pos+1),pos_x=(fila_pos==1 ? -200 : (pos_x+margenes_espacio+tamano_elemento))){             
        var elemento=new Elemento(tamano_elemento,tamano_elemento,new THREE.PlaneGeometry(tamano_elemento,tamano_elemento));
        elemento.init();
        elemento.etiqueta(colores[x-1]);
        elemento.position(new THREE.Vector3(pos_x,pos_y,-600));  
        elemento.calculoOrigen();
        objetos.push(elemento);
        elemento.definirBackground(colores[x-1]);
        observador.suscribir("colision",objetos[objetos.length-1]);
        planoScene.add(elemento.get());
      }

  }

  req_id=requestAnimationFrame(loop);
  console.log("hii");
  //Siguiente();
}

Calibrar.prototype.getConfiguracion=function(){
  return {camara_video:videoCamera,camara_plano:planoCamera,camara_real:realidadCamera,umbral:umbral,renderer:renderer,movie_screen:movieScreen,video:video,canvas_context:ctx,canvas:canvas,detector:detector_ar}
}

module.exports=Calibrar;
},{"./class/ManejadorEventos":3,"./class/detector":4,"./class/elemento":5,"./libs/mensajes.js":8}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
module.exports=function(canvas_element){
        var JSARRaster,JSARParameters,detector,result;
        var threshold=139;
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

        var markerToObject=function(objeto){
            var markerCount = detector.detectMarkerLite(JSARRaster, threshold); 
            if(markerCount>0){            
                objeto.transformFromArray(obtenerMarcador(markerCount));
                objeto.matrixWorldNeedsUpdate=true;
                return true;            
            }
            return false;
        }

        var cambiarThreshold=function (threshold_nuevo){
            threshold=threshold_nuevo;
        }
        return{
            init:init,
            setCameraMatrix,setCameraMatrix,
            markerToObject:markerToObject,
            cambiarThreshold:cambiarThreshold
        }
}
},{}],5:[function(require,module,exports){
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
    this.elemento_raiz.position.set(pos.x,pos.y,pos.z);
    this.x=pos.x;
    this.y=pos.y;
    this.posiciones=pos;
}


Elemento.prototype.actualizar=function(){
    for(var i=0;i<this.elemento_raiz.children.length;i++)
        this.elemento_raiz.children[i].material.map.needsUpdate=true;
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
    this.calculoOrigen();
}
module.exports=Elemento;
},{"../libs/animacion.js":7}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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


},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
function Memorama(){
  this.bloqueado=false;  
  this.Observador=require("./class/ManejadorEventos");
  this.Mensajes=require("./libs/mensajes");
}

Memorama.prototype.bloquear=function(){
  this.bloqueado=false;
}

Memorama.prototype.desbloquear=function(){
  this.bloqueado=true;
}

Memorama.prototype.config=function(configuracion){
  this.tipo_memorama=configuracion["tipo_memorama"];  
  this.cantidad_cartas=configuracion["cantidad_cartas"] || 4;
  this.WIDTH=configuracion["width"] || 1000;
  this.HEIGHT=configuracion["height"] || 800;

  this.planoCamera=configuracion["camara_plano"] || new THREE.PerspectiveCamera();//THREE.Camera();
  if(!configuracion["camara_plano"]){
    this.planoCamera.near=0.1;
    this.planoCamera.far=2000;
  }  
  this.videoCamera=configuracion["camara_video"] || new THREE.Camera();
  this.realidadCamera=configuracion["camara_real"] || new THREE.Camera();  
  this.renderer = configuracion["renderer"] || new THREE.WebGLRenderer();
  if(!configuracion["renderer"]){
    this.renderer.autoClear = false;
    this.renderer.setSize(this.WIDTH,this.HEIGHT);
    document.getElementById("ra").appendChild(this.renderer.domElement);
  }
  this.movie_screen=configuracion["movie_screen"];  
  this.video=configuracion["video"];
  this.canvas=configuracion["canvas"];
  this.canvas_context=configuracion["canvas_context"];
  this.detector_ar=configuracion["detector"];
}


Memorama.prototype.init=function(){ 
  // IMPORTO LAS CLASES Detector,Labels,DetectorAR,Elemento    
  mensaje="Bienvenido al ejercicio Memorama<br>";
  mensajes=new this.Mensajes(this);
  observador=new this.Observador();
  descripcion="El objetivo de este ejercicio, es tocar los pares de cada carta.<br>No te preocupes si no logras en el primer intento, puedes seguir jugando hasta seleccionar cada uno de los pares<br><br>";
  document.getElementById("informacion_nivel").innerHTML=mensaje+descripcion;
  avances=document.createElement("id");
  avances.id="avances_memorama";
  document.getElementById("informacion_nivel").appendChild(avances);
  var Labels=require("./class/labels");
  var Elemento=require("./class/elemento");
  parent_memorama=this;
  /*
    MODIFICO LA FUNCION setFromArray DE LA CLASE Matrix4
  */


  var videoScene=new THREE.Scene(),realidadScene=new THREE.Scene(),planoScene=new THREE.Scene();  
  
  WIDTH_CANVAS=this.WIDTH;
  HEIGHT_CANVAS=this.HEIGHT;//configuracion["height"];


  this.planoCamera.lookAt(planoScene.position);
  videoScene.add(this.movie_screen);
  /* 
    SE CREA LA MANO, COMO OBJETO CANVAS DONDE SE DIBUJA LA IMAGEN DE mano_escala.
    LA POSICION DE ESTE OBJETO SE ACTUALIZARA
  */
  
  mano=new Elemento(60,60,new THREE.PlaneGeometry(60,60));
  mano.init();  
  mano.etiqueta("Detector");
  mano.definir("./assets/img/mano_escala.png",mano);
  //mano.get().position.z=-1;
  objeto=new THREE.Object3D();
  objeto.add(mano.get());
  objeto.position.z=-1;
  objeto.matrixAutoUpdate = false;
  realidadScene.add(objeto);

   // CREACION DEL ELEMENTO ACIERTO (LA IMAGEN DE LA ESTRELLA)
  indicador_acierto=new Elemento(500,500,new THREE.PlaneGeometry(500,500));
  indicador_acierto.init();
  indicador_acierto.definir("./assets/img/scale/star.png",indicador_acierto);
  indicador_acierto.position(new THREE.Vector3(0,0,-2500));
  planoScene.add(indicador_acierto.get());

  // CREACION DEL ELEMENTO ERROR (LA IMAGEN DE LA X)
  indicador_error=new Elemento(500,500,new THREE.PlaneGeometry(500,500));
  indicador_error.init();
  indicador_error.definir("./assets/img/scale/error.png",indicador_error);
  indicador_error.position(new THREE.Vector3(0,0,-2500));
  planoScene.add(indicador_error.get());

///*
  // CREACION DE LAS CARTAS COMO ELEMENTOS
  console.log("veamos la cantidad de cartas "+this.cantidad_cartas);
 var cartas={animales:["medusa","ballena","cangrejo","pato"],cocina:["pinzas","refractorio","sarten","rallador"]};  
  objetos=[],objetos_mesh=[],objetos_3d=[];        
  limite_renglon=Math.floor(this.cantidad_cartas/2)+1;
  for(var i=1,cont_fila=1,pos_y=-100,fila_pos=i,pos_x=-200;i<=this.cantidad_cartas;i++,pos_y=((i%2!=0) ? pos_y+130 : pos_y) ,fila_pos=((fila_pos>=limite_renglon-1) ? 1 : fila_pos+1),pos_x=(i%2==0 ? 200 : -200)){         
    var elemento=new Elemento(120,120,new THREE.PlaneGeometry(120,120));
    elemento.init();
    elemento.etiqueta(cartas[this.tipo_memorama][fila_pos-1]);
    elemento.scale(.7,.7);
    elemento.position(new THREE.Vector3(pos_x,pos_y,-600));  
    objetos_mesh.push(elemento);
    objetos.push(elemento);
    planoScene.add(elemento.get());
    objetos[objetos.length-1].definirCaras("./assets/img/memorama/sin_voltear.jpg","./assets/img/memorama/"+this.tipo_memorama+"/cart"+fila_pos+"_"+cartas[this.tipo_memorama][fila_pos-1]+".jpg",
      objetos[objetos.length-1]); 
    capa_elemento=document.createElement("div");
    observador.suscribir("colision",objetos[objetos.length-1]);
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
  label=texto.crear("HELLO WORLD");
  planoScene.add(label);

  label.position.set(-1.5,-6.6,-20);




  var pares=0;
  detectados=[];

  /*
    FUNCION LOGICA MEMORAMA
    EN ESTA FUNCION ES DONDE SE DEFINE LAS ACCIONES CORRESPONDIENTES A LA LOGICA DE MEMORAMA:
      ES PAR{
        SI ES PAR, LOS ELEMENTOS SE ELIMINAN DE LA COLA DE ELEMENTOS DIBUJADOS.    
      }
      IMPAR{
        SI NO ES PAR, LOS ELEMENTOS SE ROTAN DE TAL MANERA DE QUE SE OCULTE Y SE DA UNA NOTIFICACION 
        DE MANERA GRAFICA 
      }


  */
  function logicaMemorama(esColisionado,objeto_actual,extras){ 
    if(esColisionado){
      if(extras["detectados"].length==1 && extras["detectados"][0].igualA(objeto_actual)){

      }else if(extras["detectados"].length==1 && extras["detectados"][0].esParDe(objeto_actual)){        
          clasificarOpcion("acierto");
          indicador_acierto.easein();         
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
          mensajes.alerta({texto:"Bloqueando por problemas de fallo",tiempo:3000});
          indicador_error.easein();
          //error.play();        
          document.getElementById("avances_memorama").innerHTML="Al parecer te haz equivocado de par, no te preocupes, puedes seguir intentando con el par de x";
          extras["detectados"][0].voltear();
          extras["detectados"].pop();
      }
      detectados=extras["detectados"];
    }
    //*/
}
  
  /*
    FUNCION PARA VERIFICAR LA COLISION.
      SE ACTUALIZA LA POSICION DE LA MANO CON EL OBJETO3D QUE ES ACTUALIZADO A RAIZ DE LA UBICACION DEL MARCADOR
      EN ESTA FUNCION SE ITERA SOBRE TODAS LAS CARTAS AGREGADAS A ESCENA
  */

  function verificarColision(){    
    mano.actualizarPosicionesYescala(objeto.getWorldPosition(),objeto.getWorldScale()); 
    observador.disparar("colision",objeto,logicaMemorama,{detectados:detectados});   
  }

  /*
    FUNCION PARA ACTUALIZAR EL ELEMENTO RANGE HTML.
      UNA PROPUESTA VISUAL DE LA PROFUNDIDAD ACTUAL  
  */
  function actualizarDistancia(z){
    document.getElementById("distancia").value=((100*z)/1246);  
  }

  /*
    FUNCION PARA MOSTRAR POSICION DE MANO
  */
  function mostrarPosicionMano(pos){
    document.getElementById("pos_x_mano").innerHTML=pos.x;
    document.getElementById("pos_y_mano").innerHTML=pos.y;
    document.getElementById("pos_z_mano").innerHTML=pos.z;
  }

  /*
    FUNCION PARA RENDERIZADO DE LAS ESCENAS.

  */
  function rendering(){ 
    parent_memorama.renderer.clear();
    parent_memorama.renderer.render( videoScene, parent_memorama.videoCamera );
    parent_memorama.renderer.clearDepth();
    parent_memorama.renderer.render( planoScene, parent_memorama.planoCamera );
    parent_memorama.renderer.clearDepth();
    parent_memorama.renderer.render( realidadScene, parent_memorama.realidadCamera );
  }

  /*
    FUNCION DE ANIMACION

  */
  function loopMemorama(){  
    parent_memorama.movie_screen.material.map.needsUpdate=true;       
    for(var i=0;i<objetos.length;i++)
      objetos[i].actualizar();          
    parent_memorama.canvas_context.drawImage(parent_memorama.video.video,0,0,WIDTH_CANVAS,HEIGHT_CANVAS);
    parent_memorama.canvas.changed = true;
    label.material.map.needsUpdate=true;
    if(!this.bloqueado)
      if(parent_memorama.detector_ar.markerToObject(objeto)){
        mostrarPosicionMano(objeto.getWorldPosition());
        if(objeto.getWorldPosition().z>300 && objeto.getWorldPosition().z<=500)
          verificarColision();    
      }
    if(!pausado_kathia)
      animate();  
    rendering();
    requestAnimationFrame(loopMemorama);    
  }

   
  iniciarKathia(texto);
  loopMemorama();
}

module.exports=Memorama;
},{"./class/ManejadorEventos":3,"./class/elemento":5,"./class/labels":6,"./libs/mensajes":8}]},{},[1,5,4,6,2]);
