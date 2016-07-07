function Tienda(){
	
}

Tienda.prototype.init=function(stage){
	stage.vaso=new this.Elemento(52,122,new THREE.PlaneGeometry(52,122));
	stage.vaso.init();
  stage.vaso.etiqueta("Detector");
  stage.vaso.definir("../../assets/img/tienda/vaso.png",stage.vaso);
  stage.vaso.position({x:-150,y:-90,z:-600});
  stage.jarra=new this.Elemento(129,154,new THREE.PlaneGeometry(129,154));
  stage.jarra.init();
  stage.jarra.etiqueta("Jarra");
  stage.jarra.definir("../../assets/img/tienda/jarra.png",stage.jarra);
  stage.jarra.position({x:90,y:-90,z:-600});
  stage.recoger=false;
  stage.puntero=new this.Elemento(61,60,new THREE.PlaneGeometry(61,60));
	stage.puntero.init();
	stage.puntero.definir("./assets/img/mano_escala.png",stage.puntero);	
	stage.puntero.get().position.z=-1;
	stage.puntero.get().matrixAutoUpdate = false;
  	stage.puntero.get().visible=false;
  	this.anadir(stage.vaso.get());
  	this.anadir(stage.jarra.get());
  	this.anadirMarcador({id:16,callback:stage.fnAfter,puntero:stage.puntero.get()});
  	this.allowDetect(true);
}

Tienda.prototype.loop=function(stage){

}

Tienda.prototype.logica=function(puntero){
	//if(this.jarra.getDistancia(puntero)<=30)
		//Translate the coordinate from 3d plane to 2d here, and set to Jarra object	
}

Tienda.prototype.fnAfter=function(puntero){
	puntero.visible=true;	
	if(puntero.getWorldPosition().z>300 && puntero.getWorldPosition().z<=500){    //this.logica.call(this,puntero); 
    var data=[puntero.getWorldPosition(),puntero.getWorldRotation(),puntero.getWorldQuaternion()];
    this.jarra.position({x:data[0].x,y:data[0].y});
    this.jarra.rotation({x:data[1].x,y:data[1].y,z:data[1].z});
    this.jarra.quaternion({x:data[2].x,y:data[2].y,z:data[2].z});
  }
}

module.exports=Tienda;