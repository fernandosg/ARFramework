(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @file arweb
 * @author Fernando Segura Gómez, Twitter: @fsgdev
 * @version 0.2
 */

/**
 * Clase ARWeb
 * @class ARWeb
 * @constructor
 * @param {Object} - Recibe un objeto con 2 propiedades, WIDTH: Ancho del canvas, HEIGHT: Alto del canvas
*/
function ARWeb(configuration){//
  var Animacion=require('./utils/animacion.js');
  var Escenario=require("./class/escenario.js");
  var WebcamStream=require("./utils/webcamstream.js");
  var DetectorAR=require("./utils/detector_ar");
  var Mediador=require("./utils/Mediador.js");
  var PositionUtil=require("./utils/position_util.js");
  this.Elemento=require("./class/elemento.js");
  this.position_util=new PositionUtil();
  this.configuration=configuration;
  this.mediador=new Mediador();
  this.webcam=new WebcamStream({"WIDTH":configuration.WIDTH,"HEIGHT":configuration.HEIGHT});
  this.renderer=new THREE.WebGLRenderer();
  this.renderer.autoClear = false;
  this.objetos=[]
  this.renderer.setSize(configuration.WIDTH,configuration.HEIGHT);
  //Should be use "ra" in the example of Memorama
  document.getElementById(configuration.canvas_id).appendChild(this.renderer.domElement);
  this.detector_ar=DetectorAR(this.webcam.getCanvas());
  this.detector_ar.init();
  this.animacion=new Animacion();
  this.planoEscena=new Escenario();
  this.realidadEscena=new Escenario();
  this.videoEscena=new Escenario();
  this.stages=[];
  this.refresh_object=[];
}

/**
 * @function getAnimation
 * @memberof ARWeb
 * @summary Retorna una instancia de Animacion.js
 * @returns {Animacion}
*/
ARWeb.prototype.getAnimation=function(){
  return this.animacion;
}

/**
 * @function addToScene
 * @memberof ARWeb
 * @summary Se encarga de agregar un objeto a la escena, e identificar si el objeto es "accionable" (debe de actualizarse/redibujarse)
 * @param {Elemento} object - Recibe el objeto, una instancia de
 * @param {Boolean} is_an_object_actionable - Un valor booleano para identificar si es accionable
 * @returns {ARWeb} - Retorna una instancia de ARWeb, lo que permite aplicar encadenamiento de métodos
*/
ARWeb.prototype.addToScene=function(object,is_an_object_actionable){
  this.planoEscena.anadir(object.get());
  this.refresh_object.push(is_an_object_actionable);
  this.objetos.push(object);
  return this;
}

/**
 * @function checkLenghtObjects
 * @memberof ARWeb
 * @summary Retorna el total de objetos agregados a escena.
 * @returns {integer}
*/
ARWeb.prototype.checkLenghtObjects=function(){
  return this.objetos.length;
}

/**
 * @function getObject
 * @memberof ARWeb
 * @summary Retorna un objeto dependiendo de la posición en la cual se haya agregado a escena.
 * @param {Integer} position - Valor entero correspondiente a la posición a buscar.
 * @returns {Elemento} - Retorna el objeto, instancia de Elemento.js
*/
ARWeb.prototype.getObject=function(position){
  return this.objetos[position];
}

/**
 * @function getWidth
 * @memberof ARWeb
 * @summary Retorna el ancho del canvas
 * @returns {Integer}
*/
ARWeb.prototype.getWidth=function(){
  return this.configuration.WIDTH;
}

/**
 * @function getHeight
 * @memberof ARWeb
 * @summary Retorna el alto del canvas
 * @returns {Integer}
*/
ARWeb.prototype.getHeight=function(){
  return this.configuration.HEIGHT;
}

/**
 * @function init
 * @memberof ARWeb
 * @summary Función necesaria para inicializar dependencias internas
*/
ARWeb.prototype.init=function(){
  this.planoEscena.initCamara(function(){
    this.camara=new THREE.PerspectiveCamera();
    this.camara.near=0.1;
    this.camara.far=2000;
    this.camara.updateProjectionMatrix();
  });
  this.cantidad_cartas=4;
  this.realidadEscena.initCamara();
  this.videoEscena.initCamara();
  this.videoEscena.anadir(this.webcam.getElemento());
  this.detector_ar.setCameraMatrix(this.realidadEscena.getCamara());
}

/**
 * @function createElement
 * @memberof ARWeb
 * @summary Crea un elemento, instancia de Elemento.js
 * @param {Object} configuration - Objeto con 3 propiedades, WIDTH: Ancho del objeto, HEIGHT: Alto del objeto, GEOMETRY: Geometria del objeto
 * @returns {Elemento} - Retorna la instancia creada de la función Elemento.js
*/
ARWeb.prototype.createElement=function(configuration){
  return new this.Elemento(configuration.WIDTH,configuration.HEIGHT,configuration.GEOMETRY);
}

/**
 * @function addStage
 * @memberof ARWeb
 * @summary Añadie un "nivel" al framework, facilitando el paso de un nivel a otro
 * @param {Function} - Función con 2 métodos, finishStage y start
*/
ARWeb.prototype.addStage=function(stage){
  this.stages.push(stage);
}

/**
 * @function start
 * @memberof ARWeb
 * @summary Inicia el redibujado y el nivel actual.
*/
ARWeb.prototype.start=function(){
  this.stages[0].start();
  this.loop();
}

/**
* @function addMarker
* @memberof ARWeb
* @summary Agrega un marcador a la instancia de DetectorAR, donde una vez que se identifique el marcador se ejecutara el callback especificado
* @param {Object} marcador - Un objeto con 3 propiedades
* 1) id (integer - es el identificador que ocupa JSArtoolkit para un marcador especifico),
* 2) callback (function - es la función a ejecutar una vez que el marcador se haya detectado),
* 3) puntero (THREE.Object3D - es el objeto el cual tendra la posicion del marcador detectado)
*/
ARWeb.prototype.addMarker=function(marcador){
  this.detector_ar.addMarker.call(this,marcador);
  if(marcador.puntero!=undefined)
  this.realidadEscena.anadir(marcador.puntero);
  return this;
}


/**
 * @function attach
 * @memberof ARWeb
 * @summary Adjunta un marcador con el id de un marcador especifico. Esto permite hacer obligatorio el detectar ambios marcadores
 * @param {Integer} parent_id - El id del marcador "padre"
 * @param {Object} marker - El objeto marcador
*/
ARWeb.prototype.attach=function(parent_id,marker){
  this.detector_ar.getMarker(parent_id).attach(marker);
  this.addMarker(marker);
  return this;
}


/**
* @function allowDetect
* @memberof ARWeb
* @summary Permite definir si la librería debe realizar la detección del marcador o no.
* @param {boolean} enable_detect - Una bandera booleana que identifique si se debe de detectar los marcadores (true) o no (false)
*/
ARWeb.prototype.allowDetect=function(enable_detect){
  this.detecting_marker=boolean;
}

ARWeb.prototype.allowedDetected=function(){
  return this.detecting_marker;
}

/**
* @function loop
* @memberof ARWeb
* @summary Esta función se estara ejecutando finitamente hasta que se cierre la aplicación.
* Se encargara del redibujo de todos los elementos agregados a escena y la actualización del canvas con la transmisión de la webcam.
*/
ARWeb.prototype.loop=function(){
  this.renderer.clear();
  this.videoEscena.update.call(this,this.videoEscena);
  this.planoEscena.update.call(this,this.planoEscena);
  this.realidadEscena.update.call(this,this.realidadEscena);
  this.webcam.update();
  if(this.detecting_marker)
  this.detector_ar.detectMarker(this.stages[0]);
  for(var i=0;i<this.objetos.length;i++)
    if(this.refresh_object[i]==true)
      this.objetos[i].actualizar();
  if(this.stages.length>0){
    this.stages[0].loop();
    requestAnimationFrame(this.loop.bind(this));
  }
}

/**
* @function watch
* @memberof ARWeb
* @summary Agrega el ultimo objeto agregado a la "escucha" de cierto evento, una vez se dispare dicho evento, un callback es lanzado
* @param {String} action - Un string identificando un "tema" a la escucha.
* @param {Function} event_to_dispatch - Una función la cual será lanzada cuando el mediador se comunique con dicho objeto que este a la escucha del tema.
*/
ARWeb.prototype.watch=function(action,event_to_dispatch){
  this.mediador.suscribir(action,this.objetos[this.objetos.length-1],event_to_dispatch);
}

/**
* @function removeWatch
* @memberof ARWeb
* @summary Elimina un objeto a la escucha de un "tema"
* @param {String} action - Un string identificando un "tema" a la escucha el cual servira para dar de baja el objeto.
* @param {Elemento} object - El objeto que se dará de baja de la escucha del tema
*/
ARWeb.prototype.removeWatch=function(action,object){
  this.mediador.baja(action,object);
}

/**
* @function dispatch
* @memberof ARWeb
* @summary Dispara un evento, el cual el objeto Mediador se encargará de hablar con todos los elementos que esten a la escucha de dicho evento.
* @param {String} action - Un string identificando un "tema" a la escucha.
* @param {Array} params_for_event_to_dispatch - Un arreglo con instancias de Elemento, estas instancias se usarán como parametros, dependiendo del callback agregado al momento de agregar a la escucha con el método "watch"
* @param {Function} callback - Método que se ejcutará si la condición se cumple (la función agregada al método watch, usará params_for_event_to_dispatch y lo que retorne se enviara al callback definido aqui)
*/
ARWeb.prototype.dispatch=function(action,params_for_event_to_dispatch,callback){
  this.mediador.comunicar(action,params_for_event_to_dispatch,callback,this.stages[0]);
}

/**
* @function individualDispatch
* @memberof ARWeb
* @summary Dispara un evento, a un objeto en particular usando el objeto Mediador se encargará de hablar con el si esta a la escucha de dicho tema.
* @param {String} action - Un string identificando un "tema" a la escucha.
* @param {Elemento} object - Objeto particular el cual se disparará el evento
* @param {Array} params_for_event_to_dispatch - Un arreglo con instancias de Elemento, estas instancias se usarán como parametros, dependiendo del callback agregado al momento de agregar a la escucha con el método "watch"
* @param {Function} callback - Método que se ejcutará si la condición se cumple (la función agregada al método watch, usará params_for_event_to_dispatch y lo que retorne se enviara al callback definido aqui)
*/
ARWeb.prototype.individualDispatch=function(action,object,params_for_event_to_dispatch,callback){
  this.mediador.comunicarParticular(action,object,params_for_event_to_dispatch,callback.bind(this.stages[0]));
}

/**
* @function changeThreshold
* @memberof ARWeb
* @summary Cambia el umbral usado por JSArtoolkit
* @param {Integer} i - Un valor entero entre 1 y 200.
*/
ARWeb.prototype.changeThreshold=function(i){
  this.detector_ar.cambiarThreshold(i);
}

/**
* @function canDetectMarker
* @memberof ARWeb
* @summary Identifica si en el nivel actual se detectó un marcador.
* @param {Function} stage - El nivel el cual buscará si detecto un marcador.
* @returns {Boolean} - Retorna verdadero o falso dependiendo si detecto un marcador o no.
*/
ARWeb.prototype.canDetectMarker=function(stage){
  return this.detector_ar.detectMarker(stage);
}

/**
* @function clean
* @memberof ARWeb
* @summary Limpia todos los elementos en escena.
*/
ARWeb.prototype.clean=function(){
  this.planoEscena.limpiar();
  this.realidadEscena.limpiar();
  this.detector_ar.cleanMarkers();
  this.objetos=[];
}

/**
* @function finishStage
* @memberof ARWeb
* @summary Finaliza el nivel actual.
*/
ARWeb.prototype.finishStage=function(){
  this.clean();
  this.stages.shift();
  if(this.stages.length>0)
    this.stages[0].start();
}

window.ARWeb=ARWeb;

},{"./class/elemento.js":2,"./class/escenario.js":3,"./utils/Mediador.js":5,"./utils/animacion.js":6,"./utils/detector_ar":7,"./utils/position_util.js":9,"./utils/webcamstream.js":10}],2:[function(require,module,exports){
/**
 * @file Elemento
 * @author Fernando Segura Gómez, Twitter: @fsgdev
 * @version 0.1
 */
 /**
  * Clase Elemento
  * @class Elemento
  * @constructor
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


Elemento.prototype.cambiarUmbral=function(escala){
    this.umbral_colision=this.width/4;
}

Elemento.prototype.next=function(callback){
    this.callbacks.push(callback);
}


/**
 * @function init
 * @memberof Elemento
 * @summary Inicializa el objeto raiz (la instancia de THREE.Object3D), la geometria de la superficie trasera del objeto, y una utilidad para descargar una textura sobre el objeto
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
 * @function etiqueta
 * @memberof Elemento
 * @summary Permite definir una etiqueta al objeto (es un string que identifica este de otros objetos)
 * @param {String} etiqueta - String representando la etiqueta del objeto.
*/
Elemento.prototype.label=function(etiqueta){
    this.nombre=etiqueta
}


/**
 * @function calculoOrigen
 * @memberof Elemento
 * @summary Se calcula la posicion del centro en X,Y y Z del objeto
*/
Elemento.prototype.calculoOrigen=function(){
    this.x=(this.posiciones.x+(this.width/2));
    this.y=(this.posiciones.y+(this.height/2));
    this.z=this.posiciones.z;
}



/**
 * @function defineSurfaceByColor
 * @memberof Elemento
 * @summary Permite definir la superficie del objeto con un color.
 * @param {THREE.Color} color - Una instancia de THREE.Color
*/
Elemento.prototype.defineSurfaceByColor=function(color){
    color_t=new THREE.Color(color);
    this.material_frente=new THREE.MeshBasicMaterial({color: color_t,side: THREE.DoubleSide});
    this.mesh=new THREE.Mesh(this.geometry,this.material_frente);
    this.elemento_raiz.add(this.mesh);
}




/**
 * @function actualizarMaterialAtras
 * @memberof Elemento
 * @summary Permite definir la superficie trasera del objeto.
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
 * @function actualizarMaterialFrente
 * @memberof Elemento
 * @summary Permite definir la superficie de enfrente del objeto.
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
 * @function get
 * @summary Permite definir el objeto THREE.Object3D del elemento
 * @returns {THREE.Object3D}
*/
Elemento.prototype.get=function(){
    return this.elemento_raiz;
}


/**
 * @function actualizarMedidas
 * @memberof Elemento
 * @summary Permite definir las dimensiones del elemento
*/
Elemento.prototype.actualizarMedidas=function(){
    this.width=this.width*this.elemento_raiz.scale.x;
    this.height=this.height*this.elemento_raiz.scale.y;
    this.cambiarUmbral(1);
}


/**
 * @function scale
 * @memberof Elemento
 * @summary Permite escalar las medidas de un objeto
 * @param {Double} x - Un valor con punto decimal el cual sirve para definir a que valor se tiene que escalar el elemento_raiz en X
 * @param {Double} y - Un valor con punto decimal el cual sirve para definir a que valor se tiene que escalar el elemento_raiz en y
*/
Elemento.prototype.scale=function(x,y){
    this.elemento_raiz.scale.x=x;
    this.elemento_raiz.scale.y=y;
    this.actualizarMedidas();
}

/**
 * @function position
 * @memberof Elemento
 * @summary Permite definir la posicion de un elemento
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

},{"../utils/position_util.js":9}],3:[function(require,module,exports){
/**
 * @file Escenario
 * @author Fernando Segura Gómez, Twitter: @fsgdev
 * @version 0.2
 */

/**
 * Clase Escenario
 * @class Escenario
 * @constructor
*/
function Escenario(){
	this.escena=new THREE.Scene();
}

/**
 * @function initCamara
 * @memberof Escenario
 * @summary Permite inicializar la cámara que se encargara de observar este escenario
 * @param {Function} - (Opcional) Esta función se ejecutara usando el ambito de la función Escenario. Sirve principalmente para definir una configuración predefinida para la cámara
*/
Escenario.prototype.initCamara=function(fn){
	if(fn==undefined){
		this.camara=new THREE.Camera();
	}else
		fn.call(this);
}


/**
 * @function anadir
 * @memberof Escenario
 * @summary Permite inicializar la cámara que se encargara de observar este escenario
 * @param {THREE.Object3D} - Es el objeto que se añadira al escenario
*/
Escenario.prototype.anadir=function(elemento){
	this.escena.add(elemento);
}


/**
 * @function getCamara
 * @memberof Escenario
 * @summary Retorna la cámara de esta escena
 * @returns {THREE.Camera} - La cámara definida en este escenario
*/
Escenario.prototype.getCamara=function(){
	return this.camara;
}


/**
 * @function update
 * @memberof Escenario
 * @summary Renderiza el escneario
 * @param {THREE.Scene}
*/
Escenario.prototype.update=function(scene){
	this.renderer.render(scene.escena,scene.camara);
	this.renderer.clearDepth();
}


/**
 * @function limpiar
 * @memberof Escenario
 * @summary Limpia todos los elementos en la escena
*/
Escenario.prototype.limpiar=function(){
	while(this.escena.children.length>0)
		this.escena.remove(this.escena.children[0]);
}
module.exports=Escenario;

},{}],4:[function(require,module,exports){
module.exports=function(width,height){
	//var Labels=function(){
		var canvas,context,material,textura,sprite,x_origen,y_origen;
		function init(){
			canvas=document.createElement("canvas");
			canvas.width=width;
			canvas.height=height;
			context=canvas.getContext("2d");
		}
		var definir=function(parametros){
			context.fillStyle=parametros.color;
			context.textAlign=parametros.alineacion;
			context.font=parametros.tipografia;	
			x_origen=parametros.x;
			y_origen=parametros.y;
		}

		var crear=function(texto){
			context.fillText(texto,x_origen,y_origen);
			textura = new THREE.Texture(canvas);
			textura.minFilter = THREE.LinearFilter;
			textura.magFilter = THREE.LinearFilter;
		    textura.needsUpdate = true;

		    var material = new THREE.SpriteMaterial({
		        map: textura,
		        transparent: false,
		        useScreenCoordinates: false,
		        color: 0xffffff // CHANGED
		    });

		    sprite = new THREE.Sprite(material);
		    sprite.scale.set(15,15, 1 ); // CHANGED
		    return sprite;
		}

		var actualizar=function(texto){		
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.fillText(texto,x_origen,y_origen);
			textura.needsUpdate=true;
		}
		return{
			init:init,
			definir:definir,
			crear:crear,
			actualizar:actualizar
		}

	//}
}
},{}],5:[function(require,module,exports){
/**
 * @file Mediador
 * @author Fernando Segura Gómez, Twitter: @fsgdev
 * @version 0.1
 */

 /**
  * Clase Mediador
  * @class Mediador
  * @constructor
 */
function Mediador(){
	this.lista_eventos={};
	this.lista_eventos_a_disparar={};
};


/**
 * @function suscribir
 * @memberof Mediador
 * @summary Permite suscribir un evento a la escucha que el Mediador ocupara para comunicar a ciertos objetos que esten escuchando a dicho evento
 * @param {String} evento - El evento que el Mediador ocupara para comunicarse con el objeto añadido.
 * @param {Elemento} objeto - El objeto el cual puede tener comunicación con el Mediador con un evento especifico.
*/
Mediador.prototype.suscribir=function(evento,objeto,event){
	if(!this.lista_eventos[evento]) this.lista_eventos[evento]=[];
	if(this.lista_eventos[evento].indexOf(objeto)==-1){
		this.lista_eventos[evento].push(objeto);
		this.lista_eventos_a_disparar[objeto.get().id]=event;
	}
}


/**
 * @function comunicar
 * @memberof Mediador
 * @summary Evento comunicar
 * @param {String} evento
 * @param {Elemento} objeto
 * @param {Function} callback
 * @param {extras} Object
*/
Mediador.prototype.comunicar=function(evento,params_for_event_to_dispatch,callback,stage){//Mediador.prototype.comunicar=function(evento,objeto,callback,stage){
	if(!this.lista_eventos[evento]) return;
	for(var i=0;i<this.lista_eventos[evento].length;i++){
		objeto_action=this.lista_eventos[evento][i];
		var new_params=params_for_event_to_dispatch.slice();
		new_params.push(objeto_action);
		callback.call(stage,this.lista_eventos_a_disparar[objeto_action.get().id].call(stage,new_params),objeto_action);
		//callback.call(stage,objeto_action.dispatch(objeto),objeto_action);
	}
}


/**
 * @function comunicarParticular
 * @memberof Mediador
 * @summary Evento comunicar
 * @param {String} evento
 * @param {Elemento} objeto
 * @param {Function} callback
 * @param {extras} Object
*/
Mediador.prototype.comunicarParticular=function(evento,objeto,params_for_event_to_dispatch,callback){
	if(!this.lista_eventos[evento]) return;
	var pos=this.lista_eventos[evento].indexOf(objeto);
	if(pos==-1) return;
	var new_params=params_for_event_to_dispatch.slice();
	new_params.push(objeto);
	callback(this.lista_eventos_a_disparar[this.lista_eventos[evento][pos].get().id].call(this,new_params),objeto);
	//callback(this.lista_eventos[evento][pos].dispatch(compara),extras);
}


/**
 * @function baja
 * @memberof Mediador
 * @summary Evento comunicar
 * @param {String} evento
 * @param {Elemento} objeto
*/
Mediador.prototype.baja=function(evento,objeto){
	if(this.lista_eventos[evento].indexOf(objeto)==-1) return;
	this.lista_eventos[evento].splice(this.lista_eventos[evento].indexOf(objeto),1);
}
module.exports=Mediador;

},{}],6:[function(require,module,exports){
function Animacion(){
	this.easein_configuration={
		limit_z:-800,
		limit_z_out:-2500
	}
}
Animacion.prototype.showIn=function(object){
		object.get().position.z+=100
}

Animacion.prototype.showAndHide=function(object){
	if(object.get().position.z<=this.easein_configuration.limit_z){
		this.showIn(object);
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

Animacion.prototype.hideOut=function(object){
	if(object.get().position.z>this.easein_configuration.limit_z_out){
		object.get().position.z-=100;
		window.requestAnimationFrame(function(){
					this.hideOut(object)
				}.bind(this));
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

},{}],7:[function(require,module,exports){
/**
* @file DetectorAR
* @author Fernando Segura Gómez, Twitter: @fsgdev
* @version 0.1
*/

/**
* Clase DetectorAR
* @class DetectorAR
* @constructor
* @param {Canvas} WIDTH - Recibe el elemento canvas el cual se obtendra la información para detectar el marcador
*/
function DetectorAR(canvas_element){
  var JSARRaster,JSARParameters,detector,result;
  var markers_attach={};
  var threshold=120;
  var markers={};
  var DetectorMarker;
  var rootMarker,markermatrix;
  var list_marker_id_detected=[];
  var list_marker_id_with_attachment=[];
  var in_process_detect=false;

  /**
  * @function init
  * @memberof DetectorAR
  * @summary Inicializa las dependencias y variables necesarias.
  */
  function init(){
    JSARRaster = new NyARRgbRaster_Canvas2D(canvas_element);
    DetectorMarker=require("./detectormarker.js");
    JSARParameters = new FLARParam(canvas_element.width, canvas_element.height);
    detector = new FLARMultiIdMarkerDetector(JSARParameters, 40);
    result = new Float32Array(16);
    detector.setContinueMode(true);
    JSARParameters.copyCameraMatrix(result, .1, 2000);
    THREE.Matrix4.prototype.setFromArray = function(m) {
      return this.set(
        m[0], m[4], m[8], m[12],
        m[1], m[5], m[9], m[13],
        m[2], m[6], m[10], m[14],
        m[3], m[7], m[11], m[15]
      );
    }

    THREE.Object3D.prototype.transformFromArray = function(m) {
      this.matrix.setFromArray(m);
      this.matrixWorldNeedsUpdate = true;
    }
  }


  /**
  * @function setCameraMatrix
  * @memberof DetectorAR
  * @summary Inicializa las dependencias y variables necesarias.
  * @param {THREE.Camera} realidadCamera - Recibe la cámara que observa los objetos que usaara JSArtoolkit como punteros.
  */
  var setCameraMatrix=function(realidadCamera){
    realidadCamera.projectionMatrix.setFromArray(result);
  }

  /**
  * @function getMarkerNumber
  * @memberof DetectorAR
  * @summary Obtiene el número de marcador
  * @param {Integer} idx - Recibe el id del marcador.
  */
  function getMarkerNumber(idx) {
    var data = detector.getIdMarkerData(idx);
    if (data.packetLength > 4) {
      return -1;
    }

    var result=0;
    for (var i = 0; i < data.packetLength; i++ ) {
      result = (result << 8) | data.getPacketData(i);
    }

    return result;
  }


  /**
  * @function getTransformMatrix
  * @memberof DetectorAR
  * @summary Obtiene el número de marcador
  * @param {Integer} idx - Recibe el id del marcador.
  */
  function getTransformMatrix(idx) {
    var mat = new NyARTransMatResult();
    detector.getTransformMatrix(idx, mat);

    var cm = new Float32Array(16);
    cm[0] = mat.m00*-1;
    cm[1] = -mat.m10;
    cm[2] = mat.m20;
    cm[3] = 0;
    cm[4] = mat.m01*-1;
    cm[5] = -mat.m11;
    cm[6] = mat.m21;
    cm[7] = 0;
    cm[8] = -mat.m02;
    cm[9] = mat.m12;
    cm[10] = -mat.m22;
    cm[11] = 0;
    cm[12] = mat.m03*-1;
    cm[13] = -mat.m13;
    cm[14] = mat.m23;
    cm[15] = 1;

    return cm;
  }


  /**
  * @function obtenerMarcador
  * @memberof DetectorAR
  * @summary Obtiene el número de marcador
  * @param {Integer} idx - Recibe el id del marcador.
  */
  function obtenerMarcador(markerCount,pos){
    var matriz_encontrada
    for(var i=0;i<markerCount;i++){
      if(i==pos){
        matriz_encontrada=getTransformMatrix(i);
        break;
      }
    }
    return matriz_encontrada;
  }


  /**
  * @function isAttached
  * @memberof DetectorAR
  * @summary Obtiene el número de marcador
  * @param {Integer} idx - Recibe el id del marcador.
  */
  function isAttached(id){
    return markers_attach[id]!=undefined;
  }


  /**
  * @function detectMarker
  * @memberof DetectorAR
  * @summary Obtiene el número de marcador
  * @param {Integer} idx - Recibe el id del marcador.
  */
  var detectMarker=function(stage){
    var markerCount = detector.detectMarkerLite(JSARRaster, threshold);
    var marker;
    if(markerCount>0){
      for(var i=0,marcador_id=-1;i<markerCount;i++){
        var marcador_id=getMarkerNumber(i);
        if(markers[marcador_id]!=undefined){
          if(markers[marcador_id].puntero!=undefined){
            markers[marcador_id].puntero.transformFromArray(obtenerMarcador(markerCount,i));
            markers[marcador_id].puntero.matrixWorldNeedsUpdate=true;
          }
          if(!markers[marcador_id].hasAttachments()){
            if(markers[marcador_id].callback!=undefined)
              markers[marcador_id].detected().call(stage,markers[marcador_id].puntero);
          }else{
            if(list_marker_id_with_attachment.indexOf(marcador_id)==-1)
              list_marker_id_with_attachment.push(marcador_id)
          }
          if(list_marker_id_detected.indexOf(marcador_id)==-1)
            list_marker_id_detected.push(marcador_id)
        }
      }
      if(!in_process_detect && list_marker_id_with_attachment.length>0)
        setTimeout(function(){
          in_process_detect=true;
          if(list_marker_id_with_attachment.length>0){
            for(var i=0,total_attachments=[],count_attachments=0,length=list_marker_id_with_attachment.length;i<length;i++,count_attachments=0){
              total_attachments=markers[list_marker_id_with_attachment[i]].getAttachmentsId();
              total_attachments.forEach(function(attached_id){
                if(list_marker_id_detected.indexOf(attached_id)>-1)
                  count_attachments++;
              });
              if(total_attachments.length==count_attachments)
                markers[list_marker_id_with_attachment[i]].detected().call(stage,markers[list_marker_id_with_attachment[i]].puntero);
            }
          }
          list_marker_id_with_attachment.length=0;
          list_marker_id_detected.length=0;
          in_process_detect=false;
        },350);
      return true;
    }
    return false;
  }


  /**
  * @function attach
  * @memberof DetectorAR
  * @summary Obtiene el número de marcador
  * @param {Integer} idx - Recibe el id del marcador.
  */
  var attach=function(markers_to_attach){
    var marker_list=Object.keys(markers);
    if(marker_list.length>0)
    rootMarker=markers[marker_list.pop()];
    markers_attach[rootMarker.id]=0;
    for(var i=0,length=markers_to_attach.length;i<length;i++){
      this.addMarker(markers_to_attach[i]);
      markers_attach[markers_to_attach[i].id]=0;
    }
  }


  /**
  * @function addMarker
  * @memberof DetectorAR
  * @summary Obtiene el número de marcador
  * @param {Integer} idx - Recibe el id del marcador.
  */
  var addMarker=function(marker){
    markers[marker.id]=new DetectorMarker(marker.id,marker.callback,marker.puntero);
    lastMarker=markers[marker.id];
    return markers[marker.id];
  }

  var getLastMarker=function(){
    return lastMarker;
  }

  var getMarker=function(marker_id){
    return markers[marker_id];
  }


  /**
  * @function cleanMarkers
  * @memberof DetectorAR
  * @summary Obtiene el número de marcador
  * @param {Integer} idx - Recibe el id del marcador.
  */
  var cleanMarkers=function(){
    markers={};
  }


  /**
  * @function cambiarThreshold
  * @memberof DetectorAR
  * @summary Obtiene el número de marcador
  * @param {Integer} idx - Recibe el id del marcador.
  */
  var cambiarThreshold=function(threshold_nuevo){
    threshold=threshold_nuevo;
  }

  return{
    init:init,
    attach:attach,
    setCameraMatrix:setCameraMatrix,
    detectMarker:detectMarker,
    getMarker:getMarker,
    addMarker:addMarker,
    markermatrix:markermatrix,
    cambiarThreshold:cambiarThreshold,
    cleanMarkers:cleanMarkers
  }
}

module.exports=DetectorAR;

},{"./detectormarker.js":8}],8:[function(require,module,exports){
function DetectorMarker(id,callback,puntero){
	this.id=id;
	this.callback=callback;
	this.puntero=puntero;
	this.attached=[];
	this.attached_id=[]
}

DetectorMarker.prototype.detected = function() {
	return this.callback;
};

DetectorMarker.prototype.attach=function(marker){
	this.attached_id.push(marker.id);
	this.attached.push(new DetectorMarker(marker.id,marker.callback,marker.puntero));
}

DetectorMarker.prototype.hasAttachments=function(){
	return this.attached.length>0;
}

DetectorMarker.prototype.getAttachmentsId=function(){
	return this.attached_id;
}
module.exports=DetectorMarker;

},{}],9:[function(require,module,exports){
function PositionUtil(config){
/*
	var width=config.WIDTH;
	var height=config.HEIGHT;
	var escena=config.SCENE;
	var distancia=config.DISTANCE;
*/
	var DISTANCE=(config && config.DISTANCE) || 60;
	var obtenerPosicionPantalla=function(obj){
		var vector = new THREE.Vector3();
		vector.setFromMatrixPosition(obj.matrixWorld);
		vector.project(escena.camara);
		var mitadAncho = width / 2, mitadAlto = height / 2;
		vector.x = ( vector.x * mitadAncho ) + mitadAlto;
		vector.y = -( vector.y * mitadAlto ) + mitadAlto;
		return vector;
	}

	var getDistancia=function(pos1,pos2){
		pos1.z=0;
		pos2.z=0;
		return Math.sqrt(Math.pow((pos1.x-pos2.x),2)+Math.pow((pos1.y-pos2.y),2));
	}

	var estaColisionando=function(params){
		var distancia=getDistancia(params[0],params[1]);
		return distancia>0 && distancia<=DISTANCE;
	}


	var isColliding=function(params){
		var distancia=getDistancia(params[0].getWorldPosition(),params[1].get().getWorldPosition());
		return distancia>0 && distancia<=DISTANCE;
	}


	//Handle new configuration.
	var init=function(config){
		return new PositionUtil(config);
	}

	return{
		init:init,
		obtenerPosicionPantalla:obtenerPosicionPantalla,
		getDistancia:getDistancia,
		estaColisionando:estaColisionando,
		isColliding:isColliding
	}
}
module.exports=PositionUtil;

},{}],10:[function(require,module,exports){
function WebcamStream(configuracion){
  this.canvas=document.createElement("canvas");
  this.canvas.width=configuracion["WIDTH"];
  this.canvas.height=configuracion["HEIGHT"];
  this.ctx=this.canvas.getContext("2d");
  this.video=new THREEx.WebcamTexture(configuracion["WIDTH"],configuracion["HEIGHT"]);
  var textura=this.video.texture;
  textura.minFilter = THREE.LinearFilter;
  textura.magFilter = THREE.LinearFilter;
  var material = new THREE.MeshBasicMaterial( { map: textura, depthTest: false, depthWrite: false} );//new THREE.MeshBasicMaterial( { map: textura, overdraw: true, side:THREE.DoubleSide } );
  var geometria = new THREE.PlaneGeometry(2,2,0.0);
  this.elemento = new THREE.Mesh( geometria, material );
  this.elemento.scale.x=-1;
  this.elemento.material.side = THREE.DoubleSide;
}

WebcamStream.prototype.getElemento=function(){
	return this.elemento;
}

WebcamStream.prototype.update=function(web){
	this.ctx.drawImage(this.video.video,0,0,this.canvas.width,this.canvas.height);
  this.canvas.changed=true;
  this.elemento.material.map.needsUpdate=true;
}

WebcamStream.prototype.getCanvas=function(){
	return this.canvas;
}

module.exports=WebcamStream;

},{}]},{},[2,3,4,6,7,8,5,9,10,1]);
