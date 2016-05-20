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