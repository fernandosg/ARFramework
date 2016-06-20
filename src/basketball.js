function Basketball(){
	
}

Basketball.prototype.init = function(stage) {
	stage.balon=new this.Elemento(61,60,new THREE.PlaneGeometry(61,60));
	stage.balon.init();
	stage.balon.definir("./assets/img/basket/balon.png");
	stage.balon.visible(false);
	this.anadir(stage.balon.get());
	stage.canasta=new this.Elemento(120,134,new THREE.PlaneGeometry(120,134));	
	stage.canasta.init();
	stage.canasta.definir("./assets/img/basket/canasta.png",stage.canasta);
	stage.canasta.position(30,30,-600);
	this.anadir(stage.canasta.get())
};

Basketball.prototype.fnAfter = function(stage) {
	
};

Basketball.prototype.loop = function(stage) {
	stage.balon.actualizar();
	stage.canasta.actualizar();
};
module.exports=Basketball;