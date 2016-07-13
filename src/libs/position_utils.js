function PositionUtils(config){
	this.width=config.width;
	this.height=config.height;	
    this.escena=config.escena;
}

PositionUtils.prototype.getScreenPosition=function(obj){
	var vector = new THREE.Vector3();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(this.escena.camara);
    var widthHalf = this.width / 2, heightHalf = this.height / 2;
    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = -( vector.y * heightHalf ) + heightHalf;
    return vector;
}

PositionUtils.prototype.getPointView=function(dist){
    var vFOV = this.escena.camara.fov * Math.PI / 180;        // convert vertical fov to radians
    var height = 2 * Math.tan( vFOV / 2 ) * dist; // visible height

    var aspect = this.width / this.height;
    var width = height * aspect; 
    return {
        width:width,
        height:height
    }
}

PositionUtils.prototype.getRealSize=function(size,z){
    var real_size=this.getPointView(Math.abs(z));
    return {
        width:(size.x*real_size.width)/1000,
        height:(size.y*real_size.height)/800
    }
}

module.exports=PositionUtils;
