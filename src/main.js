var Memorama=require("./memorama.js");
var ARFramework=require("./ar_framekwork.js");
framework=new ARFramework({WIDTH:640,HEIGHT:480,canvas_id:"ra"});
framework.init();
var nivel=new Memorama(framework);
framework.addStage(nivel);
nivel.calibracion();
framework.start();//nivel.start();
