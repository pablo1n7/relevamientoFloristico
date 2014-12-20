$.mvc.controller.create("aplicacion", {
    views:["js/vista/main.tpl",'js/vista/cargarEjemplar.tpl','js/vista/crearTipoEjemplar.tpl','js/vista/listaTipoEjemplar.tpl'], //These are the views we will use with the controller
    init:function(){
        tipoEjemplares=[];
    },
    default:function(){

        Y.TipoEjemplar.obtenerTipoEjemplares();
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
        mostrarModal("#seleccionarPropiedad","fade","Seleccionar");
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

    crearTipoEjemplar:function(){
        var tiposConstantes = ["Alfanumerico","Enumerado","Numerico","Rango"];
        var campos = $("#campos").children();
        var nombreTipoEjemplar = $("#nombreTipoEjemplar").val();
        var descripcionTipoEjemplar = $("#descripcionTipoEjemplar").val();
        var tipoEjemplar = new Y.TipoEjemplar({'nombre':nombreTipoEjemplar,'descripcion':descripcionTipoEjemplar});
        var propiedad = {};
        for (var i = 0; i<campos.length;i++){
            var ejemplar = campos[i];
            if(ejemplar.id == ""){
                console.log("Propiedad no Existe!");
                var tipo = tiposConstantes[$(ejemplar).find('[name|=tipoPropiedad]').get(0).selectedIndex];
                var nombre =  $(ejemplar).find('[name|=nombre]').val();
                var descripcion = $(ejemplar).find('[name|=descripcion]').val();
                var tipoPropiedad = null;
                switch (tipo){
                    case "Numerico":
                        tipoPropiedad = Y.Numerico.getInstancia();
                        break;
                    case "Alfanumerico":
                        tipoPropiedad = Y.Alfanumerico.getInstancia();
                        break;
                    case "Rango":
                        var valorMin = $(ejemplar).find('[name|=valorMin]').val();
                        var valorMax = $(ejemplar).find('[name|=valorMax]').val();
                        tipoPropiedad = new Y.Rango({'valorMin':valorMin,'valorMax':valorMax});
                        break;
                    case "Enumerado":
                        var valores = $(ejemplar).find('[name|=valores]').val().split(',');
                        tipoPropiedad = new Y.Enumerado({'valores':valores});

                        break;
                }
                propiedad = new Y.Propiedad({'nombre':nombre,'descripcion':descripcion,'tipo':tipoPropiedad});
                tipoEjemplar.agregarPropiedad(propiedad);
            }else{
                console.log("Propiedad Existente: ");
                console.log("id: "+ejemplar.id);
                propiedad = Y.Propiedad.obtenerPropiedad(ejemplar.id,function(prop){console.log("GUARDANDO PROPIEDAD IDPROP: "+prop.get("id"));tipoEjemplar.agregarPropiedad(prop);});
            }
        }
        tipoEjemplar.save();
        tipoEjemplares.push(tipoEjemplar);
        $.mvc.route("aplicacion/listaTipoEjemplares");
    },

    seleccionarEjemplar: function(){
        $("#main").html($.template('js/vista/cargarEjemplar.tpl',{tipoEjemplares:tipoEjemplares}));
        $.mvc.route("aplicacion/crearEjemplar");
    },

    crearEjemplar:function(){
        console.log("Funcion Crear ejemplar");
        indexTipoEjemplar = $("#selectTipoEjemplares").get(0).selectedIndex;
        var seleccion = tipoEjemplares[indexTipoEjemplar];
        ejemplar = new Y.Ejemplar();
        ejemplar.crearCampos(seleccion.get("campos"));
        $("#ejemplar").empty();
        $("#ejemplar").append(ejemplar.representacion());

    },

    cargarEjemplar:function(){
        campos = $("#ejemplar").find(".input-group");
        ejemplar.completarCampos(campos);
    },


    creacionTipoEjemplar:function(){
        //activate_subpage("#crearTipoEjemplar");
        activarSubPagina("#crearTipoEjemplar","Nuevo Tipo")
        activarBotonAtras(function(){$.mvc.route("aplicacion/listaTipoEjemplares");});
        $("#mainCrearTipoEjemplar").html($.template('js/vista/crearTipoEjemplar.tpl',{tipos:tiposPropiedad}));

    },

    listaTipoEjemplares:function(){
        //activate_subpage("#tipoEjemplares");
        activarSubPagina("#tipoEjemplares","Tipos Existentes");
        $("#mainTipoEjemplares").html($.template('js/vista/listaTipoEjemplar.tpl',{tipoEjemplares:tipoEjemplares}));
        activarBotonAtras(function(){activarSubPagina("#uib_page_3","Configuración");});
        activarBotonFuncionalidad('<i class="fa fa-plus"></i>',function(){
            $.mvc.route("aplicacion/creacionTipoEjemplar");
        });


    }

});
