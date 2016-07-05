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
	stage.canasta.position({x:160,y:-90,z:-600});
	stage.total_canastas=10;
	stage.canastas=0;
	stage.bajar=false;
	stage.altura_concluida=false;
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

Basketball.prototype.logicaBasket=function(puntero){
	this.canastas+=1;
	if(this.canastas<=this.total_canastas){
		console.log("Enceste");
		this.bajar=true;
	}else{
		console.log("Has encestado el total de canastas");	 	
		this.altura_concluida=true;
	}
}

Basketball.prototype.logica=function(puntero){	
	if(!this.altura_concluida)
	   this.observador.dispararParticular("colision",this.canasta,puntero,function(esColision,extras){
	   	if(esColision && !this.bajar)
	   		this.logicaBasket(puntero);
	   	else if(this.bajar)
			if(this.canasta.getDistancia(puntero)>=60){
				console.log("Bien, ahora vuelve a subir")
				this.bajar=false;	
			}		   	
	   }.bind(this));
	else
		console.log("ALTURA CONCLUIDA");	
}

Basketball.prototype.loop = function(stage) {
	stage.puntero.actualizar();
	stage.canasta.actualizar();
};
module.exports=Basketball;