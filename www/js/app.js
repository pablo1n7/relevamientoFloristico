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

var app = new $.mvc.app();
//app.controllersDir("../controllers/"); //Set the directory to your controllers folder if it is not named "controllers".
app.controllersDir("js/controlador/");



app.loadControllers(["aplicacion"]); //You can pass in array or a string.  You do not need to reference the .js extension.
/*app.loadModels("pomodoro");
app.loadModels("historiaUsuario");
*/

//Now let's run code on app.ready and load the default action for the hello controller.

app.ready(function(){
    $.mvc.route("aplicacion/");
});
