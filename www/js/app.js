/*
 * Please see the included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false app:false, dev:false, cordova:false */



// This file contains your event handlers, the center of your application.
// See app.initEvents() in init-app.js for event initialization.

// function myEventHandler() {
//     "use strict" ;
// // ...event handler code here...
// }


// ...additional event handlers here...

//createTablas();
//vaciarBD();

var app = new $.mvc.app();
//app.controllersDir("../controllers/"); //Set the directory to your controllers folder if it is not named "controllers".
app.controllersDir("js/controlador/");



Y.use(['campaniaModelo','alfanumericoModelo','enumeradoModelo','especieModelo','familiaModelo','ejemplarModelo','numericoModelo','plantaModelo','tipoEjemplarModelo','ejemplarEspecieModelo','propiedadModelo','tipoPropiedadModelo','valorModelo','puntoModelo','rangoModelo','sueloModelo','transectaModelo','visitaModelo'],function(){
app.loadControllers(["aplicacion"]); //You can pass in array or a string.  You do not need to reference the .js extension.
app.ready(function(){

    diccionarioAyuda = {
        "#crearFamilia":{
            "nombreFamilia":{
                titulo:"Nombre de la familia biologica",
                mensaje:"Nombre que representara a la familia biologica. Nota: El nombre debe empezar con letra"
            },
            "crearFamilia":{
                titulo:"Crear Familia",
                mensaje:"Permite crear la nueva familia"
            }
        },
        "#crearTipoEjemplar":{
            "agregarPropiedadExistente":{
                titulo:"Agregar Propiedad Existente",
                mensaje: "Permite agregar una propiedad creada con anterioridad."
            },
            "agregarPropiedad":{
                titulo:"Agregar Propiedad",
                mensaje: "Permite crear una nueva propiedad y asociarla al tipo"
            },
            "crearTipo":{
                titulo:"Crear Tipo",
                mensaje: "Permite crear un tipo nuevo de ejemplar."
            },
            "nombre":{
                titulo:"Nombre de Propiedad",
                mensaje:"Nombre que identifica/rá a la propiedad "
            },
            "descripcion":{
                titulo:"Descripción de Propiedad",
                mensaje:"Breve descripción de lo que representa la propiedad (opcional)"
            },
            "tipoPropiedad":{
                titulo:"Tipos de Propiedades",
                mensaje:"Selección del tipo de propiedad que se desea crear. Los tipos admitidos son:<br>Alfanumerico: Admite cualquier tipo de caracter.<br>Numérico: Solo valores Numéricos.<br>Rango:Permite definir la selección de un valor numérico entre 2 extremos (inferior y superior) dados.<br>Enumerado: Define una lista de elementos entre los que se podrá seleccionar solo uno"
            },
            "nombreTipo":{
                titulo:"Nombre de Tipo",
                mensaje:"El nombre que define al Tipo de Ejemplar"
            },
            "descripcionTipo":{
                titulo:"Descripción del Tipo Ejemplar",
                mensaje:"Una breve descripción de lo que se quiere representar con el Tipo actual"
            }
        },
        "#familias":{
            "botonFuncionalidad":{
                titulo:"Agregar una Familia",
                mensaje:"Permite agregar una nueva familia"
            },
            "listaFamilias":{
                titulo:"Lista de Familias",
                mensaje:"Lista todas las familias agregadas"
            }
        },
        "#tipoEjemplares":{
            "botonFuncionalidad":{
                titulo:"Crear Tipo",
                mensaje:"Permite crear un nuevo Tipo de Ejemplar"
            },
            "listaTipos":{
                titulo:"Lista de Tipos",
                mensaje:"Lista todos los tipos de Ejemplares agregados"
            }
        },
        "#especies":{
            "botonFuncionalidad":{
                titulo:"Agregar una Especie",
                mensaje:"Permite agregar una nueva especie"
            },
            "listaEspecies":{
                titulo:"Lista de especies",
                mensaje:"Lista todas las especies agregadas. Toque en una especie para ver información detallada de la misma"
            }
        },
        "#crearEspecie":{
            "nombreEspecie":{
                titulo:"Nombre de la Especie",
                mensaje:"Nombre que representara a la nueva Especie. Nota: El nombre debe empezar con letra"
            },
        "familiaEspecie":{
                titulo:"Familia de la Especie",
                mensaje:"Nombre de la familia a la que pertenece la nueva Especie."
            },
        "formaBiologica":{
                titulo:"Forma biológica de la Especie",
                mensaje:"Forma biológica a la que pertenece la nueva Especie."
            },
        "tipoBiologico":{
                titulo:"Tipo Biológico de la Especie",
                mensaje:"Tipo biológico al que pertenece la nueva Especie."
            },
        "estadoConservacion":{
                titulo:"Estado de Conservación de la Especie",
                mensaje:"Estado de Conservación de la nueva Especie."
            },
        "distribucionGeografica":{
                titulo:"Distribucion Geográfica de la Especie",
                mensaje:"Distribucion Geográfica de la nueva Especie."
            },
        "indiceCalidad":{
                titulo:"Indice de Calidad de la Especie",
                mensaje:"Indice de Calidad de la nueva Especie."
            },
        "forrajera":{
                titulo:"Estado Forrajero de la Especie",
                mensaje:"Indicar si la nueva Especie es o no forrajera."
            },
        "crearEspecie":{
                titulo:"Crear Especie",
                mensaje:"Da por finalizada la edición y crea una nueva Especie con los datos completados."
            },
        }
    };


    popularBD();
    $.mvc.route("aplicacion/");
    comprobandoHardware();
    nivelBateria = 0;
    verificarBateria();
});
});




/*app.loadModels("pomodoro");
app.loadModels("historiaUsuario");
*/

//Now let's run code on app.ready and load the default action for the hello controller.


