/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// Definición de variables.
var stage = new PIXI.Container();
var canvas_kath = document.createElement("CANVAS");
    canvas_kath.setAttribute("id", "canvas");
var kathia_renderer = PIXI.autoDetectRenderer(585, 480, {view: canvas_kath, transparent: true, backgroundColor: 0x65C25D}); //dimenciones del cuadro de visualizacion
//var renderer = PIXI.autoDetectRenderer(585, 480, {view: canvas, backgroundColor: 0x5F9EA0}); //dimenciones del cuadro de visualizacion

var framesAnimados = 0;
var tiempodeEspera = 0;
var animTerminada = false;
var coladeAnimacion = [];
var timer;
var framesTotales = 0;

// Matrices inicial y final de los componentes.
// Definición de los ojos.
{
    var ojoDerInicial = [];
    var ojoDerFinal = [];
    ojoDerInicial.push(new PIXI.Point(0, 0));
    ojoDerInicial.push(new PIXI.Point(0, 52));
    ojoDerInicial.push(new PIXI.Point(0, 105));
    ojoDerInicial.push(new PIXI.Point(0, 157));
    ojoDerFinal = clonar(ojoDerInicial);
    
    var ojoIzqInicial = [];
    var ojoIzqFinal = [];
    ojoIzqInicial = clonar(ojoDerInicial);
    ojoIzqFinal = clonar(ojoIzqInicial);
    
    var cejaDerInicial = [];
    var cejaDerFinal = [];
    cejaDerInicial.push(new PIXI.Point(0, 0));
    cejaDerInicial.push(new PIXI.Point(56, 0));
    cejaDerInicial.push(new PIXI.Point(112, 0));
    cejaDerInicial.push(new PIXI.Point(168, 0));
    cejaDerInicial.push(new PIXI.Point(224, 0));
    cejaDerInicial.push(new PIXI.Point(280, 0));
    cejaDerFinal = clonar(cejaDerInicial);
    
    var cejaIzqInicial = [];
    var cejaIzqFinal = [];
    cejaIzqInicial = clonar(cejaDerInicial);
    cejaIzqFinal = clonar(cejaDerFinal);
}

// Definición de la boca.
{
    var labioSInicial = [];
    var labioSFinal = [];
    labioSInicial.push(new PIXI.Point(0, 0));
    labioSInicial.push(new PIXI.Point(56, 0));
    labioSInicial.push(new PIXI.Point(112, 0));
    labioSInicial.push(new PIXI.Point(168, 0));
    labioSInicial.push(new PIXI.Point(224, 0));
    labioSInicial.push(new PIXI.Point(280, 0));
    labioSFinal = clonar(labioSInicial);
    
    var labioIInicial = [];
    var labioIFinal = [];
    labioIInicial = clonar(labioSInicial);
    labioIFinal = clonar(labioSFinal);
    
    var bocaInicial = [];
    bocaInicial.push(new PIXI.Point(0, -10));
    bocaInicial.push(new PIXI.Point(0, 25));
    bocaInicial.push(new PIXI.Point(0, 55));
    
    var bocaFinal = [];
    bocaFinal = clonar(bocaInicial);
}

// Creacion de objetos visuales y objetos de agrupacion
{
    // Creación de Kathia
    var cuerpo = PIXI.Sprite.fromImage("./img/cuerpo.png");
    var kathia = new PIXI.Container();
    var cara = new PIXI.Container();
    var cabeza = new PIXI.Container();
    var cabello = PIXI.Sprite.fromImage("./img/cabello.png");
    var cabelloFondo = PIXI.Sprite.fromImage("./img/cabello2.png");
    var ojoIzq = new PIXI.mesh.Rope(PIXI.Texture.fromImage("./img/ojoIzq.png"), ojoIzqInicial);
    var ojoDer = new PIXI.mesh.Rope(PIXI.Texture.fromImage("./img/ojoDer.png"), ojoDerInicial);
    var boca = new PIXI.mesh.Rope(PIXI.Texture.fromImage("./img/boca.png"), bocaInicial);
    var cejaIzq = new PIXI.mesh.Rope(PIXI.Texture.fromImage("./img/cejaIzq.png"), cejaIzqInicial);
    var cejaDer = new PIXI.mesh.Rope(PIXI.Texture.fromImage("./img/cejaDer.png"), cejaDerInicial);
    var labioS = new PIXI.mesh.Rope(PIXI.Texture.fromImage("./img/labioSuperior.png"), labioSInicial);
    var labioI = new PIXI.mesh.Rope(PIXI.Texture.fromImage("./img/labioInferior.png"), labioIInicial);
    var base = PIXI.Sprite.fromImage("./img/base.png");
    var nariz = PIXI.Sprite.fromImage("./img/nariz.png");

    // Creación del contenedor de dialogo y el Sprite del dialogo.
    var dialogo = new PIXI.Container();
    var globoDialogo = PIXI.Sprite.fromImage("./img/dialogo.png");

    globoDialogo.position.x = 280;
    globoDialogo.position.y = 50;
    globoDialogo.scale.x = 0.5;
    globoDialogo.scale.y = 0.4;
    dialogo.addChild(globoDialogo);

    // Creación del texto del dialogo.
    var textoDialogo = new PIXI.Text("", {font: "bold 40px Arial", fill: "#0B0B61"});
    textoDialogo.position.x = 320;
    textoDialogo.position.y = 100;
    dialogo.addChild(textoDialogo);
}

