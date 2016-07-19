function Elemento(width_canvas,height_canvas,geometry){
    this.width=width_canvas;
    this.height=height_canvas;
    this.geometry=geometry,this.origen=new THREE.Vector2(),this.cont=0,this.estado=true,this.escalas=new THREE.Vector3(),this.posiciones=new THREE.Vector3();       
    this.callbacks=[];
}
    
Elemento.prototype.cambiarUmbral=function(escala){     
    this.umbral_colision=this.width/4;
}  

Elemento.prototype.next=function(callback){
    this.callbacks.push(callback);
}
Elemento.prototype.init=function(){
    this.elemento_raiz=new THREE.Object3D();
    this.geometria_atras=this.geometry.clone();
    this.textureLoader = new THREE.TextureLoader();
    this.cambiarUmbral(1);        
    this.checkingcalls=setInterval(this.iterateCalls.bind(this),1500);
    // ^ CHECK - This method for treat events when something need to be execute and used the mesh object, it's not so clean, check later
}

Elemento.prototype.iterateCalls=function(){
    if(this.elemento_raiz!=undefined){
        if(this.elemento_raiz.children.length>0){
            while(this.callbacks.length>0){
                this.callbacks[0]();
                this.callbacks.pop();
            }
            clearInterval(this.checkingcalls);
        }
    }
}


Elemento.prototype.etiqueta=function(etiqueta){
    this.nombre=etiqueta
}

Elemento.prototype.dimensiones=function(){
    return " "+width+" "+height;        
}

Elemento.prototype.calculoOrigen=function(){
    this.x=(this.posiciones.x+(this.width/2));
    this.y=(this.posiciones.y+(this.height/2));
    this.z=this.posiciones.z;
}

Elemento.prototype.cambiarVisible=function(){
    this.elemento_raiz.visible=this.elemento_raiz.visible ? false : true;
}

/*
        Elemento.prototype.calculoAncho=function(height_test){
            vFOV = Math.PI/4;
            height = 2 * Math.tan( Math.PI/8 ) * Math.abs(elemento_raiz.position.z-camera.position.z);
            fraction = height_test / height;
        }*/

        

Elemento.prototype.definirBackground=function(color){
    color_t=new THREE.Color(color);
    this.material_frente=new THREE.MeshBasicMaterial({color: color_t,side: THREE.DoubleSide}); 
    this.mesh=new THREE.Mesh(this.geometry,this.material_frente);
    this.elemento_raiz.add(this.mesh);      
    this.defineBox();
    this.box=new THREE.Box3().setFromObject(this.elemento_raiz);
}

Elemento.prototype.definir=function(ruta){  
    this.textureLoader.load( ruta, function(texture) {
        this.actualizarMaterialFrente(texture);
    }.bind(this));
}


Elemento.prototype.actualizarMaterialAtras=function(texture2){
    this.textura_atras = texture2.clone();
    this.textura_atras.minFilter = THREE.LinearFilter;
    this.textura_atras.magFilter = THREE.LinearFilter;
    this.material_atras=new THREE.MeshBasicMaterial({map:this.textura_atras});  
    this.material_atras.transparent=true;

    this.geometria_atras.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI ) );
    this.mesh2=new THREE.Mesh(this.geometria_atras,this.material_atras);
    this.elemento_raiz.add(this.mesh2);      
    this.defineBox();
    this.textura_atras.needsUpdate = true;
}

Elemento.prototype.actualizarMaterialFrente=function(texture1){
    this.textura_frente = texture1.clone();
    this.textura_frente.minFilter = THREE.LinearFilter;
    this.textura_frente.magFilter = THREE.LinearFilter;
    this.material_frente=new THREE.MeshBasicMaterial({map:this.textura_frente,side: THREE.DoubleSide});  
    this.material_frente.transparent=true;
    this.mesh=new THREE.Mesh(this.geometry,this.material_frente);
    this.elemento_raiz.add(this.mesh);      
    this.defineBox();
    this.textura_frente.needsUpdate = true;
}

Elemento.prototype.definirCaras=function(frontal,trasera,objeto){    
    this.textureLoader.load( frontal, function(texture1) {
        this.actualizarMaterialFrente(texture1);
        this.textureLoader.load(trasera, function(texture2) {                    
            this.actualizarMaterialAtras(texture2);                                       
        }.bind(this));  
    }.bind(this));
            
}

Elemento.prototype.getTexturaAtras=function(){
    return this.textura_atras;
}

Elemento.prototype.getTexturaFrente=function(){
    return this.textura_frente;
}

Elemento.prototype.getMaterialAtras=function(){
    return this.material_atras;
}

Elemento.prototype.getMaterialFrente=function(){
    return material_frente;
}

Elemento.prototype.getDimensiones=function(){
    return {width:width,height:height,position:posiciones,geometry:elemento_raiz.geometry};
}

Elemento.prototype.get=function(){
    return this.elemento_raiz;
}

