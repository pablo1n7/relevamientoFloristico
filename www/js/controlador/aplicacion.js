$.mvc.controller.create("aplicacion", {
    views:["js/vista/main.tpl",'js/vista/cargarEjemplar.tpl','js/vista/crearTipoEjemplar.tpl','js/vista/listaTipoEjemplar.tpl','js/vista/verTipoEjemplar.tpl','js/vista/listaFamilias.tpl','js/vista/crearFamilia.tpl','js/vista/listaEspecies.tpl','js/vista/crearEspecie.tpl','js/vista/verEspecie.tpl','js/vista/crearPlanta.tpl','js/vista/listaCampania.tpl','js/vista/crearCampania.tpl','js/vista/campaniaActiva.tpl','js/vista/crearTransecta.tpl'], //These are the views we will use with the controller
    init:function(){
        tipoEjemplares=[];
        familias = [];
        especies = [];
        campañas = [];
        campañaActiva = null;

        estadosDeConservacion=[];
        formasBiologicas=[];
        tiposBiologicos =[];
        distribuciones = [];

        idBrujula = -1;

        obtenerValoresBD("EstadoDeConservacion",estadosDeConservacion);
        obtenerValoresBD("FormaBiologica",formasBiologicas);
        obtenerValoresBD("TipoBiologico",tiposBiologicos);
        obtenerValoresBD("DistribucionGeografica",distribuciones);

    },
    default:function(){

        Y.TipoEjemplar.obtenerTipoEjemplares(function(tipoEjemplar){tipoEjemplares.push(tipoEjemplar);});
        Y.Familia.obtenerFamilias(function(familia){familias.push(familia);});
        Y.Especie.obtenerEspecies(function(especie){especies.push(especie);});
        Y.Campania.obtenerCampanias(function(campania){campañas.push(campania)});
        tiposPropiedad={"Alfanumerico":Y.Alfanumerico.representacionComoCrear,"Enumerado":Y.Enumerado.representacionComoCrear,"Numerico":Y.Numerico.representacionComoCrear,"Rango":Y.Rango.representacionComoCrear};


    },

    seleccionarPropiedad: function(){
        //$("#modalContainer").append('<div class="afScrollbar">');
        //$("#propiedades").empty();
        if($("#propiedades"))
            $("#propiedades").remove();
        $("#seleccionarPropiedad").prepend('<div name="propiedades" id="propiedades"></div>');



        var callback = function(propiedad){
            var $contenedor = $("<div class='divSeleccion' />");
            $contenedor.append('<div class="widget uib_w_11 d-margins divCheckbox" data-ver="1"><input name="tilde" type="checkbox" value="'+propiedad.get("id")+'" id="checkbox'+propiedad.get("id")+'"><label class="content-box" for="checkbox'+propiedad.get("id")+'"></label></div>');
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
         $("#modalContainer").unbind("doubleTap");
         if($("#propiedades").length == 0){
            $("#propiedades").append("No se encuentran propiedades para listar");
         }
         agregarAyuda("#modalContainer",{"seleccionarPropiedad":{titulo:"Boton Selección",mensaje:"Boton que confirma la adición de las propiedades seleccionadas de la lista."},"propiedades":{titulo:"Lista de Propiedades",mensaje:"Pantalla de seleccion de propiedades existentes. En esta pantalla, puede probar el funcionamiento de las propiedades ya creadas, para un mejor criterio de selección. Seleccione tocando en el cuadro de la izquierda de la propiedad que desea agregar"}});
    },

    cargarPropiedadesSeleccionadas: function(){
        var propiedadesSeleccionadas = ($("#propiedades").find("[type|=checkbox]")).get().filter(function(x){return x.checked});
        var idPropiedades = propiedadesSeleccionadas.map(function(x){return x.value});
        $.each(idPropiedades,function(indice,id){
            Y.Propiedad.obtenerPropiedad(id,function(propiedad){
                var $div =  propiedad.representacion();
                //$div.prepend('<div style="text-align: right;"><span class="icon close" onclick="remover(this.parentElement);"></span></div>');
                $div.prepend('<div class="widget-container content-area horiz-area wrapping-col right"><span class="icon close" onclick="remover(this.parentElement);"></span></div>');
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
        $.ui.showMask('Guardando...');
        tipoEjemplar.save(function(){
            $.ui.hideMask();
            tipoEjemplares.push(tipoEjemplar);
            $.mvc.route("aplicacion/listaTipoEjemplares");
            mensajeExitoso("El tipo ejemplar ha sido agregado con éxito");

        });

    },

    seleccionarEjemplar: function(){
        $("#main").html($.template('js/vista/cargarEjemplar.tpl',{tipoEjemplares:tipoEjemplares}));
        $.mvc.route("aplicacion/crearEjemplar");
    },

    crearEjemplar:function(){
        console.log("Funcion Crear ejemplar");
        indexTipoEjemplar = $("#selectTipoEjemplares").get(0).selectedIndex;
        var seleccion = tipoEjemplares[indexTipoEjemplar];
        ejemplar = new Y.Ejemplar({"tipoEjemplar":seleccion});
        ejemplar.crearCampos(seleccion.get("campos"));
        $("#ejemplar").empty();
        $("#ejemplar").append(ejemplar.representacion());

    },

    cargarEjemplar:function(){
        campos = $("#ejemplar").find(".input-group");
        ejemplar.completarCampos(campos);
        ejemplar.save(function(){console.log("Ejemplar Guardado con Exito")});
    },


    creacionTipoEjemplar:function(){
        activarSubPagina("#crearTipoEjemplar","Nuevo Tipo");
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


    },

    verTipoEjemplar:function(idTipoEjemplar){
        var tipoEjemplar = (tipoEjemplares.filter(function(tipo){return tipo.get("id")==idTipoEjemplar}))[0];
        var propiedades = tipoEjemplar.get("campos");
        activarSubPagina("#verTipoEjemplar",tipoEjemplar.get("nombre"));
        activarBotonAtras(function(){$.mvc.route("aplicacion/listaTipoEjemplares");});
        activarBotonFuncionalidad('<i class="fa fa-minus"></i>',function(){
            mensajeConfirmacion("Mensaje de Confirmación","¿Estas seguro que desea eliminar?",function(){
                $.ui.showMask('Eliminando...');
                tipoEjemplar.delete(function(){
                    $.ui.hideMask();
                    tipoEjemplares.splice(tipoEjemplares.indexOf(tipoEjemplar),1);
                    mensajeExitoso("El tipo ejemplar ha sido eliminado con Éxito");
                    $.mvc.route("aplicacion/listaTipoEjemplares");
                },function(){
                    console.log("fallo");
                    $.ui.hideMask();
                    mensajeError("El tipo ejemplar no puede ser eliminado: Tiene asociados ejemplares recolectados.");
                    $.mvc.route("aplicacion/verTipoEjemplar/"+idTipoEjemplar);


                });

            },function(){
                $.mvc.route("aplicacion/verTipoEjemplar/"+idTipoEjemplar);
            });
        });
        $("#mainVerTipoEjemplar").html($.template('js/vista/verTipoEjemplar.tpl',{tipoEjemplar:tipoEjemplar}));
        for(var i = 0; i<propiedades.length;i++){
            $("#propiedadesTipoEjemplar").append(propiedades[i].representacion());
        }


    },

    listaFamilias:function(){
        activarSubPagina("#familias","Familias");
        $("#mainFamilias").html($.template('js/vista/listaFamilias.tpl',{familias:familias}));
        activarBotonAtras(function(){activarSubPagina("#uib_page_3","Configuración");});
        activarBotonFuncionalidad('<i class="fa fa-plus"></i>',function(){
            $.mvc.route("aplicacion/creacionFamilia");
        });
    },

    creacionFamilia: function(){
        activarSubPagina("#crearFamilia","Nueva Familia");
        activarBotonAtras(function(){$.mvc.route("aplicacion/listaFamilias");});
        $("#mainCrearFamilia").html($.template('js/vista/crearFamilia.tpl'));
    },

    crearFamilia:function(){
        var nombreFamilia = $("#nombreFamilia").val();
        var familia = new Y.Familia ({"nombre":nombreFamilia});
        $.ui.showMask('Guardando...');
        familia.save(function(){
            $.ui.hideMask();
            familias.push(familia);
            mensajeExitoso("La familia ha sido agregado con éxito");
            $.mvc.route("aplicacion/listaFamilias");
        },function(){
            $.ui.hideMask();
            mensajeError("Error al guardar familia: Ya se encuentra una familia registrada con ese nombre.");
        });

    },

    listaEspecies:function(){
        activarSubPagina("#especies","Especies");
        $("#mainEspecies").html($.template('js/vista/listaEspecies.tpl',{especies:especies}));
        activarBotonAtras(function(){activarSubPagina("#uib_page_3","Configuración");});
        activarBotonFuncionalidad('<i class="fa fa-plus"></i>',function(){
            $.mvc.route("aplicacion/creacionEspecie");
        });
    },

    creacionEspecie: function(){
        activarSubPagina("#crearEspecie","Nueva Especie");
        activarBotonAtras(function(){$.mvc.route("aplicacion/listaEspecies");});
        $("#mainCrearEspecie").html($.template('js/vista/crearEspecie.tpl',{familias:familias,estadosDeConservacion:estadosDeConservacion, formasBiologicas:formasBiologicas,tiposBiologicos:tiposBiologicos,distribuciones:distribuciones}));
    },

    crearEspecie:function(){
        var nombreEspecie = $("#nombreEspecie").val();
        var familia=$("#familia").val();
        var formaBiologica =$("#formaBiologica").val();
        var tipoBiologica =$("#tipoBiologica").val();
        var estadoDeConservacion=$("#estadoDeConservacion").val();
        var distribucionGeografica=$("#distribucionGeografica").val();
        var indiceCalidad=$("#indiceDeCalidad").val();
        var especie = new Y.Especie({"nombre":nombreEspecie,"familia":familia,"formaBiologica":formaBiologica,"tipoBiologico":tipoBiologica,"estadoDeConservacion":estadoDeConservacion,"distribucionGeografica":distribucionGeografica,"indiceDeCalidad":indiceCalidad});
        $.ui.showMask('Guardando...');
        especie.save(function(){
            $.ui.hideMask();
            especies.push(especie);
            mensajeExitoso("La especie ha sido agregado con éxito");
            $.mvc.route("aplicacion/listaEspecies");
        },function(){
            $.ui.hideMask();
            mensajeError("Error al guardar especie: Ya se encuentra una especie registrada con ese nombre.");
        });

    },

    verEspecie:function(nombreEspecieCodificado){
        var nombreEspecie = decodeURIComponent(nombreEspecieCodificado);
        var especie = (especies.filter(function(esp){return esp.get("nombre")==nombreEspecie}))[0];
        activarSubPagina("#verEspecie",especie.get("nombre"));
        activarBotonAtras(function(){$.mvc.route("aplicacion/listaEspecies");});
        $("#mainVerEspecie").html($.template('js/vista/verEspecie.tpl',{especie:especie}));

    },


    creacionPlanta: function(){
        activarSubPagina("#crearPlanta","Nueva Planta");
        //activarBotonAtras(function(){$.mvc.route("aplicacion/listaEspecies");});
        $("#mainCrearPlanta").html($.template('js/vista/crearPlanta.tpl',{especies:especies}));
    },

    crearPlanta:function(){
      /*  var nombreEspecie = $("#nombreEspecie").val();
        var familia=$("#familia").val();
        var formaBiologica =$("#formaBiologica").val();
        var tipoBiologica =$("#tipoBiologica").val();
        var estadoDeConservacion=$("#estadoDeConservacion").val();
        var distribucionGeografica=$("#distribucionGeografica").val();
        var indiceCalidad=$("#indiceDeCalidad").val();
        var especie = new Y.Especie({"nombre":nombreEspecie,"familia":familia,"formaBiologica":formaBiologica,"tipoBiologico":tipoBiologica,"estadoDeConservacion":estadoDeConservacion,"distribucionGeografica":distribucionGeografica,"indiceDeCalidad":indiceCalidad});
        $.ui.showMask('Guardando...');
        especie.save(function(){
            $.ui.hideMask();
            especies.push(especie);
            mensajeExitoso("La especie ha sido agregado con éxito");
            $.mvc.route("aplicacion/listaEspecies");
        },function(){
            $.ui.hideMask();
            mensajeError("Error al guardar especie: Ya se encuentra una especie registrada con ese nombre.");
        });
*/
    },

    listaCampanias:function(){
        activarSubPagina("#uib_page_1","Campañas");
        if(campañaActiva == null){
            activarBotonFuncionalidad('<i class="fa fa-plus"></i>',function(){
                $.mvc.route("aplicacion/creacionCampania");
            });
            $("#mainCampañas").html($.template('js/vista/listaCampania.tpl',{campanias:campañas}));
        }else{
            activarBotonFuncionalidad('Desactivar',function(){
                $.mvc.route("aplicacion/desactivarCampania");
            });
            $("#mainCampañas").html($.template('js/vista/campaniaActiva.tpl',{campania:campañaActiva}));
            toogleAlto("#contenedorTipos",$("#contenedorTipos").offset().height+"px");
        }
    },

    creacionCampania:function(){
        activarSubPagina("#crearCampaña","Nueva Campaña");
        activarBotonAtras(function(){$.mvc.route("aplicacion/listaCampanias");});
        $("#mainCrearCampaña").html($.template('js/vista/crearCampania.tpl',{tipoEjemplares:tipoEjemplares}));

    },

     crearCampania:function(){
        var nombreCampania = $("#nombreCampaña").val();
        var descripcion=$("#descripcionCampaña").val();

        var tiposSeleccionados = ($("#contenedorListaTipos").find("[type|=checkbox]")).get().filter(function(x){return x.checked});
        var idTipos = tiposSeleccionados.map(function(x){return x.value});
        campania = new Y.Campania({"nombre":nombreCampania,"descripcion":descripcion,"fecha":Date.now()});
        for(var i = 0; i< idTipos.length ;i++){
            var tipoEjemplar = (tipoEjemplares.filter(function(tipo){return tipo.get("id")==idTipos[i]}))[0];
            campania.get("tipoEjemplares").push(tipoEjemplar);
        }

         $.ui.showMask('Guardando...');
        campania.save(function(){
            $.ui.hideMask();
            mensajeExitoso("La campaña ha sido agregado con éxito");
            $.mvc.route("aplicacion/listaCampanias");
            campañas.push({nombre: campania.get("nombre"),fecha:campania.get("fecha")});
            $("#mainCampañas").html($.template('js/vista/listaCampania.tpl',{campanias:campañas}));
        });
    },


    activarCampania:function(nombreCodificado,fecha){
        var nombre = decodeURIComponent(nombreCodificado);
        Y.Campania.obtenerCampania(nombre,fecha,function(camp){
            campañaActiva=camp;
            mensajeExitoso("Campaña Seleccionada");
            activarSubPagina("#uib_page_1","Campaña "+camp.get("nombre"));
            activarBotonFuncionalidad('Desactivar',function(){
                $.mvc.route("aplicacion/desactivarCampania");
            });

            $("#mainCampañas").html($.template('js/vista/campaniaActiva.tpl',{campania:campañaActiva}));
            toogleAlto("#contenedorTipos",$("#contenedorTipos").offset().height+"px");
        });
    },

    desactivarCampania:function(){
        campañaActiva = null;
        $.mvc.route("aplicacion/listaCampanias");
    },



    creacionTransecta:function(){

        activarSubPagina("#crearTransecta","Nueva Transecta");
        activarBotonAtras(function(){$.mvc.route("aplicacion/listaCampanias");});
        $("#mainCrearTransecta").html($.template('js/vista/crearTransecta.tpl',{screen:screen,especies:especies}));
        activarBrujula(function(dir){
            $("#valorSentido").empty();
            $("#valorSentido").append(parseInt(dir.magneticHeading));
            $("#brujulaMovil").css3Animate({previous:true,time:"300ms",rotateX:-dir.magneticHeading+"deg",origin:"50% 50%"});
            $("#brujulaFija").css3Animate({previous:true,time:"300ms",rotateX:dir.magneticHeading+"deg",origin:"50% 50%"});
        },function(watchId){
            idBrujula = watchId;
            $("#brujulaMovil").click(function(){
                navigator.compass.clearWatch(watchId);
                $(this).unbind();
                $("#mensajeBrujula").empty();
                $("#mensajeBrujula").append("Sentido fijado: toque para poder activar la brujula nuevamente");
                $(this).click(
                    function(){
                        $("#mensajeBrujula").empty();
                        $("#mensajeBrujula").append("Toque la brujula para fijar el sentido de la transecta.");
                        activarBrujula(function(dir){
                            $("#valorSentido").empty();
                            $("#valorSentido").append(parseInt(dir.magneticHeading));
                            $("#brujulaMovil").css3Animate({previous:true,time:"300ms",rotateX:-dir.magneticHeading+"deg",origin:"50% 50%"});
                            $("#brujulaFija").css3Animate({previous:true,time:"300ms",rotateX:dir.magneticHeading+"deg",origin:"50% 50%"});
                        },function(watchId){
                            idBrujula = watchId;
                            $("#brujulaMovil").click(function(){
                                $("#mensajeBrujula").empty();
                                $("#mensajeBrujula").append("Sentido Fijado");
                                navigator.compass.clearWatch(watchId);

                            });
                        });



                    }
                );

            });
        });

    },

    crearTransecta: function(){
        var ambiente= $("#ambiente").val();
        var sentido = $("#valorSentido").text();
        var cuadro = $("#cuadro").val();
        var especiesSeleccionadas = ($("#contenedorEspecies").find("[type|=checkbox]")).get().filter(function(x){return x.checked});
        var nombreEspecies = especiesSeleccionadas.map(function(x){return x.value});
        var transecta = new Y.Transecta({"ambiente":ambiente,"sentido":sentido,"cuadro":cuadro,"campania":campañaActiva,"nombreEspecies":nombreEspecies});
        $.ui.showMask('Guardando...');
        transecta.save(function(){
            $.ui.hideMask();
            campañaActiva.get("transectas").push(transecta);
            mensajeExitoso("La transecta ha sido agregado con éxito");
            $.mvc.route("aplicacion/listaCampanias");
        });


    }



});