// Ubicación de los componentes del rostro sobre la imagen base.
{
    cabelloFondo.position.x = 370;
    cabello.position.x = 145;
    cabelloFondo.position.y = cabello.position.y = 5;

    ojoIzq.position.x = 585 + 77;
    cejaIzq.position.x = 535;
    ojoDer.position.x = 1010 + 77;
    cejaDer.position.x = 960;
    ojoIzq.position.y = ojoDer.position.y = 595;
    cejaIzq.position.y = cejaDer.position.y = 525 + 50;

    nariz.position.x = 765;
    nariz.position.y = 565;
    base.position.x = 420;


    labioS.position.y =  930;
    labioI.position.x = labioS.position.x =  750;
    boca.position.y = labioS.position.y-15;
    boca.position.x = labioI.position.x + 135;
    labioI.position.y =labioS.position.y +23;

    cara.addChild(ojoIzq);
    cara.addChild(ojoDer);
    cara.addChild(cejaIzq);
    cara.addChild(cejaDer);

    cara.addChild(boca);
    cara.addChild(labioI);
    cara.addChild(labioS);
    cara.addChild(nariz);
    cabeza.addChild(base);
    cabeza.addChild(cara);
    cabeza.addChild(cabello);

    kathia.addChild(cabelloFondo);
    kathia.addChild(cuerpo);
    kathia.addChild(cabeza);
    
    // Definir la escala de Kathia y agregarla al Stage principal
    kathia.scale.x = kathia.scale.y = 0.2;
    stage.addChild(kathia);
}

