function DetectorMarker(id,callback,puntero){
	this.id=id;
	this.callback=callback;
	this.puntero=puntero;
}

DetectorMarker.prototype.detected = function() {
	return this.callback;
};

module.exports=DetectorMarker;