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
    console.log("calibrando");
    calibrar=true;    
  });
}

Calibrar.prototype.loop=function(stage){        
    if(calibrar){
      threshold_total=0;
      threshold_conteo=0;
      for(var i=0;i<300;i++){
        this.detector_ar.cambiarThreshold(i);
        if(this.detector_ar.markerToObject(this.objeto)){
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
    if(this.objeto.getWorldPosition().z>300 && this.objeto.getWorldPosition().z<=500){  
      this.mano_obj.actualizarPosicionesYescala(this.objeto.getWorldPosition(),this.objeto.getWorldScale());        
      this.observador.dispararParticular("colision",stage.objetos[stage.pos_elegido],this.objeto,function(esColision,extras){
        //console.log("FN AFTER "+stage.pos_elegido+" "+stage.cantidad_cartas);
        if(esColision){        
          stage.pos_elegido++;
          document.getElementById("colorSelect").style.backgroundColor=stage.colores[stage.pos_elegido];
          if(stage.pos_elegido==stage.cantidad_cartas)
            stage.puntos_encontrados=true;
        }
      });
    }
  }

/*Calibrar.prototype.getConfiguracion=function(){
  return {camara_video:videoCamera,camara_plano:planoCamera,camara_real:realidadCamera,umbral:umbral,renderer:renderer,movie_screen:movieScreen,video:video,canvas_context:ctx,canvas:canvas,detector:this.detector_ar}
}*/

module.exports=Calibrar;