// Funciones que definen aspectos cognitivos
function AU00R() {  //ojo naturalmente abierto (Derecho)
    ojoDerFinal[0].y = 0;
    ojoDerFinal[1].y = 52;
    ojoDerFinal[2].y = 105;
    ojoDerFinal[3].y = 157;
}
function AU00L() {  //ojo naturalmente abierto (Izquierdo)
    ojoIzqFinal[0].y = 0;
    ojoIzqFinal[1].y = 52;
    ojoIzqFinal[2].y = 105;
    ojoIzqFinal[3].y = 157;
}
function AU00S() {  //labio naturalmente cerrado (superior)
    for (var i = 0; i < labioSFinal.length; i++) {
        labioSFinal[i].y = 0; 
    }
    labioSFinal[0].x = 0;
    labioSFinal[1].x = 56;
    labioSFinal[2].x = 112;
    labioSFinal[3].x = 168;
    labioSFinal[4].x = 224;
    labioSFinal[5].x = 280;
    bocaFinal[0].y = -10;
}
function AU00I() {  //labio naturalmente cerrado (inferior)
    for (var i = 0; i < labioIFinal.length; i++) {
        labioIFinal[i].y = 0; 
    }
    labioIFinal[0].x = 0;
    labioIFinal[1].x = 56;
    labioIFinal[2].x = 112;
    labioIFinal[3].x = 168;
    labioIFinal[4].x = 224;
    labioIFinal[5].x = 280;
    bocaFinal[2].y = 55;
}
function AU00C(){ //ceja derecha relajada
    for (var i = 0; i < cejaDerFinal.length; i++) {
        cejaDerFinal[i].y = 0; 
    }
    cejaDerFinal[0].x = 0;
    cejaDerFinal[1].x = 56;
    cejaDerFinal[2].x = 112;
    cejaDerFinal[3].x = 168;
    cejaDerFinal[4].x = 224;
    cejaDerFinal[5].x = 280;
}
function AU00Z(){ //ceja izquierda relajada
    for (var i = 0; i < cejaIzqFinal.length; i++) {
        cejaIzqFinal[i].y = 0; 
    }
    cejaIzqFinal[0].x = 0;
    cejaIzqFinal[1].x = 56;
    cejaIzqFinal[2].x = 112;
    cejaIzqFinal[3].x = 168;
    cejaIzqFinal[4].x = 224;
    cejaIzqFinal[5].x = 280;
}
function AU01() {//bajar cejas
    for (var i = 0; i < cejaIzqFinal.length; i++) {
        cejaIzqFinal[i].y = 15;
        cejaDerFinal[i].y = 15;  
    }
}
function AU02() {//subir cejas
    for (var i = 0; i < cejaIzqFinal.length; i++) {
        cejaIzqFinal[i].y = -20;
        cejaDerFinal[i].y = -20;  
    }
}
function AU04() {//fruncir cejas
    AU02();
    cejaDerFinal[0].x = -10;            cejaDerFinal[0].y = 20;
    cejaDerFinal[1].x = 10;             cejaDerFinal[1].y = 20;
    cejaDerFinal[2].x = 100;
    cejaDerFinal[3].x = 150;
    cejaDerFinal[4].x = 224;
    cejaDerFinal[5].x = 280;

    cejaIzqFinal[0].x = 0;
    cejaIzqFinal[1].x = 56;
    cejaIzqFinal[2].x = 130;
    cejaIzqFinal[3].x = 180;
    cejaIzqFinal[4].x = 270;            cejaIzqFinal[4].y = 20;
    cejaIzqFinal[5].x = 290;            cejaIzqFinal[5].y = 20;
}
function AU05() {  //parpado superior levantado
    ojoDerFinal[0].y = ojoIzqFinal[0].y = 0;
    ojoDerFinal[1].y = ojoIzqFinal[1].y = 37;
}
function AU12() {  //esquina de labios tiradas arriba (sonrisa)
    labioSFinal[0].y = labioIFinal[0].y = -20;
    labioSFinal[1].y = labioIFinal[1].y = -10;
    labioSFinal[4].y = labioIFinal[4].y = -10;
    labioSFinal[5].y = labioIFinal[5].y = -20;
}
function AU15() { //esquina de labios tiradas abajo
    labioSFinal[0].y = labioIFinal[0].y = 25;
    labioSFinal[1].y = labioIFinal[1].y = 15;
    labioSFinal[4].y = labioIFinal[4].y = 15;
    labioSFinal[5].y = labioIFinal[5].y = 25;
}
function AU25() {//labios separados
    distancia = 10;
    for (var i = 2; i < labioIFinal.length-2; i++) {
        labioSFinal[i].y = -distancia; 
        labioIFinal[i].y = distancia; 
    }  
}
function AU26() {//boca abierta
    distancia = 30;
    for (var i = 2; i < labioIFinal.length-2; i++) {
        labioSFinal[i].y = -distancia/2; 
        labioIFinal[i].y = distancia; 
    }  
}
function AU27() {//boca totalmente abierta
    distancia = 40;
    for (var i = 2; i < labioIFinal.length-2; i++) {
        labioSFinal[i].y = -distancia/2; 
        labioIFinal[i].y = distancia; 
    }  
    bocaFinal[0].y = -30;
    bocaFinal[2].y = 120;
}
function AU43R() { //ojo cerrado (Derecho)
    ojoDerFinal[0].y = 0;
    ojoDerFinal[1].y = 107;
    ojoDerFinal[2].y = 107;
    ojoDerFinal[3].y = 107;
}
function AU43L() { //ojo cerrado (Izquierdo)
    ojoIzqFinal[0].y = 0;
    ojoIzqFinal[1].y = 107;
    ojoIzqFinal[2].y = 107;
    ojoIzqFinal[3].y = 107;
}
function AU45() {   //parpadeo
    // coladeAnimacion.push(["AU43R", "AU43L"]);//cerrar ambos ojos
    // coladeAnimacion.push(0);//tiempo de espera a la siguiente accion
    coladeAnimacion.push(["AU00R", "AU00L"]);//ambos ojos naturalmente abiertos
    coladeAnimacion.push(0);//tiempo de espera a la siguiente accion
}
function AU46R() {   //guiño del ojo derecho
    coladeAnimacion.push(["AU43R"]);//cerrar ojo
    coladeAnimacion.push(0);//tiempo de espera a la siguiente accion
    coladeAnimacion.push(["AU00R"]);//ojo naturalmente abierto
    coladeAnimacion.push(0);//tiempo de espera a la siguiente accion
}
function AU46L() {   //guiÃ±o del ojo izquierdo
    coladeAnimacion.push(["AU43L"]);//cerrar ojo
    coladeAnimacion.push(0);//tiempo de espera a la siguiente accion
    coladeAnimacion.push(["AU00L"]);//ojo naturalmente abierto
    coladeAnimacion.push(0);//tiempo de espera a la siguiente accion
}



