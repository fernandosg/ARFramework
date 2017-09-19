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
