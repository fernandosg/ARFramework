function DetectorMarker(id,callback,puntero){
	this.id=id;
	this.callback=callback;
	this.puntero=puntero;
	this.attached=[];
	this.attached_id=[]
}

DetectorMarker.prototype.detected = function() {
	return this.callback;
};

DetectorMarker.prototype.attach=function(marker){
	this.attached_id.push(marker.id);
	//this.attached.push(new DetectorMarker(marker.id,marker.callback,marker.puntero));
}

DetectorMarker.prototype.hasAttachments=function(){
	return this.attached_id.length>0;
}

DetectorMarker.prototype.getAttachmentsId=function(){
	return this.attached_id;
}
module.exports=DetectorMarker;
