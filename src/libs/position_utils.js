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

module.exports=PositionUtils;
