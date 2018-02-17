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
  constructor(canvas_element){
    this.canvas_element=canvas_element;
    this.threshold=120;
    this.in_process_detect=false;
    this.list_marker_id_detected=[];
    this.list_marker_id_with_attachment=[];
    this.markers={};
    this.markers_attach={};
  }

  init(){
    this.JSARRaster = new NyARRgbRaster_Canvas2D(this.canvas_element);
    this.JSARParameters = new FLARParam(this.canvas_element.width, this.canvas_element.height);
    this.detector = new FLARMultiIdMarkerDetector(this.JSARParameters, 40);
    this.result = new Float32Array(16);
    this.detector.setContinueMode(true);
    this.JSARParameters.copyCameraMatrix(this.result, .1, 2000);
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
    setCameraMatrix(realidadCamera){
      realidadCamera.projectionMatrix.setFromArray(this.result);
    }

    /**
    * @function getMarkerNumber
    * @memberof DetectorAR
    * @summary Obtiene el número de marcador
    * @param {Integer} idx - Recibe el id del marcador.
    */
    getMarkerNumber(idx) {
      let data = this.detector.getIdMarkerData(idx);
      if (data.packetLength > 4) {
        return -1;
      }

      let result=0;
      for (let i = 0; i < data.packetLength; i++ ) {
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
    getTransformMatrix(idx) {
      let mat = new NyARTransMatResult();
      this.detector.getTransformMatrix(idx, mat);

      let cm = new Float32Array(16);
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
    obtenerMarcador(markerCount,pos){
      let matriz_encontrada;
      for(let i=0;i<markerCount;i++){
        if(i==pos){
          matriz_encontrada=this.getTransformMatrix(i);
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
    isAttached(id){
      return this.markers_attach[id]!=undefined;
    }

    /**
    * @function detectMarker
    * @memberof DetectorAR
    * @summary Obtiene el número de marcador
    * @param {Integer} idx - Recibe el id del marcador.
    */
    detectMarker(stage){
      let markerCount = this.detector.detectMarkerLite(this.JSARRaster, this.threshold);
      let marker;
      if(markerCount>0){
        for(let i=0,marcador_id=-1;i<markerCount;i++){
          let marcador_id=this.getMarkerNumber(i);
          if(this.markers[marcador_id]!=undefined){
            if(this.markers[marcador_id].puntero!=undefined){
              this.markers[marcador_id].puntero.transformFromArray(this.obtenerMarcador(markerCount,i));
              this.markers[marcador_id].puntero.matrixWorldNeedsUpdate=true;
            }
            if(!this.markers[marcador_id].hasAttachments()){
              if(this.markers[marcador_id].callback!=undefined)
                this.markers[marcador_id].detected().call(stage,this.markers[marcador_id].puntero);
            }else{
              if(this.list_marker_id_with_attachment.indexOf(marcador_id)==-1)
                this.list_marker_id_with_attachment.push(marcador_id)
            }
            if(this.list_marker_id_detected.indexOf(marcador_id)==-1)
              this.list_marker_id_detected.push(marcador_id)
          }
        }
        if(!this.in_process_detect && this.list_marker_id_with_attachment.length>0)
          setTimeout(function(){
            this.in_process_detect=true;
            if(this.list_marker_id_with_attachment.length>0){
              for(let i=0,total_attachments=[],count_attachments=0,length=this.list_marker_id_with_attachment.length;i<length;i++,count_attachments=0){
                total_attachments=this.markers[this.list_marker_id_with_attachment[i]].getAttachmentsId();
                total_attachments.forEach(function(attached_id){
                  if(this.list_marker_id_detected.indexOf(attached_id)>-1)
                    count_attachments++;
                });
                if(total_attachments.length==count_attachments)
                  this.markers[this.list_marker_id_with_attachment[i]].detected().call(stage,this.markers[this.list_marker_id_with_attachment[i]].puntero);
              }
            }
            this.list_marker_id_with_attachment.length=0;
            this.list_marker_id_detected.length=0;
            this.in_process_detect=false;
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

    /**
    * @function addMarker
    * @memberof DetectorAR
    * @summary Obtiene el número de marcador
    * @param {Integer} idx - Recibe el id del marcador.
    */
    addMarker(marker){
      this.markers[marker.id]=new DetectorMarker(marker.id,marker.callback,marker.puntero);
      this.lastMarker=this.markers[marker.id];
      return this.markers[marker.id];
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
