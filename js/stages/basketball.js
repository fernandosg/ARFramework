function Basketball(){

}

Basketball.prototype.init = function(stage) {	
	stage.puntero=new this.Elemento(61,60,new THREE.PlaneGeometry(61,60));
	stage.puntero.init();
	stage.puntero.definir("./assets/img/basket/balon.png");	
	stage.puntero.get().position.z=-1;
	stage.puntero.get().matrixAutoUpdate = false;
  	stage.puntero.get().visible=false;
	stage.canasta=new this.Elemento(80,80,new THREE.PlaneGeometry(80,80));	
	stage.canasta.init();
	stage.canasta.definir("./assets/img/basket/canasta.png");
	stage.canasta.position({x:160,y:-90,z:-600});
	stage.canasta.get().visible=false;
	
	stage.hombro=new this.Elemento(80,80,new THREE.PlaneGeometry(80,80));	
	stage.hombro.init();
	stage.hombro.definirBackground(0xff0000);		
	stage.hombro.position({x:0,y:0,z:0});
	stage.hombro.get().matrixAutoUpdate = false;
  	stage.hombro.get().visible=false;

  	stage.cuerpo=new this.Elemento(80,80,new THREE.PlaneGeometry(80,80));	
	stage.cuerpo.init();
	stage.cuerpo.definirBackground(0xff0000);		
	stage.cuerpo.position({x:0,y:0,z:0});
  	stage.cuerpo.get().visible=false;

	stage.total_canastas=10;
	stage.canastas=0;
	stage.bajar=false;
	stage.altura_concluida=false;
	stage.posicion_canasta_anterior=undefined;
    this.observador.suscribir("colision",stage.canasta);
	this.anadir(stage.canasta.get());
	this.allowDetect(true);	
	this.anadirMarcador({id:16,callback:stage.fnAfter,puntero:stage.puntero.get()});
	this.anadirMarcador({id:1,callback:function(){},puntero:stage.hombro.get()});
	this.anadir(stage.cuerpo.get());
};

Basketball.prototype.ayuda=function(){
	document.getElementById("informacion_nivel").innerHTML="<p>Deseas reducir la altura de la canasta</p><p><button id='bajar_nivel'>Bajar nivel</button></p>";
	document.getElementById("bajar_nivel").addEventListener("click",function(){
		if(this.posicion_canasta_anterior!=undefined){
			console.log("La posicion de la canasta actual "+this.canasta.get().position.y+" la posicion anterior de la canasta "+this.posicion_canasta_anterior.y);
			var new_y=this.posicion_canasta_anterior.y-((this.canasta.get().position.y+(Math.abs(this.posicion_canasta_anterior.y)))/2)
			console.log("wow este es el nuevo posicion en "+new_y);
			this.canasta.position({y:new_y});
		}else{
			console.log("Necesitas primero hacer que la canasta se eleve");
		}			
	}.bind(this));
}


function calcularGrados(lado_a,lado_b,lado_c){
	var multiply=2*(lado_a*lado_b)
	lado_a=Math.pow(lado_a,2);
	lado_b=Math.pow(lado_b,2);
	lado_c=Math.pow(lado_c,2);
	return Math.acos((lado_a+lado_b-lado_c)/(multiply))*(180/Math.PI);
}

Basketball.prototype.fnAfter = function(puntero) {
	puntero.visible=true;
	if(puntero.getWorldPosition().z>300 && puntero.getWorldPosition().z<=500){
		if(this.hombro!=undefined)			
			this.logica.call(this,puntero);		
	}
	
};

Basketball.prototype.logicaBasket=function(puntero){
	this.canastas+=1;
	this.hombro.defineBox();
	var lado_a=this.hombro.getDistancia(puntero);
	this.cuerpo.position({x:this.hombro.get().getWorldPosition().x,y:(-1*this.hombro.get().getWorldPosition().y-distancia)});
	var lado_c=this.hombro.calculateDistance(this.cuerpo.get(),puntero);
	var lado_b=this.hombro.getDistancia(this.cuerpo.get());
	var grados=calcularGrados(lado_a,lado_b,lado_c);
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
			if(this.canasta.getDistancia(puntero)>=60 && this.canasta.get().position.y<puntero.position.y){
				console.log("Bien, ahora vuelve a subir")
				this.bajar=false;	
			}		   	
	   }.bind(this));
	else{
		this.posicion_canasta_anterior=this.canasta.get().position.clone();
		this.canasta.incrementar({y:30});
		this.altura_concluida=false;
		this.canastas=0;
		console.log("ALTURA CONCLUIDA");	
	}
}

Basketball.prototype.loop = function(stage) {
	stage.puntero.actualizar();
	stage.canasta.actualizar();
};
module.exports=Basketball;