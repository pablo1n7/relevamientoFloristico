(function()
{
 "use strict";
 /*
   hook up event handlers
 */
 function register_event_handlers()
 {


         $(document).on("click", ".uib_w_7", function(evt){
            /*activate_subpage("#mainsub");
            desactivarBotonesHeader();
            */
             activarSubPagina("#mainsub","Inicio");
             refrescarJustgage();

        });
        $(document).on("click", ".uib_w_6", function(evt){
            /*activate_subpage("#uib_page_1");
            desactivarBotonesHeader();*/
            $.mvc.route("aplicacion/listaCampanias");

            //activarSubPagina("#uib_page_1","Campaña");
        });
        $(document).on("click", ".uib_w_5", function(evt){
            /*activate_subpage("#uib_page_2");
            desactivarBotonesHeader();*/
             activarSubPagina("#uib_page_2","Puntos");
            $.mvc.route("aplicacion/verPuntos");

        });
        $(document).on("click", ".uib_w_4", function(evt){
            /*activate_subpage("#uib_page_3");
            desactivarBotonesHeader();*/
            activarSubPagina("#uib_page_3","Miscelánea");
        });

        $(document).on("click", ".uib_w_11", function(evt){
             /*$.mvc.route("aplicacion/listaPerfiles");
             activate_subpage("#perfiles"); */
        });
}

    $.ui.useOSThemes=false;
 document.addEventListener("app.Ready", register_event_handlers, false);
})();
