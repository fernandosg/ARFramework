class Animacion{
	constructor(){
		this.easein_configuration={
			limit_z:-800,
			limit_z_out:-2500
		}
	}

	showIn(object){
			object.get().position.z+=100
	}

	showAndHide(object){
		if(object.get().position.z<=this.easein_configuration.limit_z){
			showIn(object);
			window.requestAnimationFrame(function(){
						this.showAndHide(object);
					}.bind(this));
			object.setState(true);
		}else if(object.getState()){
			setTimeout(function(){
				this.hideOut(object);
			}.bind(this),3000);
		}
	}

	hideOut(object){
		if(object.get().position.z>this.easein_configuration.limit_z_out){
			object.get().position.z-=100;
			window.requestAnimationFrame(function(){
						hideOut(object)
					}.bind(this));
		}else
			object.setState(false);
	}

	turnout(object){
		object.turnState();
		if(object.getState()){
				ocultar(object);
		}else{
				mostrar(object,180);
		}
	}

	mostrar(objeto,grados){
		if(objeto.getGradosActual()<=grados){
	        window.requestAnimationFrame(function(){
	        	mostrar(objeto,grados);
	        }.bind(this));
	        objeto.rotarY(THREE.Math.degToRad(objeto.getGradosActual()));
	        objeto.incrementGrados();
	    }
	}

	ocultar(objeto){
		 if(objeto.getGradosActual()>=0){
	        window.requestAnimationFrame(function(){
	            ocultar(objeto);
	        }.bind(this));
	        objeto.rotarY(THREE.Math.degToRad( objeto.getGradosActual()));
	        objeto.decrementGrados();
	    }
	}
}
export { Animacion as default}