/**
 * @param {String} tipoEntrada
 * @returns {undefined}
 * 
 * Función expresionCognitiva().
 */
function expresionCognitiva(tipoEntrada) {
    gestos = expresionEmocional(tipoEntrada);
    configuracion=[];
    coladeAnimacion.push(configuracion);
    coladeAnimacion.push(0);
    
    for (var i = 0; i < gestos.length; i++) {
        //coladeAnimacion.push(["AU00R"]);
        switch (gestos[i]) {
            case "abrir ojos":
                configuracion.push("AU00R");
                configuracion.push("AU00L");
                break;
            case "parpadear": 
                AU45(); //prepara abrir ojos para la secuencia siguiente, cerramos abajo
            case "cerrar ojos":                            
                configuracion.push("AU43R");
                configuracion.push("AU43L");
                break;
            case "cerrar boca":
                configuracion.push("AU00S");
                configuracion.push("AU00I");
                break;
            case "separar labios":
                configuracion.push("AU25");
                break;
            case "subir parpados":
                configuracion.push("AU05");
                break;
            case "sonreir":
                configuracion.push("AU12");
                break;
            case "puchero":
                configuracion.push("AU15");
                break;
            case "boca totalmente abierta":
                configuracion.push("AU27");
                break;
            case "relajar cejas":
                configuracion.push("AU00Z");
                configuracion.push("AU00C");
                break;
            case "bajar cejas":
                configuracion.push("AU01");
                break;
            case "subir cejas":
                configuracion.push("AU02");
                break;
            case "fruncir cejas":
                configuracion.push("AU04");
                break;
            default:
        }
    }
}

/**
 * 
 * @param {String} tipoEntrada
 * @returns {Array}
 * 
 * Función expresionEmocional()
 */
function expresionEmocional(tipoEntrada) {
    switch (actualizaEmocion(tipoEntrada)) {
        case "enojo":
            return ["fruncir cejas","cerrar boca","puchero","cerrar ojos"];
        case "apenado":
            return ["cerrar boca","sonreir","parpadear","relajar cejas","bajar cejas"];
        case "atencion":
            return ["abrir ojos","subir cejas", "cerrar boca", "separar labios"];
        case "contento":
            return ["abrir ojos","cerrar boca","sonreir","relajar cejas"];
        case "feliz":
            return ["abrir ojos","separar labios","sonreir", "parpadear", "subir cejas"];
        case "triste":
            return ["cerrar boca","puchero", "parpadear"];
        case "asombro":
            return ["boca totalmente abierta","abrir ojos","subir parpados","subir cejas"];
        case "inconforme":
            return ["cerrar boca","puchero", "parpadear", "bajar cejas"];
        case "neutro":
            return ["abrir ojos", "cerrar boca", "parpadear", "relajar cejas"];
    }
}

/**
 * 
 * @param {String} tipoEntrada
 * @returns {String}
 * 
 * Función actualizaEmoción()
 */
function actualizaEmocion(tipoEntrada) {
    switch (tipoEntrada) {
        case "ofensa":
            return "enojo";
        case "alago":
            return "apenado";
        case "aviso":
            return "atencion";
        case "saludo":
            return "contento";
        case "despedida":
            return "triste";
        case "error":
            return "inconforme";
        case "alarma":
            return "asombro";
        case "pregunta":
            return "neutro";
        case "acierto":
            return "feliz";
        case "irrelevante":
            return "neutro";
    }
}

