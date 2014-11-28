$.mvc.controller.create("aplicacion", {
    views:["js/vista/main.tpl"], //These are the views we will use with the controller
    init:function(){
    },
    default:function(){
        Y.use(["plantaModelo","itemModelo"],function(){
            planta = new Y.Planta();
            planta.set("nombre","Plantirius");
            item = new Y.Item();
            $("#main").html($.template('js/vista/main.tpl',{item:item,planta:planta}));
        });
        /*$("#main").html($.template('js/vista/main.tpl',{item:item1}));*/

    }
});
