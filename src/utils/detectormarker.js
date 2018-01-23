class DetectorMarker{
	constructor(id,callback,puntero){
		this.id=id;
		this.callback=callback;
		this.puntero=puntero;
		this.attached=[];
		this.attached_id=[];
	}

	detected() {
		return this.callback;
	}

	attach(marker){
		this.attached_id.push(marker.id);
		this.attached.push(new DetectorMarker(marker.id,marker.callback,marker.puntero));
	}

	hasAttachments(){
		return this.attached.length>0;
	}

	getAttachmentsId(){
		return this.attached_id;
	}
}