/**
 * 
 * @returns {undefined}
 */
function actualizarMatricesFinales() {
    configuracion = coladeAnimacion[0];

    for (var i = 0; i < configuracion.length; i++) {
        switch (configuracion[i]) {
            case "AU00R":
                AU00R();
                break;
            case "AU00L":
                AU00L();
                break;
            case "AU00S":
                AU00S();
                break;
            case "AU00I":
                AU00I();
                break;
            case "AU00C":
                AU00C();
                break;
            case "AU00Z":
                AU00Z();
                break;
            case "AU01":
                AU01();
                break;
            case "AU02":
                AU02();
                break;
            case "AU04":
                AU04();
                break;
            case "AU05":
                AU05();
                break;
            case "AU12":
                AU12();
                break;
            case "AU15":
                AU15();
                break;
            case "AU25":
                AU25();
                break;
            case "AU27":
                AU27();
                break;
            case "AU43R":
                AU43R();
                break;
            case "AU43L":
                AU43L();
                break;
            default:
        }
    }
    
    tiempodeEspera = coladeAnimacion[1];
    console.log("Tiempo a: " + tiempodeEspera);
    coladeAnimacion.shift(); //remover primer elemento (configuracion)
    coladeAnimacion.shift(); //remover primer elemento (tiempo)  
    requestAnimationFrame(animate);
}

function limpiarColadeAnimacion() {
    coladeAnimacion = [];
    if (tiempodeEspera != 0) {
        clearInterval(timer);
    }
}

