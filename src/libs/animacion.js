function Animacion(){	
	this.pila_objetos=[];
	this.pila_objetos_animaciones={};
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
Animacion.prototype.run=function(id){
	for(var i=0,length=this.pila_objetos.length;i<length;i++){		
		if(this.pila_objetos_animaciones[this.pila_objetos[i]].params[0]["animado"]===false)
			this.pila_objetos_animaciones[this.pila_objetos[i]]["animacion"](this.pila_objetos_animaciones[this.pila_objetos[i]]);		
	}
		
}


Animacion.prototype.detectarCola=function(arguments,callback){	
	if(this.pila_objetos.indexOf(arguments[0].get().id)!=-1)
		window.cancelAnimationFrame(this.pila_objetos_animaciones[arguments[0].get().id].params[0]["req_anim"]);			
	else{
		this.pila_objetos.push(arguments[0].get().id);
		this.pila_objetos_animaciones[arguments[0].get().id]={};
	}
	this.pila_objetos_animaciones[arguments[0].get().id]["params"]=arguments;
	this.pila_objetos_animaciones[arguments[0].get().id].params[0]["animado"]=false;
	this.pila_objetos_animaciones[arguments[0].get().id]["animacion"]=callback;
}


function mostrarEvent(anim){
	if(anim.params[0].getGradosActual()<=anim.params[1]){	
		anim.params[0].rotarY(THREE.Math.degToRad(anim.params[0].getGradosActual()));
		anim.params[0].incrementGrados();
		anim.params[0]["animado"]=true;
		anim.params[0]["req_anim"]=requestAnimationFrame(mostrarEvent.bind(this,anim));
	}else{
		delete anim.params[0]["animado"];
	};		
}

function ocultarEvent(anim){
	if(anim.params[0].getGradosActual()>=0){
		anim.params[0].rotarY(THREE.Math.degToRad(anim.params[0].getGradosActual()));
		anim.params[0].decrementGrados();
		anim.params[0]["animado"]=true;
		anim.params[0]["req_anim"]=requestAnimationFrame(ocultarEvent.bind(this,anim));			
	}else{	    	   
		delete anim.params[0]["animado"];
	}
}

Animacion.prototype.mostrar=function(){
	this.detectarCola(arguments,mostrarEvent);
	this.run();
}


Animacion.prototype.ocultar=function(){		
	this.detectarCola(arguments,ocultarEvent);
	this.run();
}
module.exports=Animacion;