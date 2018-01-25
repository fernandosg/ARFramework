/**
 * @file arweb
 * @author Fernando Segura Gómez, Twitter: @fsgdev
 * @version 0.2
 */

/**
 * Clase ARWeb
 * @class ARWeb
 * @constructor
 * @param {Object} - Recibe un objeto con 2 propiedades, WIDTH: Ancho del canvas, HEIGHT: Alto del canvas.
*/

  import Animacion from './utils/animacion.js';
  import Escenario from "./class/escenario.js";
  import WebcamStream from "./utils/webcamstream.js";
  import DetectorAR from "./utils/detector_ar";
  import Mediador from "./utils/Mediador.js";
  import PositionUtil from "./utils/position_util.js";
  import Elemento from "./class/elemento.js";
class ARWeb{
  constructor(configuration){
    this.configuration=configuration;
    this.mediador=new Mediador();
    this.webcam=new WebcamStream({"WIDTH":configuration.WIDTH,"HEIGHT":configuration.HEIGHT});
    this.renderer=new THREE.WebGLRenderer();
    this.renderer.autoClear = false;
    this.objetos=[]
    this.renderer.setSize(configuration.WIDTH,configuration.HEIGHT);
    //Should be use "ra" in the example of Memorama
    document.getElementById(configuration.canvas_id).appendChild(this.renderer.domElement);
    this.detector_ar=new DetectorAR(this.webcam.getCanvas());
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
  getAnimation(){
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
  addToScene(object,is_an_object_actionable){
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
  checkLenghtObjects(){
    return this.objetos.length;
  }

  /**
   * @function getObject
   * @memberof ARWeb
   * @summary Retorna un objeto dependiendo de la posición en la cual se haya agregado a escena.
   * @param {Integer} position - Valor entero correspondiente a la posición a buscar.
   * @returns {Elemento} - Retorna el objeto, instancia de Elemento.js
  */
  getObject(position){
    return this.objetos[position];
  }

  /**
   * @function getWidth
   * @memberof ARWeb
   * @summary Retorna el ancho del canvas
   * @returns {Integer}
  */
  getWidth(){
    return this.configuration.WIDTH;
  }

  /**
   * @function getHeight
   * @memberof ARWeb
   * @summary Retorna el alto del canvas
   * @returns {Integer}
  */
  getHeight(){
    return this.configuration.HEIGHT;
  }

  /**
   * @function init
   * @memberof ARWeb
   * @summary Función necesaria para inicializar dependencias internas
  */
  init(){
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
  createElement(configuration){
    return new Elemento(configuration.WIDTH,configuration.HEIGHT,configuration.GEOMETRY);
  }

  /**
   * @function addStage
   * @memberof ARWeb
   * @summary Añadie un "nivel" al framework, facilitando el paso de un nivel a otro
   * @param {Function} - Función con 2 métodos, finishStage y start
  */
  addStage(stage){
    this.stages.push(stage);
  }

  /**
   * @function start
   * @memberof ARWeb
   * @summary Inicia el redibujado y el nivel actual.
  */
  start(){
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
  addMarker(marcador){
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
  attach(parent_id,marker){
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
  allowDetect(enable_detect){
    this.detecting_marker=enable_detect;
  }

  allowedDetected(){
    return this.detecting_marker;
  }

  /**
  * @function loop
  * @memberof ARWeb
  * @summary Esta función se estara ejecutando finitamente hasta que se cierre la aplicación.
  * Se encargara del redibujo de todos los elementos agregados a escena y la actualización del canvas con la transmisión de la webcam.
  */
  loop(){
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
  watch(action,event_to_dispatch){
    this.mediador.suscribir(action,this.objetos[this.objetos.length-1],event_to_dispatch);
  }

  /**
  * @function removeWatch
  * @memberof ARWeb
  * @summary Elimina un objeto a la escucha de un "tema"
  * @param {String} action - Un string identificando un "tema" a la escucha el cual servira para dar de baja el objeto.
  * @param {Elemento} object - El objeto que se dará de baja de la escucha del tema
  */
  removeWatch(action,object){
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
  dispatch(action,params_for_event_to_dispatch,callback){
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
  individualDispatch(action,object,params_for_event_to_dispatch,callback){
    this.mediador.comunicarParticular(action,object,params_for_event_to_dispatch,callback.bind(this.stages[0]));
  }

  /**
  * @function changeThreshold
  * @memberof ARWeb
  * @summary Cambia el umbral usado por JSArtoolkit
  * @param {Integer} i - Un valor entero entre 1 y 200.
  */
  changeThreshold(i){
    this.detector_ar.cambiarThreshold(i);
  }

  /**
  * @function canDetectMarker
  * @memberof ARWeb
  * @summary Identifica si en el nivel actual se detectó un marcador.
  * @param {Function} stage - El nivel el cual buscará si detecto un marcador.
  * @returns {Boolean} - Retorna verdadero o falso dependiendo si detecto un marcador o no.
  */
  canDetectMarker(stage){
    return this.detector_ar.detectMarker(stage);
  }

  /**
  * @function clean
  * @memberof ARWeb
  * @summary Limpia todos los elementos en escena.
  */
  clean(){
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
  finishStage(){
    this.clean();
    this.stages.shift();
    if(this.stages.length>0)
      this.stages[0].start();
  }
}
