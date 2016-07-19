/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var sonidoBienvenida = new Audio("./assets/sounds/bienvenida.wav");
var sonidoBienvenidaTienda = new Audio("./assets/sounds/tiendaorden.mp3");
var sonidoInstrucciones = new Audio("./assets/sounds/instrucciones.wav");
var sonidoAcierto01 = new Audio("./assets/sounds/acierto01.wav"); 
var sonidoAcierto02 = new Audio("./assets/sounds/acierto02.wav"); 
var sonidoFallo01 = new Audio("./assets/sounds/fallo01.wav");
var sonidoFallo02 = new Audio("./assets/sounds/fallo02.wav");
var sonidoFinalizar = new Audio("./assets/sounds/finalizar.wav");
var sonidoSaludo = new Audio("./assets/sounds/saludo.wav");
var sonidoDespedida = new Audio("./assets/sounds/despedida.wav");
var sonidoError = new Audio("./assets/sounds/error.wav");
var banderaAcierto = true;
var banderaFallo = true;

sonidos={
    "memorama":{"bienvenida":sonidoBienvenida,"instrucciones":sonidoInstrucciones,"acierto":sonidoAcierto01,"fallo":sonidoFallo01,"finalizar":sonidoFinalizar,"saludo":sonidoSaludo,"error":sonidoError},
    "tienda":{"bienvenida":sonidoBienvenidaTienda}
}
sonidosEspera=[];
// Definición de eventos de sonidos.
sonidoBienvenida.onended = function () {
    redimensionarKathia("400px", "300px");
};
for(var sonido in sonidos){
    sonidos[sonido].onended=function(){        
        if(sonidosEspera[1]){
            sonidosEspera[1].play();
        }
        sonidosEspera.shift();
    }
}

function reproducir(stage,opcion){
    if(sonidos[stage]!=undefined){
        sonidosEspera.push(sonidos[stage][opcion]);
        sonidosEspera[0].play();
    }
}


function seleccionarAudio(stage,opcion) {
    reproducir(stage,opcion);
    /*
    switch(opcion) {
        case "bienvenida":
            sonidoBienvenida.play();
            break;
        
        case "instrucciones":
            sonidoInstrucciones.play();
            break;
        
        case "acierto":
            if (banderaAcierto) sonidoAcierto01.play();
            else sonidoAcierto02.play();
            
            banderaAcierto = !banderaAcierto;
            break;
        
        case "fallo":
            if (banderaFallo) sonidoFallo01.play();
            else sonidoFallo02.play();
            
            banderaFallo = !banderaFallo;
            break;
        
        case "finalizar":
            sonidoFinalizar.play();
            break;
        
        case "saludo":
            sonidoSaludo.play();
            break;
        
        case "despedida":
            sonidoDespedida.play();
            break;
        
        case "error":
            sonidoError.play();
            break;
            
        default:
    }
    */
}

