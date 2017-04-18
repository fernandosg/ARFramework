function DetectorMarker(id,callback,puntero){
	this.id=id;
	this.callback=callback;
	this.puntero=puntero;
	this.attached=[];
}

DetectorMarker.prototype.detected = function() {
	return this.callback;
};

DetectorMarker.prototype.attach=function(marker){
	this.attached.push(new DetectorMarker(marker.id,marker.callback,marker.puntero));
}

module.exports=DetectorMarker;
