//DEBUG=true;
Calibrar=require("../src/calibracion.js");
calibracion=new Calibrar();
ARWeb=require("../src/class/arweb.js");
arweb=new ARWeb({"width":1000,"height":800,"elemento":"ra"});
arweb.init();
arweb.addStage(calibracion);
arweb.run();