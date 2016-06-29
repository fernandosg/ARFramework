function Animacion(){	
	this.request=0;
}

Animacion.prototype.easein={
	mostrado:false,
	mostrar:function(objeto,limit_z,limit_z_fuera,animation){		
		window.requestAnimationFrame(function(){
        	animation.easein.mostrar(objeto,limit_z,limit_z_fuera,animation);
        });
		if(objeto.position.z<=limit_z){
			objeto.position.z+=100
			animation.easein.mostrado=true; 		 
		}else if(animation.easein.mostrado){
			limit_z_ocultar=limit_z_fuera;
			setTimeout(function(){
				animation.easein.ocultar(objeto,limit_z,limit_z_ocultar,animation);				
				animation.easein.mostrado=false;
			},3000)
		}
	},
	ocultar:function(objeto,limit_z,limit_z_oculta,animation){
		if(objeto.position.z>limit_z_ocultar){
			objeto.position.z-=100;	
			window.requestAnimationFrame(function(){	        	
				animation.easein.ocultar(objeto,limit_z,limit_z_ocultar,animation);	
	        });
		}else
			animation.easein.mostrado=false;
	}
}

Animacion.prototype.mostrar=function(objeto,grados){
	if(objeto.getGradosActual()<=grados){
		var parent=this;
		/*
        window.requestAnimationFrame(function(){
        	animation.mostrar(objeto,animation,grados);
        });*/            			
		objeto.rotarY(THREE.Math.degToRad(objeto.getGradosActual()));
        objeto.incrementGrados();
		requestAnimationFrame(parent.mostrar.bind(parent,objeto,grados));        
    }else{
    	console.log("se acabo");
    }
}

Animacion.prototype.ocultar=function(objeto){
	 if(objeto.getGradosActual()>=0){
	 	var parent=this;
        /*window.requestAnimationFrame(function(){
            animation.ocultar(objeto,animation);
        });*/         
		requestAnimationFrame(function(){
			parent.ocultar(objeto).bind(parent)
		})
        objeto.rotarY(THREE.Math.degToRad( objeto.getGradosActual()));
        objeto.decrementGrados();
    }else{
    	console.log("se acabo");
    }
}
module.exports=Animacion;

