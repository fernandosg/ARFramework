function Animacion(){
	this.easein_configuration={
		limit_z:-800,
		limit_z_out:-2500
	}
}
Animacion.prototype.showIn=function(object){
		object.position.z+=100
		object.setState(true);
}

Animacion.prototype.showAndHide=function(object){
	if(object.position.z<=this.limit_z){
		this.showIn(object);
		window.requestAnimationFrame(function(){
					this.showAndHide(object);
				}.bind(this));
	}else if(object.getState()){
		this.hideOut(object);
		window.requestAnimationFrame(function(){
					this.showAndHide(object);
				}.bind(this));
	}
}

Animacion.prototype.hideOut=function(object){
	if(object.position.z>this.limit_z_out){
		object.position.z-=100;
	}else
		object.setState(false);
}
/*
Animacion.prototype.easein={
	mostrado:false,
	mostrar:function(objeto){
		window.requestAnimationFrame(function(){
        	this.easein.mostrar(objeto);
        }.bind(this));//
		if(objeto.position.z<=this.limit_z){
			objeto.position.z+=100
			this.easein.mostrado=true;
		}else if(this.easein.mostrado){
			setTimeout(function(){
				this.easein.ocultar(objeto);
				this.easein.mostrado=false;
			}.bind(this),3000)
		}
	},
	ocultar:function(objeto){
		if(objeto.position.z>this.limit_z_out){
			objeto.position.z-=100;
			window.requestAnimationFrame(function(){
				animation.easein.ocultar(objeto);
			}.bind(this));
		}else
			animation.easein.mostrado=false;
	}
}
*/
Animacion.prototype.turnout=function(object){
	object.turnState();
	if(object.getState()){
			this.ocultar(object);
	}else{
			this.mostrar(object,180);
	}
}

Animacion.prototype.mostrar=function(objeto,grados){
	if(objeto.getGradosActual()<=grados){
        window.requestAnimationFrame(function(){
        	this.mostrar(objeto,grados);
        }.bind(this));
        objeto.rotarY(THREE.Math.degToRad(objeto.getGradosActual()));
        objeto.incrementGrados();
    }
}

Animacion.prototype.ocultar=function(objeto){
	 if(objeto.getGradosActual()>=0){
        window.requestAnimationFrame(function(){
            this.ocultar(objeto);
        }.bind(this));
        objeto.rotarY(THREE.Math.degToRad( objeto.getGradosActual()));
        objeto.decrementGrados();
    }
}
module.exports=Animacion;
