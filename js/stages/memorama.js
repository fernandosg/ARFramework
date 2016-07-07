
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