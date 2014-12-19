$.mvc.controller.create("aplicacion", {
    views:["js/vista/main.tpl",'js/vista/cargarItem.tpl','js/vista/crearPerfil.tpl','js/vista/listaPerfiles.tpl'], //These are the views we will use with the controller
    init:function(){
        perfiles=[];
    },
    default:function(){

        Y.Perfil.obtenerPerfiles();
        tiposPropiedad={"Alfanumerico":Y.Alfanumerico.representacionComoCrear,"Enumerado":Y.Enumerado.representacionComoCrear,"Numerico":Y.Numerico.representacionComoCrear,"Rango":Y.Rango.representacionComoCrear};


    },

    seleccionarPropiedad: function(){
        //$("#modalContainer").append('<div class="afScrollbar">');
        //$("#propiedades").empty();
        if($("#propiedades"))
            $("#propiedades").remove();
        $("#seleccionarPropiedad").prepend('<div id="propiedades"></div>');


        var callback = function(propiedad){
            var $contenedor = $("<div/>");
            $contenedor.append('<div class="widget uib_w_11 d-margins divCheckbox" data-ver="1"><input type="checkbox" value="'+propiedad.get("id")+'" id="checkbox'+propiedad.get("id")+'"><label class="content-box" for="checkbox'+propiedad.get("id")+'"></label></div>');
            $($contenedor.find("input")).change(function(e){
                if(e.target.checked){
                    $(e.target.parentNode.nextSibling).addClass("divResaltado");
                }else{
                    $(e.target.parentNode.nextSibling).removeClass("divResaltado");
                }
            });
            $contenedor.append(propiedad.representacion());
            $("#propiedades").append($contenedor);
        };

        Y.Propiedad.obtenerPropiedades(callback);
        $.ui.showModal("#seleccionarPropiedad","fade");

        if(device.platform == "Android"){
            $("#propiedades").css({"height": "80%",
                                   "overflowY":"hidden"});
            setTimeout(function(){
                    $("#propiedades").scroller({
                        verticalScroll:true,
                        horizontalScroll:false,
                        autoEnable:true
                    });
            },1000);
        }
    },

    cargarPropiedadesSeleccionadas: function(){
        var propiedadesSeleccionadas = ($("#propiedades").find("[type|=checkbox]")).get().filter(function(x){return x.checked});
        var idPropiedades = propiedadesSeleccionadas.map(function(x){return x.value});
        $.each(idPropiedades,function(indice,id){
            Y.Propiedad.obtenerPropiedad(id,function(propiedad){
                var $div =  propiedad.representacion();
                $div.prepend('<div style="text-align: right;"><span class="icon close" onclick="remover(this.parentElement);"></span></div>');
                $div.attr({"id":propiedad.get("id")});
                var variable = $div.find("select")[0]!=null ? $div.find("select")[0]:$div.find("input")[0];
                variable.disabled=true;
                $("#campos").append($div);
            });
        });
        $.ui.hideModal("#seleccionarPropiedad");
    },

    crearPerfil:function(){
        var tiposConstantes = ["Alfanumerico","Enumerado","Numerico","Rango"];
        var campos = $("#campos").children();
        var nombrePerfil = $("#nombrePerfil").val();
        var descripcionPerfil = $("#descripcionPerfil").val();
        var perfil = new Y.Perfil({'nombre':nombrePerfil,'descripcion':descripcionPerfil});
        var propiedad = {};
        for (var i = 0; i<campos.length;i++){
            var item = campos[i];
            if(item.id == ""){
                console.log("Propiedad no Existe!");
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
                propiedad = new Y.Propiedad({'nombre':nombre,'descripcion':descripcion,'tipo':tipoPropiedad});
                perfil.agregarPropiedad(propiedad);
            }else{
                console.log("Propiedad Existente: ");
                console.log("id: "+item.id);
                propiedad = Y.Propiedad.obtenerPropiedad(item.id,function(prop){console.log("GUARDANDO PROPIEDAD IDPROP: "+prop.get("id"));perfil.agregarPropiedad(prop);});
            }
        }
        perfil.save();
        perfiles.push(perfil);
        $.mvc.route("aplicacion/listaPerfiles");
    },

    seleccionarItem: function(){
        $("#main").html($.template('js/vista/cargarItem.tpl',{perfiles:perfiles}));
        $.mvc.route("aplicacion/crearItem");
    },

    crearItem:function(){
        console.log("Funcion Crear Item");
        indexPerfil = $("#selectPerfiles").get(0).selectedIndex;
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
    },

    listaPerfiles:function(){
        activate_subpage("#perfiles");
        $("#mainPerfiles").html($.template('js/vista/listaPerfiles.tpl',{perfiles:perfiles}));
        $("#backButton").css({"visibility":"initial"});
        $("#backButton").click(function(){
            activate_subpage("#uib_page_3");
            $("#backButton").css({"visibility":"hidden"});
            $("#backButton").unbind();
            $("#funcionalidad").css({"visibility":"hidden"});
            $("#funcionalidad").empty();
            $("#funcionalidad").unbind();
        });
        $("#funcionalidad").append("<div style='font-size: 30px'>+<div>");
        $("#funcionalidad").css({"visibility":"initial"});
        $("#funcionalidad").click(function(){
            $("#backButton").css({"visibility":"hidden"});
            $("#backButton").unbind();
            $("#funcionalidad").css({"visibility":"hidden"});
            $("#funcionalidad").empty();
            $("#funcionalidad").unbind();
            $("#mainCrearPerfil").html($.template('js/vista/crearPerfil.tpl',{tipos:tiposPropiedad}));
            activate_subpage("#crearPerfil");
        });

    }

});