function animate() {
    animTerminada = true;
    ajuste = 1;
    
    // Actualizar ojos.
    framesTotales = 4;
    for (var i = 0; i < ojoDerInicial.length; i++) {
        ajuste = Math.abs(ojoDerFinal[i].y - ojoDerInicial[i].y) / (framesTotales - framesAnimados);
        if (ojoDerFinal[i].y < ojoDerInicial[i].y) {
            ojoDerInicial[i].y -= ajuste;
        }
        if (ojoDerFinal[i].y > ojoDerInicial[i].y) {
            ojoDerInicial[i].y += ajuste;
        }
        
        ajuste = Math.abs(ojoDerFinal[i].x - ojoDerInicial[i].x) / (framesTotales - framesAnimados);
        if (ojoDerFinal[i].x < ojoDerInicial[i].x) {
            ojoDerInicial[i].x -= ajuste;
        }
        if (ojoDerFinal[i].x > ojoDerInicial[i].x) {
            ojoDerInicial[i].x += ajuste;
        }
        if (ojoDerFinal[i].x != ojoDerInicial[i].x) {
            animTerminada = false;
        }
        if (ojoDerFinal[i].y != ojoDerInicial[i].y) {
            animTerminada = false;
        }
        
        ajuste = Math.abs(ojoIzqFinal[i].y - ojoIzqInicial[i].y) / (framesTotales - framesAnimados);
        if (ojoIzqFinal[i].y < ojoIzqInicial[i].y) {
            ojoIzqInicial[i].y -= ajuste;
        }
        if (ojoIzqFinal[i].y > ojoIzqInicial[i].y) {
            ojoIzqInicial[i].y += ajuste;
        }
        
        ajuste = Math.abs(ojoIzqFinal[i].x - ojoIzqInicial[i].x) / (framesTotales - framesAnimados);
        if (ojoIzqFinal[i].x < ojoIzqInicial[i].x) {
            ojoIzqInicial[i].x -= ajuste;
        }
        if (ojoIzqFinal[i].x > ojoIzqInicial[i].x) {
            ojoIzqInicial[i].x += ajuste;
        }

        if (animTerminada) {
            if (ojoIzqFinal[i].x != ojoIzqInicial[i].x) {
                animTerminada = false;
            }
            if (ojoIzqFinal[i].y != ojoIzqInicial[i].y) {
                animTerminada = false;
            }
        }
    }
    
    // Actualizar labios.
    framesTotales = 5;
    for (var i = 0; i < labioSInicial.length; i++) {
        ajuste = Math.abs(labioSFinal[i].y - labioSInicial[i].y) / (framesTotales - framesAnimados);
        if (labioSFinal[i].y < labioSInicial[i].y) {
            labioSInicial[i].y -= ajuste;
        }
        if (labioSFinal[i].y > labioSInicial[i].y) {
            labioSInicial[i].y += ajuste;
        }
        
        ajuste = Math.abs(labioSFinal[i].x - labioSInicial[i].x) / (framesTotales - framesAnimados);
        if (labioSFinal[i].x < labioSInicial[i].x) {
            labioSInicial[i].x -= ajuste;
        }
        if (labioSFinal[i].x > labioSInicial[i].x) {
            labioSInicial[i].x += ajuste;
        }
        if (labioSFinal[i].x != labioSInicial[i].x) {
            animTerminada = false;
        }
        if (labioSFinal[i].y != labioSInicial[i].y) {
            animTerminada = false;
        }
        
        ajuste = Math.abs(labioIFinal[i].y - labioIInicial[i].y) / (framesTotales - framesAnimados);
        if (labioIFinal[i].y < labioIInicial[i].y) {
            labioIInicial[i].y -= ajuste;
        }
        if (labioIFinal[i].y > labioIInicial[i].y) {
            labioIInicial[i].y += ajuste;
        }
        
        ajuste = Math.abs(labioIFinal[i].x - labioIInicial[i].x) / (framesTotales - framesAnimados);
        if (labioIFinal[i].x < labioIInicial[i].x) {
            labioIInicial[i].x -= ajuste;
        }
        if (labioIFinal[i].x > labioIInicial[i].x) {
            labioIInicial[i].x += ajuste;
        }

        if (animTerminada) {
            if (labioIFinal[i].x != labioIInicial[i].x) {
                animTerminada = false;
            }
            if (labioIFinal[i].y != labioIInicial[i].y) {
                animTerminada = false;
            }
        }

    }
     
    // Actualizar boca
    for (var i = 0; i < bocaInicial.length; i++) {
        ajuste = Math.abs(bocaFinal[i].y - bocaInicial[i].y) / (framesTotales - framesAnimados);
        if (bocaFinal[i].y < bocaInicial[i].y) {
            bocaInicial[i].y -= ajuste;
        }
        if (bocaFinal[i].y > bocaInicial[i].y) {
            bocaInicial[i].y += ajuste;
        }
        
        ajuste = Math.abs(bocaFinal[i].x - bocaInicial[i].x) / (framesTotales - framesAnimados);
        if (bocaFinal[i].x < bocaInicial[i].x) {
            bocaInicial[i].x -= ajuste;
        }
        if (bocaFinal[i].x > bocaInicial[i].x) {
            bocaInicial[i].x += ajuste;
        }
    }

    // Actualizar cejas
    framesTotales = 3;
    for (var i = 0; i < cejaDerInicial.length; i++) {
        ajuste = Math.abs(cejaDerFinal[i].y - cejaDerInicial[i].y) / (framesTotales - framesAnimados);
        if (cejaDerFinal[i].y < cejaDerInicial[i].y) {
            cejaDerInicial[i].y -= ajuste;
        }
        if (cejaDerFinal[i].y > cejaDerInicial[i].y) {
            cejaDerInicial[i].y += ajuste;
        }

        ajuste = Math.abs(cejaDerFinal[i].x - cejaDerInicial[i].x) / (framesTotales - framesAnimados);
        if (cejaDerFinal[i].x < cejaDerInicial[i].x) {
            cejaDerInicial[i].x -= ajuste;
        }
        if (cejaDerFinal[i].x > cejaDerInicial[i].x) {
            cejaDerInicial[i].x += ajuste;
        }
        if (cejaDerFinal[i].x != cejaDerInicial[i].x) {
            animTerminada = false;
        }
        if (cejaDerFinal[i].y != cejaDerInicial[i].y) {
            animTerminada = false;
        }

        ajuste = Math.abs(cejaIzqFinal[i].y - cejaIzqInicial[i].y) / (framesTotales - framesAnimados);
        if (cejaIzqFinal[i].y < cejaIzqInicial[i].y) {
            cejaIzqInicial[i].y -= ajuste;
        }
        if (cejaIzqFinal[i].y > cejaIzqInicial[i].y) {
            cejaIzqInicial[i].y += ajuste;
        }

        ajuste = Math.abs(cejaIzqFinal[i].x - cejaIzqInicial[i].x) / (framesTotales - framesAnimados);
        if (cejaIzqFinal[i].x < cejaIzqInicial[i].x) {
            cejaIzqInicial[i].x -= ajuste;
        }
        if (cejaIzqFinal[i].x > cejaIzqInicial[i].x) {
            cejaIzqInicial[i].x += ajuste;
        }

        if (animTerminada) {
            if (cejaIzqFinal[i].x != cejaIzqInicial[i].x) {
                animTerminada = false;
            }
            if (cejaIzqFinal[i].y != cejaIzqInicial[i].y) {
                animTerminada = false;
            }
        }
    }

    // Ciclo de animación.
    framesAnimados++;
    kathia_renderer.render(stage);
    console.log("Animando : " + framesAnimados);
    
    if (framesAnimados == 0 || !animTerminada) {
        requestAnimationFrame(animate);
    } else {
        console.log("Pausado.");
        pausado_kathia=true;
        framesAnimados = 0;
        if (tiempodeEspera > 0) {
            timer = setInterval(
            function () {
                actualizarMatricesFinales();
                pausado_kathia=false;
                console.log("Fin Timer : " + timer);
                tiempodeEspera = 0;
                clearInterval(timer);
            }, tiempodeEspera);
        } else {
            if (coladeAnimacion.length != 0) {
                pausado_kathia=false;
                actualizarMatricesFinales();
            }
        }
    }
}

