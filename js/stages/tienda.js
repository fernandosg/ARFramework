function Tienda(){
	this.turno=0;
  this.callback_fn=false;
  this.firstTime=true;
  this.numOrden=0;
}

Tienda.prototype.init=function(stage){
  stage.conteo_segundos=0;
  stage.conteo=undefined;
  stage.vasos=[],stage.mensajes=[],stage.jarras=[],stage.holders=[];  
  stage.recoger=[true,true],stage.lleno=[true,true];
  stage.mensajes_texto=new this.Mensajes({game:stage,div:"container",type:"text"});
  stage.mensaje_ordenjarra=new this.Mensajes({game:stage,div:"container",type:"text",clase:"postit",ocultar:false});
  for(var i=0,increment=0;i<2;i++,increment=100){
  	stage.vasos[i]=new this.Elemento(52,122,new THREE.PlaneGeometry(52,122));  
  	stage.vasos[i].init();
    stage.vasos[i].etiqueta("Detector");
    stage.vasos[i].definir("../../assets/img/tienda/vaso.png",stage.vasos[i]);    
    stage.vasos[i].position({x:(-150+increment),y:-90,z:-620});
    stage.mensajes[i]=new this.Mensajes({game:stage,div:"container",type:"text",clase:"postit",ocultar:false});  
    stage.vasos[i].next(function(stage,i){
      var pos=this.position_utils.getScreenPosition(stage.vasos[i].get().children[0]);
      var size=this.position_utils.getRealSize(stage.vasos[i].box.size(),stage.vasos[i].get().position.z);      
      stage.mensajes[i].position({left:(pos.x-(size.width/2))+"px",top:(pos.y+(size.height))+"px"}).aviso("Orden "+i).mostrar(); 
    }.bind(this,stage,i));
    this.anadir(stage.vasos[i].get());    

    stage.jarras[i]=new this.Elemento(129,154,new THREE.PlaneGeometry(129,154));
    stage.jarras[i].init();
    stage.jarras[i].etiqueta("Jarra");
    stage.jarras[i].definir("../../assets/img/tienda/jarra.png",stage.jarras[i]);
    stage.jarras[i].position({x:(160+increment),y:-70,z:-600});   
    this.anadir(stage.jarras[i].get());  

    stage.holders[i]=new this.Elemento(30,30,new THREE.PlaneGeometry(30,30));
    stage.holders[i].init();
    stage.holders[i].etiqueta("Detector");
    stage.holders[i].definirBackground(0xff0000);
    stage.holders[i].position({x:(160+increment),y:-70,z:-600});
    this.anadir(stage.holders[i].get());      
  }

  stage.mensaje_imagen=new this.Mensajes({game:stage,div:"container",type:"image"}).srcImage("../../assets/img/tienda/exito.png");

  stage.mesa=new this.Elemento(292,285,new THREE.PlaneGeometry(292,285));
  stage.mesa.init();
  stage.mesa.etiqueta("Detector");
  stage.mesa.definir("../../assets/img/tienda/mesa.png",stage.mesa);
  stage.mesa.position({x:160,y:-200,z:-610});


 
  stage.puntero=new this.Elemento(61,60,new THREE.PlaneGeometry(61,60));
	stage.puntero.init();
	stage.puntero.definir("./assets/img/mano_escala.png",stage.puntero);	
	stage.puntero.get().position.z=-1;
	stage.puntero.get().matrixAutoUpdate = false;
  stage.puntero.get().visible=false;  
  this.anadir(stage.mesa.get());
  this.anadirMarcador({id:16,callback:stage.fnAfter,puntero:stage.puntero.get()});
  this.allowDetect(true);
}

Tienda.prototype.loop=function(stage){

}


Tienda.prototype.actualizarJarra=function(puntero){
  var data=[puntero.getWorldPosition(),puntero.getWorldRotation(),puntero.getWorldQuaternion()];
  this.jarras[this.turno].position({x:data[0].x,y:data[0].y});
  this.jarras[this.turno].rotation({x:data[1].x,y:data[1].y,z:data[1].z});
  this.jarras[this.turno].quaternion({x:data[2].x,y:data[2].y,z:data[2].z});
}

Tienda.prototype.logica=function(puntero){
  if(this.recoger[this.turno])    
      this.actualizarJarra(puntero); 
  if(this.vasos[this.turno].abajoDe(puntero,(this.jarras[this.turno].width/2))){
    if(this.lleno[this.turno])
      if(puntero.getWorldRotation().x<=0.47062448038075105  && puntero.getWorldRotation().z<=1.50){
        console.log("LLENANDO EL VASO")
        var that=this;
        setTimeout(function(){
          that.conteo_segundos++;
          console.log("comenzando "+that.conteo_segundos)
          if(that.conteo_segundos>=3){
            clearInterval(that.conteo);
            this.lleno[this.turno]=false;
            this.conteo_segundos=0;
            var pos=this.position_utils.getScreenPosition(this.vasos[this.turno].get().children[0]);
            var size=this.position_utils.getRealSize(this.vasos[this.turno].box.size(),this.vasos[this.turno].get().position.z);
            this.mensaje_imagen.position({left:(pos.x-(size.width/2))+"px",top:(pos.y-(size.height/2))+"px"}).mostrar();
            this.mensajes_texto.aviso("Esta vacia la jarra, debo llenarlo "+this.turno).mostrar();                       
            this.mensajes[this.turno].ocultar();
            that.conteo=undefined;
          }
        }.bind(this),1000);     
      }else{
        if(this.conteo!=undefined){
          clearInterval(this.conteo); 
        }       
      }
  }else if(this.holders[this.turno].getDistancia(puntero)<=66.5){
    if(!this.lleno[this.turno]){
      this.actualizarJarra(this.holders[this.turno].get()); 
      if(!this.callback_fn){ //Prevent that this block executed more that one time
        this.numOrden++; 
        setTimeout(function(turno){
          this.callback_fn=false;
          var pos=this.position_utils.getScreenPosition(this.jarras[turno].get().children[0]);
          var size=this.position_utils.getRealSize(this.jarras[turno].box.size(),this.jarras[turno].get().position.z);
          this.mensaje_imagen.position({left:(pos.x-(size.width/2))+"px",top:(pos.y-(size.height/2))+"px"}).mostrar();              
          this.recoger[turno]=true; 
          this.lleno[turno]=true;
          this.mensajes_texto.aviso("Esta llena la jarra, debo llenar el vaso "+turno).mostrar();          
          this.mensaje_ordenjarra.position({left:(pos.x-(size.width/2))+"px",top:(pos.y+(size.height/2))+"px"}).aviso("Entregar a orden "+this.numOrden).mostrar();          
        }.bind(this,this.turno),5000);         
        this.mensajes[this.turno].aviso("Orden "+this.numOrden).mostrar();
        this.turno=(this.turno==1) ? 0 : 1;                   
        this.callback_fn=true;
      }    
    }    
  }  
}

Tienda.prototype.fnAfter=function(puntero){
	puntero.visible=true;	
	if(puntero.getWorldPosition().z>300 && puntero.getWorldPosition().z<=500){    //this.logica.call(this,puntero);     
    this.logica(puntero);
  }else if(puntero.getWorldPosition().z>500)
    this.mensajes_texto.aviso("Estas muy lejos").mostrar();
  else if(puntero.getWorldPosition().z<300)
    this.mensajes_texto.aviso("Estas cercas").mostrar();
}

module.exports=Tienda;