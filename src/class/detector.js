module.exports=function(canvas_element){
        var JSARRaster,JSARParameters,detector,result;
        var threshold=120;
        var markers={};
        function init(){
            JSARRaster = new NyARRgbRaster_Canvas2D(canvas_element);
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

        var detectMarker=function(stage){
            var markerCount = detector.detectMarkerLite(JSARRaster, threshold); 
            if(markerCount>0){ 
                for(var i=0,marcador_id=-1;i<markerCount;i++){
                    marcador_id=getMarkerNumber(i);
                    if(markers[marcador_id]!=undefined){
                        if(markers[marcador_id].puntero!=undefined){
                            markers[marcador_id].puntero.transformFromArray(obtenerMarcador(markerCount));
                            markers[marcador_id].puntero.matrixWorldNeedsUpdate=true;
                        }
                        //console.log("encontro un marcador");
                        markers[marcador_id].detected().call(stage,markers[marcador_id].puntero);
                    }
                }
                return true;            
            }
            return false;
        }

        var addMarker=function(marker){
            markers[marker.id]=marker;
        }

        var cambiarThreshold=function (threshold_nuevo){
            threshold=threshold_nuevo;
        }
        return{
            init:init,
            setCameraMatrix,setCameraMatrix,
            detectMarker:detectMarker,
            addMarker:addMarker,
            cambiarThreshold:cambiarThreshold
        }
}