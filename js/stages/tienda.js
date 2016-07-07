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
  	this.anadir(stage.vaso.get());
  	this.anadir(stage.jarra.get());
  	this.allowDetect(true);
}

Tienda.prototype.loop=function(stage){

}

module.exports=Tienda;