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
          var marker=ev.target.threePatternMarkers[ev.data.marker.id];
          //console.log("Encontre este "+ev.data.marker.id);
          this.dispatchEventMarker(this.markers[ev.data.marker.id],marker,ev);
        }
      }.bind(this));

      domParent.appendChild(renderer.domElement);
      this.is_loaded=true;
      if(this.tasks_pending.length>0)
        callingTasksPending.call(this);
    }.bind(this)
  });
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
    //console.log("Añadiendo marcador "+marker.id+" "+markerId);
    //console.dir(marker.puntero.get().children[0])//
    markerRoot.add(marker.puntero.get().children[0]);
    this.ARWeb.addMarkerToScene(markerRoot);
    marker.puntero.elemento_raiz=markerRoot;
    this.markers[markerId]=new this.DetectorMarker(markerId,marker.callback,marker.puntero);
    //arScene.scene.add(markerRoot);
    //this.ARWeb.addToScene(puntero,markerRoot);
    this.ARWeb
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

DetectorAR.prototype.addPendingTask=function(fn){
  this.tasks_pending.push(fn);
}

DetectorAR.prototype.cleanMarkers=function(){
  this.markers={};
}

DetectorAR.prototype.dispatchEventMarker=function(marker,ev,complete){
  if(marker!=null)
  marker.detected().call(this.stage,marker.puntero);
}

module.exports=DetectorAR;
