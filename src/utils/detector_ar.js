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
function DetectorAR(domParent,ARWeb){
  this.is_loaded=false;
  this.markers={};
  this.tasks_pending=[];
  this.tasks_markers={};
  this.checking_attachment=false;
  this.stage;
  this.ARWeb=ARWeb;
  this.DetectorMarker=require("./detectormarker.js");
  this.arController;
  window.ARThreeOnLoad=function(){
    ARController.getUserMediaThreeScene({maxARVideoSize: 320, cameraParam: 'data/camera_para-iPhone_5_rear_640x480_1.0m.dat',
    onSuccess: function(arScene, arCtrl, arCamera) {
      this.arController=arCtrl;
      console.log("Definiendo arController");
      document.body.className = this.arController.orientation;
      this.ARWeb.initScene(arScene);
      this.ARWeb.initCamera(arCamera);
      var renderer = new THREE.WebGLRenderer({antialias: true});
      if (this.arController.orientation === 'portrait') {
        var w = (window.innerWidth / this.arController.videoHeight) * this.arController.videoWidth;
        var h = window.innerWidth;
        renderer.setSize(w, h);
        renderer.domElement.style.paddingBottom = (w-h) + 'px';
      } else {
        if (/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)) {
          renderer.setSize(window.innerWidth, (window.innerWidth / this.arController.videoWidth) * arController.videoHeight);
        } else {
          renderer.setSize(this.arController.videoWidth, this.arController.videoHeight);
          document.body.className += ' desktop';
        }
      }
      this.ARWeb.initRenderer(renderer);
      this.arController.addEventListener('getMarker', function (ev) {
        if(ev.data.type==0){
          //console.dir(ev);//
          //this.markers[ev.data.marker.id].puntero.get().matrixWorld.elements=ev.data.matrix;
          //var marker=ev.target.threePatternMarkers[ev.data.marker.id];
          //var markerId=ev.data.marker.id;
          var marker=this.markers[ev.data.marker.id];
          if(marker.hasAttachments()){
              this.manageAttachmentEvent(marker,ev.data.marker.id,ev);
          }else{
          //console.log("Encontre este "+ev.data.marker.id);
            this.dispatchEventMarker(marker,marker,ev);
          }
        }
      }.bind(this));

      domParent.appendChild(renderer.domElement);
      this.is_loaded=true;
      if(this.tasks_pending.length>0)
        callingTasksPending.call(this);
    }.bind(this)
  });
}

/*
  Checking attachments
*/
DetectorAR.prototype.manageAttachmentEvent=function(marker,markerId,ev){
  if(!this.checking_attachment){
    this.checking_attachment=true;
    setTimeout(function(){
      var continue_event=true;
      for(var i=0,length=this.markers[markerId].getAttachmentsId().length;i<length;i++){
        if(!marker.puntero.get().visible){
          continue_event=false;
          break;
        }
      }
      this.checking_attachment=false;
      if(continue_event){
        this.dispatchEventMarker(marker,marker,ev);
      }
    }.bind(this),350);
  }
}

if (window.ARController && ARController.getUserMediaThreeScene) {
  ARThreeOnLoad.call(this);
}
}

DetectorAR.prototype.changeStage=function(new_stage){
  this.stage=new_stage;
}

function addingMarker(marker){
  this.arController.loadMarker('data/'+marker.path, function(markerId) {
    var markerRoot = this.arController.createThreeMarker(markerId);
    console.log("Añadiendo marcador "+marker.path+" "+markerId);
    //console.dir(marker.puntero.get().children[0])//
    markerRoot.add(marker.puntero.get().children[0]);
    this.ARWeb.addMarkerToScene(markerRoot);
    marker.puntero.elemento_raiz=markerRoot;
    this.markers[markerId]=new this.DetectorMarker(markerId,marker.callback,marker.puntero);
    //arScene.scene.add(markerRoot);
    //this.ARWeb.addToScene(puntero,markerRoot);
    //this.ARWeb
  }.bind(this));
}

function callingTasksPending(){
  while(this.tasks_pending.length>0)
    this.tasks_pending.pop()();
}

DetectorAR.prototype.addMarker=function(marker){
  console.log("Agregando "+this.is_loaded);
  if(this.is_loaded==false){
    this.tasks_pending.push(addingMarker.bind(this,marker));
  }else{
    if(this.tasks_pending.length>0)
      callingTasksPending.call(this);
    else{
      console.log("Segun fue verdadero y se cargo todo");
      addingMarker.call(this,marker);
    }
  }
}

DetectorAR.prototype.getMarker=function(markerId){
  //console.log("Buscando "+markerId);
  //console.dir(this.markers);
  return this.markers[markerId];
}

DetectorAR.prototype.addPendingTask=function(fn){
  this.tasks_pending.push(fn);
}

DetectorAR.prototype.addPendingMarkerTask=function(markerId,fn){
  this.tasks_markers[markerId]=fn;
}

DetectorAR.prototype.cleanMarkers=function(){
  this.markers={};
}

DetectorAR.prototype.dispatchEventMarker=function(marker,ev,complete){
  if(marker!=null && marker.detected()!=undefined)
  marker.detected().call(this.ARWeb.stages[0],marker.puntero);
}

module.exports=DetectorAR;