Elemento.prototype.actualizarMedidas=function(){
    this.width=this.width*this.elemento_raiz.scale.x;
    this.height=this.height*this.elemento_raiz.scale.y;
    this.cambiarUmbral(1);
}

Elemento.prototype.scale=function(x,y){
    this.elemento_raiz.scale.x=x;
    this.elemento_raiz.scale.y=y;        
    this.actualizarMedidas();
}

Elemento.prototype.position=function(pos){
    for(var prop in pos){
        this.elemento_raiz.position[prop]=pos[prop]
    }
    this.x=pos.x;
    this.y=pos.y;
    this.posiciones=this.elemento_raiz.position;
    this.defineBox();
}

Elemento.prototype.rotation=function(pos){
    for(var prop in pos){
        this.elemento_raiz.rotation[prop]=pos[prop]
    }
}

Elemento.prototype.quaternion=function(pos){
    for(var prop in pos){
        this.elemento_raiz.rotation[prop]=pos[prop]
    }    
}
Elemento.prototype.incrementar=function(pos){
    for(var prop in pos){
        this.elemento_raiz.position[prop]+=pos[prop]
    }
    this.x=pos.x;
    this.y=pos.y;
    this.posiciones=this.elemento_raiz.position;
    this.defineBox();
}


Elemento.prototype.visible=function(){
    this.elemento_raiz.visible=true;
}


Elemento.prototype.actualizar=function(){
    for(var i=0;i<this.elemento_raiz.children.length;i++){
        if(this.elemento_raiz.children[i].material.map)
            this.elemento_raiz.children[i].material.map.needsUpdate=true;
    }
    if(this.x!=this.elemento_raiz.position.x ||this.y!=this.elemento_raiz.position.y){           
        this.x=this.elemento_raiz.position.x;
        this.y=this.elemento_raiz.position.y;
        this.posiciones.x=this.elemento_raiz.position.x;
        this.posiciones.y=this.elemento_raiz.position.y;
        this.posiciones.z=this.elemento_raiz.position.z;
        this.calculoOrigen();
    }
}

       

Elemento.prototype.dispatch=function(mano){       
    distancia=this.getDistancia(mano);
    return distancia>0 && distancia<=43;//return medidas1.distanceTo(medidas2); 

}

Elemento.prototype.defineBox=function(){    
    this.box=new THREE.Box3().setFromObject(this.elemento_raiz);
}

Elemento.prototype.getDistancia=function(mano){
    box_mano=new THREE.Box3().setFromObject(mano);    
    pos1=box_mano.center().clone();
    pos1.z=0;
    pos2=this.box.center().clone();
    pos2.z=0;
    return Math.sqrt(Math.pow((pos1.x-pos2.x),2)+Math.pow((pos1.y-pos2.y),2));
}

Elemento.prototype.abajoDe=function(puntero){
    var aument=(arguments.length>1) ? arguments[1] : 0;
     return ((this.box.max.x+aument>=puntero.getWorldPosition().x && (this.box.min.x)<=puntero.getWorldPosition().x)
        && (this.box.min.y<puntero.getWorldPosition().y))              
}


Elemento.prototype.colisiona=function(mano){   
    distancia=this.getDistancia(mano);
    return distancia>0 && distancia<=43;//return medidas1.distanceTo(medidas2); 

}

Elemento.prototype.getEtiqueta=function(){
    console.log(this.nombre);
}

Elemento.prototype.getGradosActual=function(){
    return this.cont;
}

Elemento.prototype.rotarY=function(grados){
    this.elemento_raiz.rotation.y=grados;
}

Elemento.prototype.incrementGrados=function(){
    this.cont++;
}

Elemento.prototype.decrementGrados=function(){
    this.cont--;
}

Elemento.prototype.easein=function(animacion){
    animacion.easein.mostrar(this.get(),-800,-2500,animacion);
}

Elemento.prototype.voltear=function(animacion){
    this.estado=(this.estado) ? false : true;
    if(this.estado){
        animacion.ocultar(this);//this.ocultar(this);
    }else{
        animacion.mostrar(this,180);
    }
}


Elemento.prototype.getNombre=function(){
    return this.nombre;
}

Elemento.prototype.esParDe=function(objeto){      
    return this.getNombre()==objeto.getNombre() && this.elemento_raiz.id!=objeto.get().id;
}

Elemento.prototype.igualA=function(objeto){
    return this.elemento_raiz.id==objeto.get().id;
}

Elemento.prototype.getOrigen=function(){
    return origen;
}

Elemento.prototype.getUmbral=function(){
    return this.umbral_colision;
}



Elemento.prototype.actualizarPosicionesYescala=function(posicion,escala){
    this.posiciones.x=posicion.x;
    this.posiciones.y=posicion.y;
    this.posiciones.z=posicion.z;
    this.escalas.x=escala.x;
    this.escalas.y=escala.y;
    this.escalas.z=escala.z;
    this.elemento_raiz.position=posicion;
    this.elemento_raiz.scale=escala;
    this.calculoOrigen();
}
module.exports=Elemento;