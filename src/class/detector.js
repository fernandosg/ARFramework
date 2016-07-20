module.exports=function(canvas_element){
        var JSARRaster,JSARParameters,detector,result;        
        var markers_attach={};
        var threshold=120;
        var markers={};
        var DetectorMarker;
        var rootMarker,markermatrix;
        function init(){
            JSARRaster = new NyARRgbRaster_Canvas2D(canvas_element);
            DetectorMarker=require("./detectormarker.js");
            JSARParameters = new FLARParam(canvas_element.width, canvas_element.height);
            detector = new FLARMultiIdMarkerDetector(JSARParameters, 40);
            result = new Float32Array(16);
            detector.setContinueMode(true);
            JSARParameters.copyCameraMatrix(result, .1, 2000);        
            THREE.Object3D.prototype.transformFromArray = function(m) {
                this.matrix.setFromArray(m);
                this.matrixWorldNeedsUpdate = true;
            }
        }

        var setCameraMatrix=function(realidadCamera){        
            realidadCamera.projectionMatrix.setFromArray(result);
        }
       
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

        function obtenerMarcador(markerCount){
            var matriz_encontrada
            for(var i=0;i<markerCount;i++){
                matriz_encontrada=getTransformMatrix(i);
            }   
            return matriz_encontrada;
        }    

        function isAttached(id){
            return markers_attach[id]!=undefined;
        }

        var detectMarker=function(stage){
            var markerCount = detector.detectMarkerLite(JSARRaster, threshold); 
            var marker;
            if(markerCount>0){ 
                for(var i=0,marcador_id=-1;i<markerCount;i++){
                    var marcador_id=getMarkerNumber(i);                    
                    if(markers[marcador_id]!=undefined){ 
                        if(markers[marcador_id].puntero!=undefined){
                            markers[marcador_id].puntero.transformFromArray(obtenerMarcador(markerCount));
                            markers[marcador_id].puntero.matrixWorldNeedsUpdate=true;
                        }                                          
                        if(!isAttached(marcador_id))                           
                            markers[marcador_id].detected().call(stage,markers[marcador_id].puntero);                            
                        else                            
                            markers_attach[marcador_id]=1;                            
                    }
                }
                if(Object.keys(markers_attach).length>0){
                    var count=0;
                    for(var id in markers_attach){
                        count+=markers_attach[id];
                        markers_attach[id]=0;
                    }
                    if(count==Object.keys(markers_attach).length)//If all the markers attached are not detected, then the event is not executed                        
                        rootMarker.detected().call(stage,rootMarker.puntero);                      
                }              
                return true;            
            }
            return false;
        }

        //Attached two or more markers with the last marker added
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

        var addMarker=function(marker){
            markers[marker.id]=new DetectorMarker(marker.id,marker.callback,marker.puntero);
            return this;
        }

        var cleanMarkers=function(){
            markers={};
        }

        var cambiarThreshold=function (threshold_nuevo){
            threshold=threshold_nuevo;
        }

        return{
            init:init,
            attach:attach,
            setCameraMatrix,setCameraMatrix,
            detectMarker:detectMarker,
            addMarker:addMarker,
            markermatrix:markermatrix,
            cambiarThreshold:cambiarThreshold,
            cleanMarkers:cleanMarkers
        }
}