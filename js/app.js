//DEBUG=true;
Calibrar=require("../src/calibracion.js");
Memorama=require("../src/memorama.js");
Basketball=require("../src/basketball.js");
calibracion=new Calibrar();
//memorama=new Memorama();
//basketball=new Basketball();
//ColorStage=require("../src/trackingcolor.js");
//var tracking=new ColorStage();
ARWeb=require("../src/class/arweb.js");
arweb=new ARWeb({"width":1000,"height":800,"elemento":"ra"});
arweb.init();
//arweb.addStage(tracking);
arweb.addStage(calibracion);
//arweb.addStage(memorama);
//arweb.addStage(basketball);
arweb.run();