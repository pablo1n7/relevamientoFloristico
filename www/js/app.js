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

createTablas();
var app = new $.mvc.app();
//app.controllersDir("../controllers/"); //Set the directory to your controllers folder if it is not named "controllers".
app.controllersDir("js/controlador/");



Y.use(['campaniaModelo','alfanumericoModelo','enumeradoModelo','especieModelo','familiaModelo','ejemplarModelo','numericoModelo','tipoEjemplarModelo','ejemplarEspecieModelo','propiedadModelo','tipoPropiedadModelo','valorModelo','puntoModelo','rangoModelo','sueloModelo','transectaModelo','visitaModelo'],function(){
app.loadControllers(["aplicacion"]); //You can pass in array or a string.  You do not need to reference the .js extension.
app.ready(function(){

    diccionarioAyuda = {"#crearTipoEjemplar":{"agregarPropiedadExistente":{titulo:"Agregar Propiedad Existente",mensaje: "Permite agregar una propiedad creada con anterioridad."},"agregarPropiedad":{titulo:"Agregar Propiedad",mensaje: "Permite crear una nueva propiedad y asociarla al tipo"},"crearTipo":{titulo:"Crear Tipo",mensaje: "Permite crear un tipo nuevo de ejemplar."},"nombre":{titulo:"Nombre de Propiedad",mensaje:"Nombre que identifica/rá a la propiedad "},"descripcion":{titulo:"Descripción de Propiedad",mensaje:"Breve descripción de lo que representa la propiedad (opcional)"},"tipoPropiedad":{titulo:"Tipos de Propiedades",mensaje:"Selección del tipo de propiedad que se desea crear. Los tipos admitidos son:<br>Alfanumerico: Admite cualquier tipo de caracter.<br>Numérico: Solo valores Numéricos.<br>Rango:Permite definir la selección de un valor numérico entre 2 extremos (inferior y superior) dados.<br>Enumerado: Define una lista de elementos entre los que se podrá seleccionar solo uno"},"nombreTipo":{titulo:"Nombre de Tipo",mensaje:"El nombre que define al Tipo de Ejemplar"},"descripcionTipo":{titulo:"Descripción del Tipo Ejemplar",mensaje:"Una breve descripción de lo que se quiere representar con el Tipo actual"}}};

    $.mvc.route("aplicacion/");
});
});




/*app.loadModels("pomodoro");
app.loadModels("historiaUsuario");
*/

//Now let's run code on app.ready and load the default action for the hello controller.


