$.mvc.controller.create("aplicacion", {
    views:["js/vista/main.tpl",'js/vista/cargarItem.tpl','js/vista/crearPerfil.tpl'], //These are the views we will use with the controller
    init:function(){
        perfiles=[];
    },
    default:function(){

        Y.Perfil.obtenerPerfiles();
        var tiposPropiedad={"Alfanumerico":Y.Alfanumerico.representacionComoCrear,"Enumerado":Y.Enumerado.representacionComoCrear,"Numerico":Y.Numerico.representacionComoCrear,"Rango":Y.Rango.representacionComoCrear};
        $("#main").html($.template('js/vista/crearPerfil.tpl',{tipos:tiposPropiedad}));

    },
    crearPerfil:function(){
        var tiposConstantes = ["Alfanumerico","Enumerado","Numerico","Rango"];
        var campos = $("#campos").children();
        var nombrePerfil = $("#nombrePerfil").val();
        var descripcionPerfil = $("#descripcionPerfil").val();
        var perfil = new Y.Perfil({'nombre':nombrePerfil,'descripcion':descripcionPerfil});
        for (var i = 0; i<campos.length;i++){
            var item = campos[i];
            var tipo = tiposConstantes[$(item).find('[name|=tipoPropiedad]').get(0).selectedIndex];
            var nombre =  $(item).find('[name|=nombre]').val();
            var descripcion = $(item).find('[name|=descripcion]').val();
            var tipoPropiedad = null;
            switch (tipo){
                case "Numerico":
                    tipoPropiedad = Y.Numerico.getInstancia();
                    break;
                case "Alfanumerico":
                    tipoPropiedad = Y.Alfanumerico.getInstancia();
                    break;
                case "Rango":
                    var valorMin = $(item).find('[name|=valorMin]').val();
                    var valorMax = $(item).find('[name|=valorMax]').val();
                    tipoPropiedad = new Y.Rango({'valorMin':valorMin,'valorMax':valorMax});
                    break;
                case "Enumerado":
                    var valores = $(item).find('[name|=valores]').val().split(',');
                    tipoPropiedad = new Y.Enumerado({'valores':valores});

                    break;
            }
            var propiedad = new Y.Propiedad({'nombre':nombre,'descripcion':descripcion,'tipo':tipoPropiedad});
            perfil.agregarPropiedad(propiedad);
        }
        perfil.save();
        perfiles.push(perfil);
    },

    seleccionarItem: function(){
        $("#main").html($.template('js/vista/cargarItem.tpl',{perfiles:perfiles}));
        $.mvc.route("aplicacion/crearItem");
    },

    crearItem:function(){
        console.log("Funcion Crear Item");
        indexPerfil = $("#perfiles").get(0).selectedIndex;
        var seleccion = perfiles[indexPerfil];
        item = new Y.ObjetoDeInteres();
        item.crearCampos(seleccion.get("campos"));
        console.log("HOLAA");
        $("#item").empty();
        $("#item").append(item.representacion());

    },

    cargarItem:function(){
        campos = $("#item").find(".input-group");
        item.completarCampos(campos);
    }

});
