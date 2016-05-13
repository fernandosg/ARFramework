function Sequence(){

}

Sequence.prototype.config=function(configuracion){
  this.cantidad_cartas=configuracion.cantidad_cartas || 6;
}


Sequence.prototype.init=function(){ 
  // IMPORTO LAS CLASES Detector,Labels,DetectorAR,Elemento
  var Labels=require("./class/labels");
  var DetectorAR=require("./class/detector");
  var Elemento=require("./class/elemento");
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
    if(objetos[pos_elegido].colisiona(objeto,distancia)){
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