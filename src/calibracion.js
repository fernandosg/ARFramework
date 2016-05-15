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