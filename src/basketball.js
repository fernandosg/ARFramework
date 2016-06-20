function Basketball(){
	
}

Basketball.prototype.init = function(stage) {
	stage.balon=new this.Elemento(61,60,new THREE.PlaneGeometry(61,60));
	stage.balon.init();
	stage.balon.definir("./assets/img/basket/balon.png",stage.balon);
	stage.balon.visible(false);
	this.setPuntero(stage.balon.get());
	stage.canasta=new this.Elemento(120,134,new THREE.PlaneGeometry(120,134));	
	stage.canasta.init();
	stage.canasta.definir("./assets/img/basket/canasta.png",stage.canasta);
	stage.canasta.position(30,30,-600);
    this.observador.suscribir("colision",stage.canasta);
	this.anadir(stage.canasta.get());
	this.allowDetect(true);
};



Basketball.prototype.fnAfter = function(stage) {
	stage.balon.visible();	
	if(this.puntero.getWorldPosition().z>300 && this.puntero.getWorldPosition().z<=500){  
		stage.logica(this,stage);
	}
};

Basketball.prototype.logica=function(that,stage){	
   that.observador.dispararParticular("colision",stage.canasta,that.puntero,function(esColision,extras){
   	if(esColision){
   		console.log("Enceste");
   	}
   });
}

Basketball.prototype.loop = function(stage) {
	stage.balon.actualizar();
	stage.canasta.actualizar();
};
module.exports=Basketball;