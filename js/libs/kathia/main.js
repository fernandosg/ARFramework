/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */





/**
 * 
 * @param {String} opcion
 * @returns {undefined}
 * 
 * Función platicarModificada() la cual acepta una cadena de texto como
 * indice para escoger el tipo de entrada y desencadenar las emociones.
 * 
 * También recibe tres cadenas que muestran un msg de acierto o de fallo
 * a la hora de jugar al memorama.
 */
function clasificarOpcion(opcion) {
    //salidaTexto.value = '\n    Yo: ' + entradaTexto.value + '\n' + salidaTexto.value;
    var dialogoKathia = "...";
    var dialogo = "";
    var tipoAudio  = "";
    var tipoEntrada = "irrelevante";

    limpiarColadeAnimacion();
    removerDialogo();

    switch (opcion) {//clasificacion de dialogos y obtencion de respuesta.
        case "init":
            iniciarKathia();
            break;
        // Despliega un msg de bienvenida.
        case "bienvenida":
            tipoEntrada = "saludo";
            
            dialogo = "Bienvenido";
            tipoAudio = "bienvenida";
            break;
            
        // Despliega un msg de instrucciones para el memorama
        case "instrucciones":
            tipoEntrada = "aviso";

            dialogo = "instrucciones";
            tipoAudio = "instrucciones";
            break;

        // Despliega un msj de acierto para el memorama.
        case "acierto":
            tipoEntrada = "acierto";
            dialogoKathia = "bien, eso es correcto!";
            
            dialogo = "¡¡Acertaste!!";
            tipoAudio = "acierto";
            break;
            
        // Despliega un msj de fallo para el memorama.
        case "fallo":
            tipoEntrada = "error";
            dialogoKathia = "intenta nuevamente!";

            dialogo = "¡¡Fallaste!!";
            tipoAudio = "fallo";
            break;

        // Despliega un msj de finalizar para el memorama.
        case "finalizar":
            tipoEntrada = "aviso";
            dialogoKathia = "gracias por jugar!";
            
            dialogo = "¡¡Gracias!!";
            tipoAudio = "finalizar";
            break;
            
        // Despliega un msg de saludo.
        case "hola!":
        case "hi":
        case "hola":
            tipoEntrada = "saludo";
            dialogoKathia = "que gusto saludarte";

            dialogo = "¡¡Hola!!";
            tipoAudio = "saludo";
            break;

        // Despliega un msg de despedida.
        case "adios!":
        case "ciao":
        case "adios":
            tipoEntrada = "despedida";
            dialogoKathia = "nos vemos luego";

            dialogo = "¡¡Adios!!";
            tipoAudio = "despedida";
            break;
            
        // --------------------------------------------------------- //
        // Despliega un msj de Fallo cuando hay un intento no valido
        // a la hora de jugar memorama.
        case "error_por_intento":
            tipoEntrada = "error";
            dialogoKathia = "error por intentos...";

            dialogo = "¡¡Error 01!!";
            tipoAudio = "error";
            break;

        // Despliega un msj de Error cuando se excede el tiempo para
        // jugar al memorama.
        case "error_por_tiempo":
            tipoEntrada = "error";
            dialogoKathia = "error por tiempo...";

            dialogo = "¡¡Error 02!!";
            tipoAudio = "error";
            
            break;
            
        default:
    }

    if (dialogo != "") {
        seleccionarAudio(tipoAudio);
    } 
    
    expresionCognitiva(tipoEntrada);
    actualizarMatricesFinales();
}


// Iniciar Kathia
//iniciarKathia();
