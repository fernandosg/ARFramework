function ColorStage(){
	this.colors;
	this.codesColors=[];
	this.countingColors=false;
}
ColorStage.prototype.RGBtoHSV=function(r,g,b){
	var r=r/255;
	var g=g/255;
	var b=b/255;
	max=Math.max(r,g,b);
	min=Math.min(r,g,b);
	delta=max-min;
	v=max;
	var h=0;
	if(max==r){
		mod=((g-b)/delta) % 6;
		h=60*mod;
	}else if(max==g){
		mod=((b-r)/delta) +2;
		h=60*mod;
	}else if(max==b){
		mod=((r-g)/delta) +4;
		h=60*mod;
	}
	s=(max==0) ? 0 : (delta/max);
	return {h:h,s:s,v:v}
}

ColorStage.prototype.registerColor=function(stage){
	stage.countingColors=stage.countingColors ? false : true;
}

ColorStage.prototype.checkColors=function(stage){
	stage.codesColors.forEach(function(elem){
		console.dir(elem);
	})
}

ColorStage.prototype.fnAfter=function(stage){

}


ColorStage.prototype.loop=function(stage){
	stage.elemento.actualizar();
}

ColorStage.prototype.init=function(stage){
	stage.elemento=new this.Elemento(60,60,new THREE.PlaneGeometry(60,60));
	stage.elemento.init();
	stage.elemento.definirBackground("rgb(255, 0, 0)");
	stage.elemento.position(0,0,-400);
	stage.elemento.cambiarVisible();
	this.anadir(stage.elemento.get());
      tracking.ColorTracker.registerColor('green', function(r, g, b) {
        colors=stage.RGBtoHSV(r,g,b);           
        //Range of color green
        if ((colors["h"]<=140 && colors["h"]>=78) && (colors["s"]<=.97 && colors["s"]>=.40) &&(colors["v"]<=1 && colors["v"]>=.30)) {        
          return true;
        }
        return false;
      });
      var tracker = new tracking.ColorTracker(["green"]);
      tracking.track(this.canvas_video, tracker, { camera: true,context:this.canvas_video.getContext("2d") });
      tracker.on('track', function(event) {
      	//Data attribute have the two colors detected
        event.data.forEach(function(rect) {
          if (rect.color === 'custom') {
            rect.color = tracker.customColor;
          }
          //Call the registerColors and then checkColors for all the colors detected
          if(stage.countingColors){
          	stage.codesColors.push(event);
          	if(stage.codesColors.length==10)
          		stage.registerColor();
          }
          stage.elemento.position((rect.x- (this.canvas_video.width / 2)),((this.canvas_video.height / 2) - rect.y),-400);
          stage.elemento.visible();
        });
      });
}
module.exports=ColorStage;