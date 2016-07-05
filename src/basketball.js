function Basketball(){

}

Basketball.prototype.init = function(stage) {	
	stage.puntero=new this.Elemento(61,60,new THREE.PlaneGeometry(61,60));
	stage.puntero.init();
	stage.puntero.definir("./assets/img/basket/balon.png",stage.puntero);	
	stage.puntero.get().position.z=-1;
	stage.puntero.get().matrixAutoUpdate = false;
  	stage.puntero.get().visible=false;
	stage.canasta=new this.Elemento(80,80,new THREE.PlaneGeometry(80,80));	
	stage.canasta.init();
	stage.canasta.definir("./assets/img/basket/canasta.png",stage.canasta);
	stage.canasta.position({x:160,y:-160,z:-600});
    this.observador.suscribir("colision",stage.canasta);
	this.anadir(stage.canasta.get());
	this.allowDetect(true);
	this.anadirMarcador({id:16,callback:stage.fnAfter,puntero:stage.puntero.get()});
};



Basketball.prototype.fnAfter = function(puntero) {
	puntero.visible=true;
	if(puntero.getWorldPosition().z>300 && puntero.getWorldPosition().z<=500)
		this.logica.call(this,puntero);	
	
};

Basketball.prototype.logica=function(puntero){	
   this.observador.dispararParticular("colision",this.canasta,puntero,function(esColision,extras){
   	if(esColision){
   		console.log("Enceste");
   	}
   });
}

Basketball.prototype.loop = function(stage) {
	stage.puntero.actualizar();
	stage.canasta.actualizar();
};
module.exports=Basketball;