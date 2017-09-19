 /**
  * @desc Constructor
  * @param {integer} width_canvas - El ancho del canvas que se agrego al documento HTML
  * @param {integer} height_canvas - El alto del canvas que se agrego al documento HTML
  * @param {THREE.Geometry} geometry - Instancia de una geometria para el objeto generado.
 */
function Elemento(width_canvas,height_canvas,geometry){
    this.width=width_canvas;
    this.height=height_canvas;
    this.geometry=geometry,this.origen=new THREE.Vector2(),this.cont=0,this.estado=true,this.escalas=new THREE.Vector3(),this.posiciones=new THREE.Vector3();
    this.callbacks=[];
    var PositionUtil=require("../utils/position_util.js");
    this.position_util=new PositionUtil();
}

/**
 * @desc Cambia el umbral de colision
 * @public
 * @param {integer} width_canvas - El ancho del canvas que se agrego al documento HTML
 * @param {integer} height_canvas - El alto del canvas que se agrego al documento HTML
 * @param {THREE.Geometry} geometry - Instancia de una geometria para el objeto generado.
*/
Elemento.prototype.cambiarUmbral=function(escala){
    this.umbral_colision=this.width/4;
}

Elemento.prototype.next=function(callback){
    this.callbacks.push(callback);
}


/**
 * @desc Inicializa el objeto raiz (la instancia de THREE.Object3D), la geometria de la superficie trasera del objeto, y una utilidad para descargar una textura sobre el objeto
 * @public
*/
Elemento.prototype.init=function(){
    this.elemento_raiz=new THREE.Object3D();
    this.geometria_atras=this.geometry.clone();
    this.textureLoader = new THREE.TextureLoader();
    this.cambiarUmbral(1);
    this.checkingcalls=setInterval(this.iterateCalls.bind(this),1500);
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

/**
 * @desc Permite definir una etiqueta al objeto (es un string que identifica este de otros objetos)
 * @public
 * @param {String} etiqueta - String representando la etiqueta del objeto.
*/
Elemento.prototype.label=function(etiqueta){
    this.nombre=etiqueta
}


/**
 * @desc Se calcula la posicion del centro en X,Y y Z del objeto
 * @public
*/
Elemento.prototype.calculoOrigen=function(){
    this.x=(this.posiciones.x+(this.width/2));
    this.y=(this.posiciones.y+(this.height/2));
    this.z=this.posiciones.z;
}



/**
 * @desc Permite definir la superficie del objeto con un color.
 * @public
 * @param {THREE.Color} color - Una instancia de THREE.Color
*/
Elemento.prototype.defineSurfaceByColor=function(color){
    color_t=new THREE.Color(color);
    this.material_frente=new THREE.MeshBasicMaterial({color: color_t,side: THREE.DoubleSide});
    this.mesh=new THREE.Mesh(this.geometry,this.material_frente);
    this.elemento_raiz.add(this.mesh);
}




/**
 * @desc Permite definir la superficie trasera del objeto.
 * @public
 * @param {THREE.Texture} texture2 - La textura a definir en la parte de atras del objeto
*/
Elemento.prototype.actualizarMaterialAtras=function(texture2){
    this.textura_atras = texture2.clone();
    this.textura_atras.minFilter = THREE.LinearFilter;
    this.textura_atras.magFilter = THREE.LinearFilter;
    this.material_atras=new THREE.MeshBasicMaterial({map:this.textura_atras});
    this.material_atras.transparent=true;

    this.geometria_atras.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI ) );
    this.mesh2=new THREE.Mesh(this.geometria_atras,this.material_atras);
    this.elemento_raiz.add(this.mesh2);
    this.textura_atras.needsUpdate = true;
}


/**
 * @desc Permite definir la superficie de enfrente del objeto.
 * @public
 * @param {THREE.Texture} texture1 - La textura a definir en la parte de enfrente del objeto
*/
Elemento.prototype.actualizarMaterialFrente=function(texture1){
    this.textura_frente = texture1.clone();
    this.textura_frente.minFilter = THREE.LinearFilter;
    this.textura_frente.magFilter = THREE.LinearFilter;
    this.material_frente=new THREE.MeshBasicMaterial({map:this.textura_frente,side: THREE.DoubleSide});
    this.material_frente.transparent=true;
    this.mesh=new THREE.Mesh(this.geometry,this.material_frente);
    this.elemento_raiz.add(this.mesh);
    this.textura_frente.needsUpdate = true;
}



Elemento.prototype.defineSurfaceByResource=function(frontal,trasera){
    this.textureLoader.load( frontal, function(texture1) {
        this.actualizarMaterialFrente(texture1);
        if(trasera!=undefined){
          this.textureLoader.load(trasera, function(texture2) {
              this.actualizarMaterialAtras(texture2);
          }.bind(this));
        }
    }.bind(this));
}


/**
 * @desc Permite definir el objeto THREE.Object3D del elemento
 * @public
 * @return {THREE.Object3D}
*/
Elemento.prototype.get=function(){
    return this.elemento_raiz;
}


/**
 * @desc Permite definir las dimensiones del elemento
 * @public
*/
Elemento.prototype.actualizarMedidas=function(){
    this.width=this.width*this.elemento_raiz.scale.x;
    this.height=this.height*this.elemento_raiz.scale.y;
    this.cambiarUmbral(1);
}


/**
 * @desc Permite escalar las medidas de un objeto
 * @public
 * @param {Double} x - Un valor con punto decimal el cual sirve para definir a que valor se tiene que escalar el elemento_raiz en X
 * @param {Double} y - Un valor con punto decimal el cual sirve para definir a que valor se tiene que escalar el elemento_raiz en y
*/
Elemento.prototype.scale=function(x,y){
    this.elemento_raiz.scale.x=x;
    this.elemento_raiz.scale.y=y;
    this.actualizarMedidas();
}

/**
 * @desc Permite definir la posicion de un elemento
 * @public
*/
Elemento.prototype.position=function(pos){
    for(var prop in pos){
        this.elemento_raiz.position[prop]=pos[prop]
    }
    this.x=pos.x;
    this.y=pos.y;
    this.posiciones=this.elemento_raiz.position;
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

Elemento.prototype.increase=function(pos){
    for(var prop in pos){
        this.elemento_raiz.position[prop]+=pos[prop]
    }
    this.x=pos.x;
    this.y=pos.y;
    this.posiciones=this.elemento_raiz.position;
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
    return this.position_util.estaColisionando(this.get().getWorldPosition(),mano.getWorldPosition());
}


Elemento.prototype.abajoDe=function(puntero){
    var aument=(arguments.length>1) ? arguments[1] : 0;
     return ((this.box.max.x+aument>=puntero.getWorldPosition().x && (this.box.min.x)<=puntero.getWorldPosition().x)
        && (this.box.min.y<puntero.getWorldPosition().y))
}


Elemento.prototype.colisiona=function(mano){
    var distancia=this.position_util.getDistancia(mano.getWorldPosition(),this.get().getWorldPosition());
    return distancia>0 && distancia<=43;//return medidas1.distanceTo(medidas2);

}

Elemento.prototype.getLabel=function(){
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


Elemento.prototype.turnState=function(){
    this.estado=(this.estado) ? false : true;
}

Elemento.prototype.setState=function(state){
  this.estado=state;
}

Elemento.prototype.getState=function(){//Checking if the object is visible or not
  return this.estado;
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

module.exports=Elemento;
