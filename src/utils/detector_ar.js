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
import DetectorMarker from "./detectormarker.js";
class DetectorAR{
  constructor(camera,renderer){
    this.threshold=120;
    this.list_marker_id_detected=[];
    this.list_marker_id_with_attachment=[];
    this.markers={};
    this.markers_attach={};
    this.markers_detected=[];
    this.markers_with_attachment={};
    this.camera=camera;
    this.renderer=renderer;
    this.list_paths={0:"/data/patt.hiro",1:"/data/patt.kanji"};
  }

  init(){
    this.arToolkitSource = new THREEx.ArToolkitSource({
      // to read from the webcam
      sourceType : 'webcam'
    })

    this.arToolkitContext = new THREEx.ArToolkitContext({
      cameraParametersUrl: "/data/camera_para.dat",
      detectionMode: 'mono',
      maxDetectionRate: 30,
  		canvasWidth: 80*3,
  		canvasHeight: 60*3,
    })

    // initialize it
    this.arToolkitContext.init(function onCompleted(){
      // copy projection matrix to camera
      this.camera.projectionMatrix.copy(this.arToolkitContext.getProjectionMatrix() );
    }.bind(this))

    this.arToolkitSource.init(function onReady(){
      //onResize()
      this.arToolkitSource.onResizeElement();
  		this.arToolkitSource.copyElementSizeTo(this.renderer.domElement)
      if(this.arToolkitContext.arController !== null ){
  			this.arToolkitSource.copyElementSizeTo(this.arToolkitContext.arController.canvas)
  		}
    }.bind(this))
  }

  setStage(stage){
    this.stage=stage;
  }
  loop(){
    if( this.arToolkitSource.ready === false )	return

		this.arToolkitContext.update( this.arToolkitSource.domElement )
  }

  /**
  * @function attach
  * @memberof DetectorAR
  * @summary Obtiene el número de marcador
  * @param {Integer} idx - Recibe el id del marcador.
  */
  attach(markers_to_attach){
    let marker_list=Object.keys(markers);
    let rootMarker;
    if(marker_list.length>0)
    rootMarker=this.markers[marker_list.pop()];
    this.markers_attach[rootMarker.id]=0;
    for(let i=0,length=markers_to_attach.length;i<length;i++){
      addMarker(markers_to_attach[i]);
      this.markers_attach[markers_to_attach[i].id]=0;
    }
  }

  getPathPattern(id){
    return this.list_paths.hasOwnProperty(id) ? this.list_paths[id] : false;
  }

  isNotAChildMarker(marker_id){
    for(let i=0,keys_arr=Object.keys(this.markers_with_attachment),length=keys_arr.length;i<length;i++){
      if(this.markers_with_attachment[keys_arr[i]].indexOf(marker_id)>-1){
        return false;
      }
    }
    return true;
  }

  checkingAttachmentRelation(marker){
    if(!this.markers_with_attachment.hasOwnProperty(marker.id)){
      this.markers_with_attachment[marker.id]=[];
    }
    for(let i=0,length=marker.attached_id.length;i<length;i++){
      if(this.markers_with_attachment[marker.id].indexOf(marker.attached_id[i]))
        this.markers_with_attachment[marker.id].push(marker.attached_id[i]);
    }
    setTimeout(function(marker){
      if(this.markers_with_attachment[marker.id].length==0)
        return;
      let counter_detected=0;
      for(let i=0,length=this.markers_with_attachment[marker.id].length;i<length;i++){
        if(this.markers_detected.indexOf(this.markers_with_attachment[marker.id][i])>-1)
          counter_detected;
      }
      if(counter_detected==this.this.markers_with_attachment[marker.id].length){
        for(let i=0,length=this.markers_with_attachment[marker.id].length;i<length;i++){
            this.markers[this.markers_with_attachment[marker.id][i]].callback.call(this.stage,this.markers.puntero);
            this.markers_detected.splice(this.markers_detected.indexOf(this.markers_with_attachment[marker.id][i]),1);
        }
        this.markers_with_attachment[marker.id]=[];
      }

    }.bind(this,marker),350);
  }

  /**
  * @function addMarker
  * @memberof DetectorAR
  * @summary Obtiene el número de marcador
  * @param {Integer} idx - Recibe el id del marcador.
  */
  addMarker(marker){
    let path=this.getPathPattern(marker.id);
    if(path){
      this.markers[marker.id]=new DetectorMarker(marker.id,marker.callback,marker.puntero.get());
      this.lastMarker=this.markers[marker.id];
      let markerControl=new THREEx.ArMarkerControls(this.arToolkitContext, this.markers[marker.id].puntero, {
    		type : 'pattern',
    		patternUrl : path
    	});
      let marker_obj=this.markers[marker.id];
      markerControl.addEventListener('markerFound', function(marker_obj,event){
        if(!marker_obj.hasAttachments()){
          if(this.isNotAChildMarker(marker.id)){
            marker_obj.callback.call(this.stage,marker_obj.puntero);
          }else{
            this.markers_detected.push(marker.id);
          }
        }else
          this.checkingAttachmentRelation(marker_obj);
    	}.bind(this,marker_obj));
      return this.markers[marker.id];
    }else{
      console.log("The marker id does not exist");
      return undefined;
    }
  }



  getLastMarker(){
    return this.lastMarker;
  }

  getMarker(marker_id){
    return this.markers[marker_id];
  }

  /**
  * @function cleanMarkers
  * @memberof DetectorAR
  * @summary Obtiene el número de marcador
  * @param {Integer} idx - Recibe el id del marcador.
  */
  cleanMarkers(){
    this.markers={};
  }

  loop(){
    this.arToolkitContext.update(this.arToolkitSource.domElement )
  }

  /**
  * @function cambiarThreshold
  * @memberof DetectorAR
  * @summary Obtiene el número de marcador
  * @param {Integer} idx - Recibe el id del marcador.
  */
  cambiarThreshold(threshold_nuevo){
    this.threshold=threshold_nuevo;
  }
}
export { DetectorAR as default}
