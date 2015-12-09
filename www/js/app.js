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
        "#uib_page_1":{
            "listaCampañas":{
                titulo:"Lista de Campañas",
                mensaje:"Lista todas la campañas existentes en el dispositivo."
            },
            "botonFuncionalidad":{
                titulo:" + / Desactivar",
                mensaje:" +: Permite agregar una nueva campaña. <br><br> Desactivar: desactiva la campaña en curso."
            },
            "empezarVisita":{
                titulo:"Boton de Empezar Transecta",
                mensaje:"Permite crear una nueva transecta y dar automaticamente inicio a su primer visita."
            },
            "listaTransectasCampaña":{
                titulo:"Lista Transectas de la Campaña Activa",
                mensaje:"Listado de todas las transectas de la campaña almacenadas en el dispositivo. Para iniciar una visita de una transecta ya creada, presionar sobre alguna de las existentes en la lista."
            }
            
        },
        
        "#crearTransecta":{
            "ambiente":{
                titulo:"Ambiente",
                mensaje:"Descripcion representiva del ambiente de la transecta."
            },
            "cuadro":{
                titulo:"Cuadro",
                mensaje:"Nombre del cuadro de campo en que se inicia la transecta."
            },
            "distanciaEntrePuntos":{
                titulo:"Distancia entre Puntos",
                mensaje:"Representa el valor en metros de la distancia por la que deben estar separados los puntos."
            },
            "crearTransecta":{
                titulo:"Crear Transecta",
                mensaje:"Permite finalizar el proceso de creación de una transecta, y da automáticamente inicio a su primer visita."
            },
            "brujula":{
                titulo:"Brújula",
                mensaje:"Brújula utilizada para marcar la dirección en que se debe avanzar para realizar la transecta."
            },
            "especiesPredominantes":{
                titulo:"Especies Predominantes",
                mensaje:"Opcionalmente, se puede colocar las 3 especies que a simple vista parecen las más representativas del ambiente. Las especies elegidas seran sugeridas en primer lugar"
            }
        },
        
        
        "#mainsub":{
            "justgageTransecta":{
                titulo:"Indicadores de Control",
                mensaje:"Fin de Transecta: Cantidad de metros que faltan para finalizar la visita. <br><br> Porcentaje Transecta: porcentaje de la visita completado.<br><br> Nivel de Bateria: nivel actual de bateria del dispositivo.<br><br> "
            },
            "agregarPunto":{
                titulo:"Agregar Punto",
                mensaje:""
            },
            "agregarFotoTransecta":{
                titulo:"Tomar Foto",
                mensaje:"Permite tomar una foto y asociarla a la visita actual."
            },
            "agregarRecolectable":{
                titulo:"Agregar Adjunto a la Visita",
                mensaje:""
            },
            "indicadorSeguimiento":{
                titulo:"Indicador de Seguimiento",
                mensaje:"Funciona como una brújula, indicando el sentido en que se debe avanzar para completar correctamente la visita. Para ello se debe mantener la aguja dentro de los márgenes verdes.<br>Para su correcto funcionamiento se recomienda no utilizar elementos magnetizados cerca del dispositivo."
            },
            
            "bienvenido":{
                titulo:"Bienvenido!",
                mensaje:" Bienvenido a Leaf-Lab. Esta es una aplicacion desarrollada por alumnos de la UNPSJB. El mismo fue desarrollado con el fin de ser una herramienta de apoyo a las actividades de relevamiento realizada por los científicos de la universidad. <br><br>Colaboradores: Lic. Firmenich Diego, Dra. Cynthia Gonzalez, Lic. Maria R. Klagges, Almonacid J. Samuel, Navarro J. Pablo."
            },
            
            "ayudaTouch":{
                titulo:"Sobre la Ayuda!",
                mensaje:"Cada ventana posee una ayuda a la cual usted puede acceder mediante un 'doble tab' y presionando sobre el componente sobre el que quiera aprender. Los elementos que poseen ayuda se denotan con un simbolo de pregunta azul. "
            }
            
        
        },
        "#crearCampaña":{
            "crearCampaña":{
                titulo:"Crear Campaña",
                mensaje:"Da por finalizado el proceso de creación y agrega una nueva Campaña con los datos ingresados."
            },
            "nombreCampaña":{
                titulo:"Nombre de la Campaña",
                mensaje:"Nombre que representara a la Campaña creada. Nota: El nombre debe empezar con letra."
            },
            "descripcionCampaña":{
                titulo:"Descripcion de la Campaña",
                mensaje:"Breve descripción de la campaña (opcional)."
            }
        },
        "#uib_page_3":{
        // EMPEZO LA EDICION DE NOMBRES EN EL CÓDIGO!!!
            "listaEjemplares":{
                titulo:"Listar Ejemplares",
                mensaje:"Accede a la información y funcionalidades permitidas para 'Tipos de Ejemplares' definidos por el Usuario."
            },
            "listaEspecies":{
                titulo:"Listar Especies",
                mensaje:"Accede a la información y funcionalidades permitidas para las Especies."
            },
            "listaFamilias":{
                titulo:"Listar Familias",
                mensaje:"Accede a la información y funcionalidades permitidas para las Familias."
            },
            "sincronizacion":{
                titulo:"Sincronización",
                mensaje:"Accede a la función de sincronización de la aplicación."
            },
            "configuracion":{
                titulo:"Configuración",
                mensaje:"Permite acceder a algunas configuraciones del sistema."
            }
            
        },
        
        "#uib_page_2":{
            "imgVisita":{
                titulo:"Imágenes",
                mensaje:"Una lista de todas las imágenes asociadas a la transecta durante la visita."
            },
            "adjuntoVisita":{
                titulo:"Adjuntos",
                mensaje:"Presenta una lista de los elementos que sin pertenecer a ningún punto fueron agregados a la visita."
            },
            "puntosVisita":{
                titulo:"Puntos Recolectados",
                mensaje:"Muestra los puntos que han sido recolectados en la visita, permitiendo acceder (mediante un toque) a información más detallada de los mismos."
            },
            "infoVisita":{
                titulo:"Visita",
                mensaje:"Presenta al usuario la información básica de la visita, como el ambiente, la fecha y el número de visita en caso de haber varias."
            }
        },
        
        
        
        
        "#modalContainer":{
            "seleccionarPropiedad":{
                titulo:"Boton Selección",
                mensaje:"Boton que confirma la adición de las propiedades seleccionadas de la lista."
            },
            "propiedades":{
                titulo:"Lista de Propiedades",
                mensaje:"Pantalla de seleccion de propiedades existentes. En esta pantalla, puede probar el funcionamiento de las propiedades ya creadas, para un mejor criterio de selección. Seleccione tocando en el cuadro de la izquierda de la propiedad que desea agregar"
            },
            "divTipoSuelo":{
                titulo:"Tipo de Suelo",
                mensaje:"Selector del tipo de suelo sobre el que cayo la aguja."
            },
            "agregarItem":{
                titulo:"Agregar Ítem",
                mensaje:"Permite añadir al punto un Ítem de tipo de ejemplar definido por el usuario."
            },
            "agregarPlanta":{
                titulo:"Agregar Planta",
                mensaje:"Permite añadir una nueva planta al punto."
            },
            "crearPunto":{
                titulo:"Crear Punto",
                mensaje:"Da por finalizada la creación del punto y almacena el mismo con los elementos ya adjuntos. En caso de ser el primero o el último, se tomarán datos del GPS lo cual puede demorar la operación."
            },
            "toquesPlanta":{
                titulo:"Toques de la Planta",
                mensaje:"Representa la cantidad de veces que la plantaalcanzó la aguja. Esta opción sólo esta disponible para el tipo de punto 'Toque Directo'."
            },
            "estadoFenologico":{
                titulo:"Estado Fenológico",
                mensaje:"Representa el estado de desarrollo en que se encuentra la planta."
            },
            "especie":{
                titulo:"Especie",
                mensaje:"Permite filtrar y seleccionar entre las especies almacenadas en el dispositivo aquella que corresponde con la planta."
            },
            "fotoEspecie":{
                titulo:"Foto Especie",
                mensaje:"Permite visualizar una foto representativa de la especie. Esto solo es posible en caso de que la especie posea una imagen asociada en el servidor."
            },
            "camara":{
                titulo:"Tomar Fotografía",
                mensaje:"Permite capturar una fotografía y asociarla al elemento. En caso de que ya haya una imágen asociada, la misma será reemplazada.<br>Al tomar una fotografía, aparecerá el ícono de un ojo en la cabecera del elemento, el cual permite visualizar la imagen capturada."
            },
            "eliminarAdjunto":{
                titulo:"Eliminar",
                mensaje:"Elimina del punto el elemento y toda la información asociada al mismo."
            },
            "tipoEjemplares":{
                titulo:"Tipos de Ejemplar",
                mensaje:"Selección del tipo de ejemplar al que pertenece el elemento a agregar."
            },
            
            "agregarAdjuntoDiv":{
                titulo:"Tipo de Adjunto",
                mensaje:"Selección del tipo de adjunto que se desea agregar."
            },
            
            "listaEstadoPunto":{
                titulo:"Estado de Punto",
                mensaje:"Selección del estado de la aguja con respecto a las especies del ambiente."
            }
            
        },
        
        "#crearFamilia":{
            "nombreFamilia":{
                titulo:"Nombre de la familia biologica",
                mensaje:"Nombre que representara a la familia biologica. Nota: El nombre debe empezar con letra."
            },
            "crearFamilia":{
                titulo:"Crear Familia",
                mensaje:"Permite crear la nueva familia."
            }
        },
        
        
        "#crearTipoEjemplar":{
            "agregarPropiedadExistente":{
                titulo:"Agregar Propiedad Existente",
                mensaje: "Permite agregar una propiedad creada con anterioridad."
            },
            "agregarPropiedad":{
                titulo:"Agregar Propiedad",
                mensaje: "Permite crear una nueva propiedad y asociarla al tipo."
            },
            "crearTipo":{
                titulo:"Crear Tipo",
                mensaje: "Permite crear un tipo nuevo de ejemplar."
            },
            "nombre":{
                titulo:"Nombre de Propiedad",
                mensaje:"Nombre que identifica/rá a la propiedad."
            },
            "descripcion":{
                titulo:"Descripción de Propiedad",
                mensaje:"Breve descripción de lo que representa la propiedad (opcional)."
            },
            "tipoPropiedad":{
                titulo:"Tipos de Propiedades",
                mensaje:"Selección del tipo de propiedad que se desea crear. Los tipos admitidos son:<br>Alfanumerico: Admite cualquier tipo de caracter.<br>Numérico: Solo valores Numéricos.<br>Rango:Permite definir la selección de un valor numérico entre 2 extremos (inferior y superior) dados.<br>Enumerado: Define una lista de elementos entre los que se podrá seleccionar solo uno."
            },
            "nombreTipo":{
                titulo:"Nombre de Tipo",
                mensaje:"El nombre que define al Tipo de Ejemplar."
            },
            "descripcionTipo":{
                titulo:"Descripción del Tipo Ejemplar",
                mensaje:"Una breve descripción de lo que se quiere representar con el Tipo actual."
            }
        },
        "#familias":{
            "botonFuncionalidad":{
                titulo:"Agregar una Familia",
                mensaje:"Permite agregar una nueva familia."
            },
            "listaFamilias":{
                titulo:"Lista de Familias",
                mensaje:"Lista todas las familias agregadas."
            }
        },
        "#tipoEjemplares":{
            "botonFuncionalidad":{
                titulo:"Crear Tipo",
                mensaje:"Permite crear un nuevo Tipo de Ejemplar."
            },
            "listaTipos":{
                titulo:"Lista de Tipos",
                mensaje:"Lista todos los tipos de Ejemplares agregados."
            }
        },
        "#especies":{
            "botonFuncionalidad":{
                titulo:"Agregar una Especie",
                mensaje:"Permite agregar una nueva especie."
            },
            "listaEspecies":{
                titulo:"Lista de especies",
                mensaje:"Lista todas las especies agregadas. Toque en una especie para ver información detallada de la misma."
            }
        },
        "#crearEspecie":{
            "nombreEspecie":{
                titulo:"Nombre de la Especie",
                mensaje:"Nombre que representara a la nueva Especie. Nota: El nombre debe empezar con letra."
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
        },
        
        "#sincronizacion":{
            "buscarServidores":{
                titulo:"Buscar Servidor",
                mensaje:"Comienza la busqueda de los servidores con el parametro establecido. El puerto utilizado es el definido en 'configuración'."
            },
            "listaDispositivos":{
                titulo:"Lista de los Servidores",
                mensaje:"Lista de los servidores encontrados en la búsqueda."
            },
            "direccionServidor":{
                titulo:"Direccion del Servidor",
                mensaje:"Dirección en donde se buscará el servidor. Se reconoce tanto el formato URL como IP."
            },
            "botonSincronizar":{
                titulo:"Boton de Sincronización",
                mensaje:"Inicia la sincronización con el servidor, esta acción puede llevar varios minutos."
            }
        },
        "#configuracion":{
            "puertoServidor":{
                titulo:"Puerto del Servidor",
                mensaje:"Puerto en donde se buscará el servidor."
            },
            "direccionServidor":{
                titulo:"Direccion del Servidor",
                mensaje:"Dirección en donde se buscará el servidor. Se reconoce tanto el formato URL como IP."
            },
            "guardarConfi":{
                titulo:"Guardar Configuración",
                mensaje:"Da por finalizada la edición de configuraciones y vuelve a 'Miscelaneas'."
            }
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


