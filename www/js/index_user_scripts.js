(function()
{
 "use strict";
 /*
   hook up event handlers
 */
 function register_event_handlers()
 {


         $(document).on("click", ".uib_w_7", function(evt)
        {
         activate_subpage("#mainsub");
        });
        $(document).on("click", ".uib_w_6", function(evt)
        {
         activate_subpage("#uib_page_1");
        });
        $(document).on("click", ".uib_w_5", function(evt)
        {
         activate_subpage("#uib_page_2");
        });
        $(document).on("click", ".uib_w_4", function(evt)
        {
         activate_subpage("#uib_page_3");
        });

        $(document).on("click", ".uib_w_11", function(evt)
        {
             /*$.mvc.route("aplicacion/listaPerfiles");
             activate_subpage("#perfiles"); */
        });
}

    $.ui.useOSThemes=false;
 document.addEventListener("app.Ready", register_event_handlers, false);
})();
