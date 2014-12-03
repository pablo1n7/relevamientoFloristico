$.mvc.controller.create("aplicacion", {
    views:["js/vista/main.tpl",'js/vista/pruebaItems.tpl'], //These are the views we will use with the controller
    init:function(){
    },
    default:function(){
       /* Y.use(["plantaModelo","itemModelo"],function(){
            planta = new Y.Planta();
            planta.set("nombre","Plantirius");
            item = new Y.Item();
            $("#main").html($.template('js/vista/main.tpl',{item:item,planta:planta}));
        });*/
        $("#main").html($.template('js/vista/pruebaItems.tpl'));

    },
    crearPropiedad:function(){
        var tipo = $("#tipoPropiedad").val();
        var item = null;
        switch (tipo){
           case "Numerico":
                Y.use(['numericoModelo'],function(){
                    item = Y.Numerico.getInstancia();
                    $("#propiedades").append(item.representacion("Propiedad"));
                });
                break;
           case "Alfa":
                Y.use(['alfanumericoModelo'],function(){
                    item = Y.Alfanumerico.getInstancia();
                    $("#propiedades").append(item.representacion("Propiedad"));

                });
                break;
           default:
               alert('Cree un tipo');
               break;
        }
        $("#propiedades").append("<br>");
    }
});
