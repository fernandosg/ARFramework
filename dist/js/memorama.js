/**
* @file Nivel Memorama
* @author Fernando Segura Gómez, Twitter: @fsgdev
* @version 0.1
*/

/**
* Clase Memorama
* @class
* @constructor
* @param {integer} WIDTH - El ancho del canvas que se agregara al documento HTML
* @param {integer} HEIGHT - El alto del canvas que se agregara al documento HTML
*/
function Memorama(){//function Memorama(WIDTH,HEIGHT){

}

Memorama.prototype.start=function(){
  calibrar=false;
  calibracion_correcta=false;
  puntos_encontrados=false;
  primera_ejecucion=true;
  document.getElementById("calibrar").addEventListener("click",function(){
    if(!calibrar){
      this.inicioCalibracion();
      calibrar=true;
    }
  }.bind(this))
  this.pos_elegido=0;
  this.cantidad_cartas=4;// cantidad cartas
  this.cantidad_cartas_encontradas=0;
  this.initMemorama=false;
}


/**
* @function init
* @summary Esta función ejecuta el nivel de Memorama. En la aplicación esta funcion se ejecuta despues de calibrar la cámara.
*/
Memorama.prototype.init=function(){
  this.tipo_memorama="animales";
  var mensaje="Bienvenido al ejercicio Memorama<br>";
  var descripcion="El objetivo de este ejercicio, es tocar los pares de cada carta.<br>No te preocupes si no logras en el primer intento, puedes seguir jugando hasta seleccionar cada uno de los pares<br><br>";
  document.getElementById("informacion_nivel").innerHTML=mensaje+descripcion;
  document.getElementById("informacion_calibrar").style="display:none";
  var avances=document.createElement("id"); // ELIMINAR
  avances.id="avances_memorama"; // ELIMINAR
  document.getElementById("informacion_nivel").appendChild(avances); // ELIMINAR
  this.detectados=[];
  //this.objetos=[];
  // CREACION DEL ELEMENTO ACIERTO (LA IMAGEN DE LA ESTRELLA)
  var geometry=new THREE.PlaneGeometry(500,500);
  this.indicador_acierto=framework.createElement({WIDTH:500,HEIGHT:500,GEOMETRY:geometry});// new this.Elemento(500,500,new THREE.PlaneGeometry(500,500));
  this.indicador_acierto.init();
  this.indicador_acierto.definirSuperficiePorImagen("./assets/img/scale/star.png");
  this.indicador_acierto.position({x:0,y:0,z:-2500});
  framework.addToScene(this.indicador_acierto);//this.anadir(this.indicador_acierto.get());

  // CREACION DEL ELEMENTO ERROR (LA IMAGEN DE LA X)
  var geometry=new THREE.PlaneGeometry(500,500);
  this.indicador_error=framework.createElement({WIDTH:500,HEIGHT:500,GEOMETRY:geometry});// new this.Elemento(500,500,new THREE.PlaneGeometry(500,500));
  this.indicador_error.init();
  this.indicador_error.definirSuperficiePorImagen("./assets/img/scale/error.png");
  this.indicador_error.position({x:0,y:0,z:-2500});
  framework.addToScene(this.indicador_error);//this.anadir(this.indicador_error.get());

  ///*
  // CREACION DE LAS CARTAS COMO ELEMENTOS
  var cartas={animales:["medusa","ballena","cangrejo","pato"],cocina:["pinzas","refractorio","sarten","rallador"]};
  limite_renglon=Math.floor(this.cantidad_cartas/2)+1;
  for(var i=1,pos_y=-100,fila_pos=i,pos_x=-200;i<=this.cantidad_cartas;i++,pos_y=((i%2!=0) ? pos_y+130 : pos_y) ,fila_pos=((fila_pos>=limite_renglon-1) ? 1 : fila_pos+1),pos_x=(i%2==0 ? 200 : -200)){
    var geometry=new THREE.PlaneGeometry(120,120);
    var elemento=framework.createElement({WIDTH:120,HEIGHT:120,GEOMETRY:geometry});
    elemento.init();
    elemento.etiqueta(cartas[this.tipo_memorama][fila_pos-1]);
    elemento.scale(.7,.7);
    elemento.position({x:pos_x,y:pos_y,z:-600});
    //elemento.calculoOrigen();
    //this.objetos.push(elemento);
    elemento.definirCaras("./assets/img/memorama/sin_voltear.jpg","./assets/img/memorama/"+this.tipo_memorama+"/cart"+fila_pos+"_"+cartas[this.tipo_memorama][fila_pos-1]+".jpg");
    //this.mediador.suscribir("colision",this.objetos[this.objetos.length-1]);
    framework.addToScene(elemento,true).watch("colision");//this.anadir(elemento.get());
    capa_elemento=document.createElement("div");
  }
  //*/

  var geometry=new THREE.PlaneGeometry(60,60);
  var mano_obj=framework.createElement({WIDTH:60,HEIGHT:60,GEOMETRY:geometry});
  mano_obj.init();
  mano_obj.definirSuperficiePorImagen("../../assets/img/mano_escala.png",mano_obj);
  this.puntero=new THREE.Object3D();
  this.puntero.add(mano_obj.get());
  this.puntero.position.z=-1;
  this.puntero.matrixAutoUpdate = false;
  this.puntero.visible=false;
  framework.addMarker({id:16,callback:this.callbackMemorama,puntero:this.puntero});//this.anadirMarcador({id:16,callback:this.callbackMemorama,puntero:this.puntero});
  //CREACION DE KATHIA, se utiliza la variable "kathia_renderer" de dist/js/libs/kathia/kathia.js
  document.getElementById("kathia").appendChild(kathia_renderer.view);

  //CREACION DE LA ETIQUETA DONDE SE ESCRIBE LA RESPUESTA DE KATHIA

  iniciarKathia();
  clasificarOpcion("memorama","bienvenida");
  clasificarOpcion("memorama","instrucciones");
}

