$.mvc.controller.create("aplicacion", {
    views:["js/vista/main.tpl",'js/vista/pruebaItems.tpl','js/vista/crearPerfil.tpl'], //These are the views we will use with the controller
    init:function(){
    },
    default:function(){
       /* Y.use(["plantaModelo","itemModelo"],function(){
            planta = new Y.Planta();
            planta.set("nombre","Plantirius");
            item = new Y.Item();
            $("#main").html($.template('js/vista/main.tpl',{item:item,planta:planta}));
        });*/

        var tiposPropiedad=["Alfanumerico","Enumerado","Numerico","Rango"];
        $("#main").html($.template('js/vista/crearPerfil.tpl',{tipos:tiposPropiedad}));

    },
    crearPropiedad:function(){
        var tipo = $("#tipoPropiedad").val();
        var item = null;
        switch (tipo){
           case "Numerico":
//                Y.use(['numericoModelo'],function(){
                    item = Y.Numerico.getInstancia();
                    return item;
                    //$("#propiedades").append(item.representacion("Propiedad"));
                //});
                break;
           case "Alfanumerico":
//                Y.use(['alfanumericoModelo'],function(){
                    item = Y.Alfanumerico.getInstancia();
                    return item;
                    //$("#propiedades").append(item.representacion("Propiedad"));

                //});
                break;
           default:
               alert('Cree un tipo');
               break;
        }
        $("#propiedades").append("<br>");
    },
    crearPerfil:function(){
        var campos = $("#campos").children();
        var nombrePerfil = $("#nombrePerfil").val();
        perfil = new Y.Perfil({'nombre':nombrePerfil});
        for (var i = 0; i<campos.length;i++){
            var item = campos[i];
            var tipo = $(item).find('[name|=tipoPropiedad]').val();
            var nombre =  $(item).find('[name|=nombre]').val();
            switch (tipo){
                case "Numerico":
                    tipo = Y.Numerico.getInstancia();
                    break;
                case "Alfa":
                    tipo = Y.Alfanumerico.getInstancia();
                    break;
            }
            var propiedad = new Y.Propiedad({'nombre':nombre,'tipo':tipo});
            perfil.agregarPropiedad(propiedad);
        }

    }
});
