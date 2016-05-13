function ARDetector(video_elem,camera,canvas){
    var JSARRaster,JSARParameters,detector,result;
    var video;
    var threshold=139;
    THREE.Matrix4.prototype.setFromArray = function(m) {
        return this.set(
          m[0], m[4], m[8], m[12],
          m[1], m[5], m[9], m[13],
          m[2], m[6], m[10], m[14],
          m[3], m[7], m[11], m[15]
        );
    }
    function init(){        
        JSARRaster = new NyARRgbRaster_Canvas2D(canvas);
        video=video_elem;
        JSARParameters = new FLARParam(canvas.width, canvas.height);
        detector = new FLARMultiIdMarkerDetector(JSARParameters, 40);
        detector.setContinueMode(true);
        result = new Float32Array(16);
        JSARParameters.copyCameraMatrix(result, 10, 1000);
        camera.projectionMatrix.setFromArray(result);
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
        cm[0] = mat.m00;
        cm[1] = -mat.m10;
        cm[2] = mat.m20;
        cm[3] = 0;
        cm[4] = mat.m01;
        cm[5] = -mat.m11;
        cm[6] = mat.m21;
        cm[7] = 0;
        cm[8] = -mat.m02;
        cm[9] = mat.m12;
        cm[10] = -mat.m22;
        cm[11] = 0;
                cm[12] = mat.m03;
        cm[13] = -mat.m13;
        cm[14] = mat.m23;
        cm[15] = 1;

        return cm;
    }




    THREE.Object3D.prototype.transformFromArray = function(m) {
        this.matrix.setFromArray(m);
        this.matrixWorldNeedsUpdate = true;
    }

    function dibujarVideo(){        
        return (video.readyState == video.HAVE_ENOUGH_DATA)        
    }

    var cambiarThreshold=function (threshold_nuevo){
        threshold=threshold_nuevo;
    }

    var verificarDeteccion=function(){
        return detector.detectMarkerLite(JSARRaster, threshold);      
    }

    var marcadorAObjeto=function(objeto,i){
        objeto.transformFromArray(getTransformMatrix(i));
        //objeto.visible=true;
    }
    init();
    return{
        verificarDeteccion:verificarDeteccion,
        marcadorAObjeto:marcadorAObjeto,
        cambiarThreshold:cambiarThreshold
    }
}