/**
* @function logicaMemorama
* @summary Esta función se ejecutara una vez que algún objeto haya colisionado con el marcador.
* La función sera ejecutada por la instancia de ManejadorEventos.
* Dentro de esta función es donde esta la logica tradicional de un juego de memorama
* @param {boolean} esColisionado - Es una bandera, la cual traera el resultado si el marcador colisiono con algun objeto
* @param {Elemento} objeto_actual -
*/
Memorama.prototype.logicaMemorama=function(esColisionado,objeto_actual){
  if(esColisionado){
    if(this.detectados.length==1 && this.detectados[0].igualA(objeto_actual)){

    }else if(this.detectados.length==1 && this.detectados[0].esParDe(objeto_actual)){
      clasificarOpcion("memorama","acierto");
      //this.indicador_acierto.easein(framework.getAnimation());//this.indicador_acierto.easein(this.animacion);
      framework.getAnimation().showAndHide(this.indicador_acierto);
      //objeto_actual.voltear(framework.getAnimation());//objeto_actual.voltear(this.animacion);
      framework.getAnimation().turnout(objeto_actual);
      framework.removeWatch("colision",objeto_actual);//this.mediador.baja("colision",objeto_actual);
      framework.removeWatch("colision",this.detectados[0]);//this.mediador.baja("colision",this.detectados[0]);
      document.getElementById("avances_memorama").innerHTML="Excelente, haz encontrado el par de la carta x"; // ELIMINAR
      this.detectados=[];
      this.cantidad_cartas_encontradas++;
    }else if(this.detectados.length==0){
      //objeto_actual.voltear(framework.getAnimation());//objeto_actual.voltear(this.animacion);
      framework.getAnimation().turnout(objeto_actual);
      this.detectados.push(objeto_actual);
    }else if(!this.detectados[0].esParDe(objeto_actual)){
      clasificarOpcion("memorama","fallo");
      //this.indicador_error.easein(framework.getAnimation());//this.indicador_error.easein(this.animacion);
      framework.getAnimation().showAndHide(this.indicador_error);
      document.getElementById("avances_memorama").innerHTML="Al parecer te haz equivocado de par, no te preocupes, puedes seguir intentando con el par de x"; // ELIMINAR
      //this.detectados[0].voltear(framework.getAnimation());//this.detectados[0].voltear(this.animacion);
      framework.getAnimation().turnout(this.detectados[0]);
      this.detectados.pop();
    }
  }
}

/**
* @function callbackMemorama
* @summary Esta funcion sirve como callback una vez que el detector de marcadores, haya detectado un marcador.
* Una vez detectado el marcador, se ejecutara y dentro se identificara si cumple con las condiciones de profunidad
* @param {THREE.Object3D} puntero - Es el objeto que la instancia de DetectorAR, traspuso la posición del marcador
*/
Memorama.prototype.callbackMemorama=function(puntero){
  if(puntero.getWorldPosition().z>300 && puntero.getWorldPosition().z<=500){
    puntero.visible=true;
    framework.dispatch("colision",puntero,this.logicaMemorama,{stage:this});//this.mediador.comunicar("colision",puntero,this.logicaMemorama,{stage:this});
  }
}

