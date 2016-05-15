//DEBUG=true;
Calibrar=require("../src/calibracion.js");
Memorama=require("../src/memorama.js");
memorama=new Memorama();
calibracion=new Calibrar();
calibracion.config({cantidad_cartas:4});

calibracion.init(function(){
	configuracion_init=calibracion.getConfiguracion();
	configuracion_init["tipo_memorama"]="cocina";
	memorama.config(configuracion_init);
	memorama.init();
	mensajes.alerta({texto:"Bienvenido al memorama"});
	clasificarOpcion("bienvenida");
})