function clonar(A) {
    var B = [];
    for (var i = 0; i < A.length; i++) {
        B.push(A[i].clone());
    }
    return B;
}



/**
 * 
 * @returns {undefined}
 */
 
var pausado_kathia=false;
function iniciarKathia(){
    document.getElementById("kathia").appendChild(canvas_kath);
    redimensionarKathia("640px","480px");
    expresionCognitiva("saludo");    
    actualizarMatricesFinales();
}

/**
 * 
 * @param {type} width
 * @param {type} heigth
 * @returns {undefined}
 */
function redimensionarKathia(width, heigth) {
    canvas_kath.style.width = width;
    canvas_kath.style.heigth = heigth;
};

/**
 * 
 * @param {type} textoGlobo
 * @returns {undefined}
 */
function agregarDialogo(textoGlobo){
    textoDialogo.text = textoGlobo;
    stage.addChild(dialogo);
};

/**
 * 
 * @returns {undefined}
 */
function removerDialogo() {
    stage.removeChild(dialogo);
};


// Función platicar() no utilizada
/*
function platicar() {
    caja.value = '\n Yo: ' + txt.value + '\n' + caja.value;
    dialogo = "...";
    tipoEntrada = "irrelevante";
    limpiarColadeAnimacion();
    switch (txt.value) {//clasificacion de dialogos y obtencion de respuesta
        case "hola!":
        case "hi":
        case "hola":
            tipoEntrada = "saludo";
            dialogo = "que gusto saludarte";
            break;

        case "adios!":
        case "ciao":
        case "adios":
            tipoEntrada = "despedida";
            dialogo = "nos vemos luego";
            break;

        case "2+2=5":
        case "el cielo es rosa":
            tipoEntrada = "error";
            dialogo = "eso no es correcto...";
            break;

        case "2+2=4":
        case "el cielo es azul":
            tipoEntrada = "acierto";
            dialogo = "bien, eso es correcto!";
            break;

        case "parpadeas?":
            tipoEntrada = "pregunta";
            dialogo = "se hacerlo, pero no lo necesito";
            break;

        case "se guinar!":
            tipoEntrada = "afirmacion";
            dialogo = "yo tambien ;)";
            break;

        case "que eres?":
            tipoEntrada = "pregunta";
            dialogo = "yosoy *BEEP* unachica *BEEP* robot *BEEP*";
            break;

        case "pizza!":
            tipoEntrada = "aviso";
            dialogo = "donde?";
            break;

        case "ovni!":
            tipoEntrada = "alarma";
            dialogo = "wow!";
            break;

        case "fea":
            tipoEntrada = "ofensa";
            dialogo = "JUM!";
            break;

        case "linda":
            tipoEntrada = "alago";
            dialogo = "gracias por notarlo";
            break;

        default:
    }

    expresionCognitiva();
    actualizarMatricesFinales();

    caja.value = '\nKathia: ' + dialogo + '\n' + caja.value;
    txt.value = '';
    txt.focus();
}
*/
