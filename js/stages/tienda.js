function Tienda(){
	
}

Tienda.prototype.init=function(stage){
	stage.vaso=new this.Elemento(52,122,new THREE.PlaneGeometry(52,122));
	stage.vaso.init();
  stage.vaso.etiqueta("Detector");
  stage.vaso.definir("../../assets/img/tienda/vaso.png",stage.vaso);
  stage.vaso.position({x:-150,y:-90,z:-600});

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
  if(this.vaso.getDistancia(puntero)<=90 && this.lleno){
    if(this.lleno)
      if(puntero.getWorldRotation().x<=0.47062448038075105  && puntero.getWorldRotation().z<=1.50){
        this.lleno=false;
        console.log("Listo, debo de llenarlo")
      }
  }else if(this.holder.getDistancia(puntero)<=66.5){
    if(!this.lleno){
      this.actualizarJarra(this.holder.get());
      this.recoger=false;
      setTimeout(function(){
        this.recoger=true;
        this.lleno=true;
        console.log("Recoger la jarra");
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