/**
* @function logicaCalibracion
* @summary Esta funcion sirve como callback una vez que el detector de marcadores, haya detectado un marcador.
* A su vez, dentro de la misma esta la lógica de la etapa de Calibracion.
* La etapa de calibración es un proceso donde a partir de un orden de colores, debes de seleccionar cada color, dependiendo de el orden indicado.
* La misma funcion identifica si ya se detectaron todos los elementos de prueba, inicia el nivel de Memorama
* @param {THREE.Object3D} puntero - Es el objeto que la instancia de DetectorAR, traspuso la posición del marcador
*/
Memorama.prototype.logicaCalibracion=function(puntero){
  if(puntero.getWorldPosition().z>300 && puntero.getWorldPosition().z<=500){
    puntero.visible=true;
    //this.mediador.comunicarParticular("colision",this.objetos[this.pos_elegido],puntero,function(esColisionado,extras){
    framework.individualDispatch("colision",framework.getObject(this.pos_elegido),puntero,function(esColisionado,extras){
      if(esColisionado){
        extras["mediador"].baja("colision",framework.getObject(this.pos_elegido));
        this.pos_elegido++;
        if(this.pos_elegido==this.cantidad_cartas){
          this.puntos_encontrados=true;
          this.detener_calibracion=true;
          //framework.finish(); LLAMAR DESPUES DE PROBAR
          framework.clean();
          this.init();//
          //this.limpiar();
          //this.init();
        }else
          document.getElementById("colorSelect").style.backgroundColor=this.colores[this.pos_elegido];
      }
    },this);//*/
  }
}

/**d
* @function inicioCalibracion
* @summary Crea todos los elementos dibujados en el canvas,donde cada elemento tiene un color especifico
*/
Memorama.prototype.inicioCalibracion=function(){
  var threshold_total=0;
  var threshold_conteo=0;
  for(var i=0;i<300;i++){
    framework.changeThreshold(i);//this.detector_ar.cambiarThreshold(i);
    if(framework.canDetectMarker(this)){//if(this.detector_ar.detectMarker(this)){
      threshold_total+=i;
      threshold_conteo++;
    }
  }
  if(threshold_conteo>0){
    threshold_total=threshold_total/threshold_conteo;
    framework.changeThreshold(threshold_total);//this.detector_ar.cambiarThreshold(threshold_total);
    calibracion_correcta=true;
    threshold_conteo=0;
    threshold_total=0;
  }
  calibrar=false;
  if(calibracion_correcta){
    framework.allowDetect(true);//this.allowDetect(true);
    this.colores=["rgb(34, 208, 6)","rgb(25, 11, 228)","rgb(244, 6, 6)","rgb(244, 232, 6)"];
    document.getElementById("colorSelect").style.backgroundColor=this.colores[this.pos_elegido];
    //CREACION DE OBJETOS A SELECCIONAR PARA CALIBRAR
    limite_renglon=Math.floor(this.cantidad_cartas/2)+1;
    tamano_elemento=80;
    margenes_espacio=(framework.getWidth()-(tamano_elemento*limite_renglon))/limite_renglon;
    for(var x=1,pos_y=-100,fila_pos=x,pos_x=-200;x<=this.cantidad_cartas;x++,pos_y=((fila_pos>=limite_renglon-1) ? pos_y+120+50 : pos_y) ,fila_pos=((fila_pos>=limite_renglon-1) ? 1 : fila_pos+1),pos_x=(fila_pos==1 ? -200 : (pos_x+margenes_espacio+tamano_elemento))){
      var geometry=new THREE.PlaneGeometry(tamano_elemento,tamano_elemento);
      var elemento=framework.createElement({WIDTH:tamano_elemento,HEIGHT:tamano_elemento,GEOMETRY:geometry});
      elemento.init();
      elemento.etiqueta(this.colores[x-1]);
      elemento.position({x:pos_x,y:pos_y,z:-600});
      //elemento.calculoOrigen();
      //this.objetos.push(elemento);
      elemento.definirSuperficiePorColor(this.colores[x-1]);
      framework.addToScene(elemento,true).watch("colision");//this.anadir(elemento.get());
    }
    this.initMemorama=true;
  }
}


/**
* @function calibracion
* @summary Inicia el nivel de calibracion.
* Crea el puntero (un objeto THREE.Object3D) para reemplazar en la posición del marcador detectado por DetectorAR(JSArtoolkit).
* Dentro de este método ejecuta la función loop.
*/
Memorama.prototype.calibracion=function(){
  //this.objetos=[];
  var geometry=new THREE.PlaneGeometry(60,60);
  var mano_obj=framework.createElement({WIDTH:60,HEIGHT:60,GEOMETRY:geometry});
  mano_obj.init();
  mano_obj.definirSuperficiePorImagen("../../assets/img/mano_escala.png");
  this.puntero=new THREE.Object3D();
  this.puntero.add(mano_obj.get());
  this.puntero.position.z=-1;
  this.puntero.matrixAutoUpdate = false;
  this.puntero.visible=false;
  framework.addMarker({id:16,callback:this.logicaCalibracion,puntero:this.puntero});//this.anadirMarcador({id:16,callback:this.logicaCalibracion,puntero:this.puntero});
  //this.loop();
}


/**
* @function loop
* @summary Esta función se estara ejecutando finitamente hasta que se cierre la aplicación.
* Se encargara del redibujo de todos los elementos agregados a escena y la actualización del canvas con la transmisión de la webcam.
*/
Memorama.prototype.loop=function(){
  if(!pausado_kathia)
  animate();
  if(this.initMemorama && this.cantidad_cartas_encontradas==2)
    framework.finishStage();
}

//module.exports=Memorama;
