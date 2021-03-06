$.mvc.controller.create("aplicacion", {
    views:["js/vista/main.tpl",'js/vista/cargarEjemplar.tpl','js/vista/crearTipoEjemplar.tpl','js/vista/listaTipoEjemplar.tpl','js/vista/verTipoEjemplar.tpl','js/vista/listaFamilias.tpl','js/vista/crearFamilia.tpl','js/vista/listaEspecies.tpl','js/vista/crearEspecie.tpl','js/vista/verEspecie.tpl','js/vista/crearPlanta.tpl','js/vista/listaCampania.tpl','js/vista/crearCampania.tpl','js/vista/campaniaActiva.tpl','js/vista/crearTransecta.tpl','js/vista/crearPunto.tpl','js/vista/recolectarPunto.tpl','js/vista/seguimientoTransecta.tpl','js/vista/vistaPuntos.tpl','js/vista/vistaPuntosVacio.tpl','js/vista/relevarRecolectable.tpl','js/vista/guiarPrimerPunto.tpl','js/vista/sincronizacion.tpl','js/vista/configuracion.tpl'], //These are the views we will use with the controller
    init:function(){

        CANTIDAD_PUNTOS = 100;
        DISTANCIA_ACEPTABLE =10;
        especies = [];
        campañas = [];
        familias = [];
        tipoEjemplares=[];
        campañaActiva = null;
        transectaActiva = null;
        estadoPunto=["Toque Directo","Muerto en Pie","Suelo Desnudo"];
        estadosDeConservacion=[{"id":1,"nombre":"No Definido"}];
        formasBiologicas=[{"id":1,"nombre":"No Definido"}];
        tiposBiologicos =[{"id":1,"nombre":"No Definido"}];
        tiposSuelos=[{"id":1,"nombre":"No Definido"}];
        distribuciones = [{"id":1,"nombre":"No Definido"}];
        
        identidad={"id":"-1","modelo":"desconocido"}
        device.getInfo(function(a){
            identidad.id = a.uuid;
            identidad.modelo = a.model;
            identidad = JSON.stringify(identidad);
        });
        
        
        idBrujula = -1;

        obtenerValoresBD("EstadoDeConservacion",estadosDeConservacion);
        obtenerValoresBD("FormaBiologica",formasBiologicas);
        obtenerValoresBD("TipoBiologico",tiposBiologicos);
        obtenerValoresBD("DistribucionGeografica",distribuciones);
        obtenerValoresBD("TipoSuelo",tiposSuelos);

        if(device.platform == "Android"){
            $("#crearPuntoScroller").css({"height": "90%","overflowY":"hidden"});
            $("#verPuntoScroller").css({"height": "90%","overflowY":"hidden"});

            $("#seleccionarPropiedadScroller").css({"height": "90%","overflowY":"hidden"});
            $("#seleccionarPropiedadScroller").scroller();
            $("#crearPuntoScroller").scroller();
            $("#verPuntoScroller").scroller();
        }


        $("body").click(function(){
            $("body").addClass("desenlazar");
            setTimeout(function(){
                $("body").removeClass("desenlazar");
            },300);
        });
        
        
    },
    default:function(){
        
        console.log("en Default!!!");
        especies = [];
        campañas = [];
        familias = [];
        tipoEjemplares=[];
        $("#mainSeguimiento").html($.template('js/vista/main.tpl'));
        $("#vistaPuntos").html($.template('js/vista/vistaPuntosVacio.tpl'));
        Y.TipoEjemplar.obtenerTipoEjemplares(function(tipoEjemplar){tipoEjemplares.push(tipoEjemplar);});
        Y.Familia.obtenerFamilias(function(familia){familias.push(familia);});
        Y.Especie.obtenerEspecies(function(especie){especies.push(especie);});
        Y.Campania.obtenerCampanias(function(campania){campañas.push(campania)});

        tiposPropiedad={"Alfanumerico":Y.Alfanumerico.representacionComoCrear,"Enumerado":Y.Enumerado.representacionComoCrear,"Numerico":Y.Numerico.representacionComoCrear,"Rango":Y.Rango.representacionComoCrear};

    //verificarVisitas();
//    comprobandoHardware();
    },

    seleccionarPropiedad: function(){
        //$("#modalContainer").append('<div class="afScrollbar">');
        //$("#propiedades").empty();
        if($("#propiedades"))
            $("#propiedades").remove();
        //$("#seleccionarPropiedad").prepend('<div name="propiedades" id="propiedades"></div>');
        $("#divPropiedades").prepend('<div name="propiedades" id="propiedades"></div>');



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
         mostrarModal("#seleccionarPropiedad","fade","Seleccionar",function(){});
       //  $("#modalContainer").unbind("doubleTap");
         if($("#propiedades").length == 0){
            $("#propiedades").append("No se encuentran propiedades para listar");
         }
         //agregarAyuda("#modalContainer",diccionarioAyuda["#modalContainer"]);
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
        $("#mainpage").scroller().scrollToBottom("0ms");
    },

    crearTipoEjemplar:function(){

        if (!validar($("#crearTipoEjemplar"))){
            mensajeError("Campos incorrectos!");
            return;
        }

        var tiposConstantes = ["Alfanumerico","Enumerado","Numerico","Rango"];
        var campos = $("#campos").children();
        if(campos.length==0){
            mensajeError("No hay propiedades!");
            return;
        }
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
                        if(parseInt(valorMin)<parseInt(valorMax))
                            tipoPropiedad = new Y.Rango({'valorMin':valorMin,'valorMax':valorMax});
                        else
                            tipoPropiedad = new Y.Rango({'valorMin':valorMax,'valorMax':valorMin});
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
        mostrarMascara('Guardando...');
        tipoEjemplar.save(function(){
            ocultarMascara();
            tipoEjemplares.push(tipoEjemplar);
            $.mvc.route("aplicacion/listaTipoEjemplares");
            mensajeExitoso("Tipo Ejemplar Creado");

        });

    },

    seleccionarEjemplar: function(numeroId){
        $("#item"+numeroId).html($.template('js/vista/cargarEjemplar.tpl',{tipoEjemplares:tipoEjemplares,numeroId:numeroId}));
        $.mvc.route("aplicacion/crearEjemplar/"+numeroId);
    },

    crearEjemplar:function(numeroId){
        console.log("Funcion Crear ejemplar");
        var indexTipoEjemplar = $("#selectTipoEjemplares"+numeroId).get(0).selectedIndex;
        var seleccion = tipoEjemplares[indexTipoEjemplar];
        var ejemplar = new Y.Ejemplar({"tipoEjemplar":seleccion});
        ejemplar.crearCampos(seleccion.get("campos"));
        $("#ejemplar"+numeroId).empty();
        $("#ejemplar"+numeroId).append(ejemplar.representacion());

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
        activarBotonAtras(function(){activarSubPagina("#uib_page_3","Miscelánea");});
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
                mostrarMascara('Eliminando...');
                tipoEjemplar.delete(function(){
                    ocultarMascara();
                    tipoEjemplares.splice(tipoEjemplares.indexOf(tipoEjemplar),1);
                    mensajeExitoso("Tipo Ejemplar eliminado");
                    $.mvc.route("aplicacion/listaTipoEjemplares");
                },function(){
                    console.log("fallo");
                    ocultarMascara();
                    mensajeError("Ejemplares Asociados");
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
        activarBotonAtras(function(){activarSubPagina("#uib_page_3","Miscelánea");});
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

        if (!validar($("#mainCrearFamilia"))){
            mensajeError("Campos incorrectos!");
            return;
        }

        var nombreFamilia = $("#nombreFamilia").val();
        var familia = new Y.Familia ({"nombre":nombreFamilia});
        mostrarMascara('Guardando...');
        familia.save(function(){
            ocultarMascara();
            familias.push(familia);
            mensajeExitoso("Familia Creada");
            $.mvc.route("aplicacion/listaFamilias");
        },function(){
            ocultarMascara();
            mensajeError("Familia Duplicada");
        });

    },

    listaEspecies:function(){
        activarSubPagina("#especies","Especies");
        $("#mainEspecies").html($.template('js/vista/listaEspecies.tpl',{especies:especies}));
        activarBotonAtras(function(){activarSubPagina("#uib_page_3","Miscelánea");});
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

        if (!validar($("#mainCrearEspecie"))){
            mensajeError("Campos incorrectos!");
            return;
        }

        var nombreEspecie = $("#nombreEspecie").val();
        var familia=$("#familia").val();
        var formaBiologica =$("#formaBiologica").val();
        var tipoBiologica =$("#tipoBiologica").val();
        var estadoDeConservacion=$("#estadoDeConservacion").val();
        var distribucionGeografica=$("#distribucionGeografica").val();
        var indiceCalidad=$("#indiceDeCalidad").val();
        var forrajera = parseInt($("#forrajera").val());
        var especie = new Y.Especie({"nombre":nombreEspecie,"familia":familia,"formaBiologica":formaBiologica,"tipoBiologico":tipoBiologica,"estadoDeConservacion":estadoDeConservacion,"distribucionGeografica":distribucionGeografica,"indiceDeCalidad":indiceCalidad,"forrajera":forrajera});
        mostrarMascara('Guardando...');
        especie.save(function(){
            ocultarMascara();
            especies.push(especie);
            mensajeExitoso("Especie Creada");
            $.mvc.route("aplicacion/listaEspecies");
        },function(){
            ocultarMascara();
            mensajeError("Especie Duplicada");
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

        if (!validar($("#mainCrearCampaña"))){
            mensajeError("Campos incorrectos!");
            return;
        }

        var nombreCampania = $("#nombreCampaña").val();
        var descripcion=$("#descripcionCampaña").val();

  
        campania = new Y.Campania({"nombre":nombreCampania,"descripcion":descripcion,"fecha":Date.now()});
        mostrarMascara('Guardando...');
        campania.save(function(){
            ocultarMascara();
            mensajeExitoso("Campaña Creada");
            $.mvc.route("aplicacion/listaCampanias");
            campañas.push({nombre: campania.get("nombre"),fecha:campania.get("fecha")});
            $("#mainCampañas").html($.template('js/vista/listaCampania.tpl',{campanias:campañas}));
        });
    },


    activarCampania:function(nombreCodificado,fecha,reanudacion){

        var reanudacion = reanudacion || 0;
        var nombre = decodeURIComponent(nombreCodificado);
        Y.Campania.obtenerCampania(nombre,fecha,function(camp){
            campañaActiva = camp;
            mensajeExitoso("Campaña Seleccionada");
            if(parseInt(reanudacion)==0){
                activarSubPagina("#uib_page_1","Campaña "+camp.get("nombre"));
                activarBotonFuncionalidad('Desactivar',function(){
                    $.mvc.route("aplicacion/desactivarCampania");
                });
            }

            $("#mainCampañas").html($.template('js/vista/campaniaActiva.tpl',{campania:campañaActiva}));
           // toogleAlto("#contenedorTipos",$("#contenedorTipos").offset().height+"px");


        });

    },


     borrarCampania:function(nombreCodificado,fecha){
        var nombre = decodeURIComponent(nombreCodificado);
         mensajeConfirmacion("Eliminar Campaña","esta seguro que desea eliminar la campaña '"+nombre+"' y todas sus transectas? " ,function(){
            Y.Campania.obtenerCampania(nombre,fecha,function(camp){
                $("#"+nombre+"/"+fecha).remove();
                campañas.splice(campañas.indexOf(campañas.filter(function(c){return (c.nombre==nombre && c.fecha==fecha)})[0]),1);
                setTimeout(function(){
                    camp.borrar();
                },5000);
                mensajeExitoso("Campaña Eliminada.");
            });

         },function(){})

    },


    desactivarCampania:function(){
        /*campañaActiva = null;
        transectaActiva = null;
        $.mvc.route("aplicacion/listaCampanias");*/
         if(transectaActiva != null && transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].get("puntos").length < CANTIDAD_PUNTOS){
            mensajeConfirmacion("Visita en Curso","La Visita actual no esta completa. Esta accion eliminará todos los datos asociados a la misma. Desea continuar?",
                function(){
                    console.log("continuo");
                    transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].borrar();
                    transectaActiva = null;
                    campañaActiva = null;
                    $.mvc.route("aplicacion/listaCampanias");
                    $("#mainSeguimiento").html($.template('js/vista/main.tpl'));
                    $("#vistaPuntos").html($.template('js/vista/vistaPuntosVacio.tpl'));
//clearInterval(intervaloRefreshJustgage);
                },function(){
                    console.log("no continuo");
                    return;
                });
        }else{
            campañaActiva = null;
            transectaActiva = null;
            $("#mainSeguimiento").html($.template('js/vista/main.tpl'));
            $.mvc.route("aplicacion/listaCampanias");
            $("#vistaPuntos").html($.template('js/vista/vistaPuntosVacio.tpl'));
//clearInterval(intervaloRefreshJustgage);
        }
    },





    creacionTransecta:function(){

         if(transectaActiva != null && transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].get("puntos").length < CANTIDAD_PUNTOS){
            mensajeConfirmacion("Visita en Curso","La Visita actual no esta completa. Esta accion eliminará todos los datos asociados a la misma. Desea continuar?",
                function(){
                    console.log("continuo");
                    transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].borrar();
                    transectaActiva = null;
                    $.mvc.route("aplicacion/formularioCreacionTransecta");
                },function(){
                    console.log("no continuo");
                    return;
                });
        }else{
            $.mvc.route("aplicacion/formularioCreacionTransecta");
        }


    },



    formularioCreacionTransecta:function(){


        activarSubPagina("#crearTransecta","Nueva Transecta");
        activarBotonAtras(function(){$.mvc.route("aplicacion/listaCampanias");});
        $("#mainCrearTransecta").html($.template('js/vista/crearTransecta.tpl',{screen:screen,especies:especies}));
        $("#brujulaMovil").width((screen.width/1.7)+"px");
        $("#brujulaMovil").height((screen.width/1.7)+"px");
        autocompletadoEspecies("especiePredominante1",false);
        autocompletadoEspecies("especiePredominante2",false);
        autocompletadoEspecies("especiePredominante3",false);


objetoBrujulaTransecta = {};
//objetoBrujulaTransecta.idSeguimiento= -1;
objetoBrujulaTransecta.dirAnterior = null;
objetoBrujulaTransecta.vueltas = 0;



        activarBrujula(function(dir){
            $("#valorSentido").empty();
            $("#valorSentido").append(parseInt(dir.magneticHeading));


        var dirActual = dir.magneticHeading;
        var vueltas = objetoBrujulaTransecta.vueltas;

        if(objetoBrujulaTransecta.dirAnterior==null)
            objetoBrujulaTransecta.dirAnterior = dirActual;

        if ((objetoBrujulaTransecta.dirAnterior> 270 && objetoBrujulaTransecta.dirAnterior< 360) && dirActual < 90 ){
            vueltas++;
        }else{
            if ( (objetoBrujulaTransecta.dirAnterior< 90) && (dirActual> 270 && dirActual< 360)){
                vueltas--;
            }//else{
        }
    var valorMovimiento = dirActual + (360 * vueltas);
            console.log(valorMovimiento);
                $("#brujulaMovil").css3Animate({previous:true,time:"1000ms",rotateX:-valorMovimiento+"deg",origin:"50% 50%"});
                $("#brujulaFija").css3Animate({previous:true,time:"1000ms",rotateX:valorMovimiento+"deg",origin:"50% 50%"});
    //$("#flechaSeguimiento").css3Animate({previous:true,time:"1000ms",rotateX:valorMovimiento+"deg",origin:"51% 80.5%"});
            //}

        //}
        objetoBrujulaTransecta.vueltas = vueltas;
        objetoBrujulaTransecta.dirAnterior = dirActual;





            /*$("#brujulaMovil").css3Animate({previous:true,time:"1000ms",rotateX:-dir.magneticHeading+"deg",origin:"50% 50%"});
            $("#brujulaFija").css3Animate({previous:true,time:"1000ms",rotateX:dir.magneticHeading+"deg",origin:"50% 50%"});*/
        },function(watchId){
            idBrujula = watchId;
            $("#brujulaMovil").click(function(){
                navigator.compass.clearWatch(watchId);
                $(this).unbind();
                $("#mensajeBrujula").empty();
                $("#mensajeBrujula").append("Sentido fijado: toque para poder activar la brujula nuevamente");
                $(this).click(
                    function(){
                        $(this).unbind();
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
                                navigator.compass.clearWatch(idBrujula);

                            });
                        });



                    }
                );

            });
        });

    },

    crearTransecta: function(){

        if (!validar($("#mainCrearTransecta"))){
            mensajeError("Campos incorrectos!");
            return;
        }



        var ambiente= $("#ambiente").val();
        var sentido = $("#valorSentido").text();
        var cuadro = $("#cuadro").val();
        var distanciaEntrePuntos = parseInt($("#distanciaEntrePuntosLabel").text());

        /*var especiesSeleccionadas = ($("#contenedorEspecies").find("[type|=checkbox]")).get().filter(function(x){return x.checked});

        var nombreEspecies = especiesSeleccionadas.map(function(x){return x.value});*/

        var nombreEspecies = [];


        if($("#especiePredominante1").val() != ""){
            nombreEspecies.push($("#especiePredominante1").val());
        }
        if($("#especiePredominante2").val() != ""){
            nombreEspecies.push($("#especiePredominante2").val());
        }
        if($("#especiePredominante3").val() != ""){
            nombreEspecies.push($("#especiePredominante3").val());
        }



        for(var i=nombreEspecies.length-1; i>=0 ;i--){
            especies.unshift(especies.splice(especies.indexOf(especies.filter(function(e){return e.get("nombre") == nombreEspecies[i]})[0]),1)[0]);
        }


        var transecta = new Y.Transecta({"ambiente":ambiente,"sentido":sentido,"cuadro":cuadro,"campania":campañaActiva,"nombreEspecies":nombreEspecies, "distanciaEntrePuntos":distanciaEntrePuntos});
        mostrarMascara('Guardando...');
        transecta.save(function(){
            ocultarMascara();
            campañaActiva.get("transectas").push(transecta);

            mensajeExitoso("Transecta Creada");
            //$.mvc.route("aplicacion/listaCampanias");
            $.mvc.route("aplicacion/activarTransecta/"+transecta.get("id"));




        });
    },

    activarTransecta: function(id,reanudacion){
        var reanudacion = reanudacion || 0;
        if(transectaActiva != null && transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].get("puntos").length < CANTIDAD_PUNTOS){
            mensajeConfirmacion("Visita en Curso","La Visita actual no esta completa. Esta accion eliminará todos los datos asociados a la misma. Desea continuar?",
                function(){
                    console.log("continuo");
                    transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].borrar();
                    $.mvc.route("aplicacion/activacionTransecta/"+id+"/"+reanudacion);
                },function(){
                    console.log("no continuo");
                    return;
                });
        }else{
            $.mvc.route("aplicacion/activacionTransecta/"+id+"/"+reanudacion);
        }
    },

    activacionTransecta:function(id,reanudacion){
        var valorJustgage = 0;
        var metrosRestantes = 0;
        mostrarMascara('Activando Transecta...');
        Y.Campania.obtenerCampaniaPorTransecta(id,function(camp){
            campañaActiva = camp;
            transectaActiva = campañaActiva.get("transectas").filter(function(t){ return t.get("id") == id })[0];
            Y.Visita.obtenerVisitasTransecta(transectaActiva,function(visitas){
                transectaActiva.set("visitas",visitas);

                if(parseInt(reanudacion) == 0){
                    var visita = new Y.Visita({fecha:Date.now()});
                    visita.save(transectaActiva.get("id"));
                    transectaActiva.get("visitas").push(visita);
                    metrosRestantes = CANTIDAD_PUNTOS * transectaActiva.get("distanciaEntrePuntos");
                }else{
                    valorJustgage = transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].get("puntos").length;
                    console.log("valor Justgage ="+valorJustgage);
                    metrosRestantes = (CANTIDAD_PUNTOS - valorJustgage) * transectaActiva.get("distanciaEntrePuntos");
                    //$.mvc.route("/aplicacion/activarCampania/"+encodeURIComponent(transectaActiva.get("nombreCampania"))+"/"+transectaActiva.get("fechaCampania")+"/1");

                }
                activarBrujulaSeguimiento(transectaActiva.get("sentido"));
                activarSubPagina("#mainsub",transectaActiva.get("ambiente"));
                 $("#mainSeguimiento").html($.template('js/vista/seguimientoTransecta.tpl'));

                refrescarGraficoPie(valorJustgage,"porcentajeTransecta");
                
//                $("#indicadorDistancia").css({height:($("#justgageTransecta").offset().height)+"px"});
                $("#metrosRestantes").empty();
                $("#metrosRestantes").append(metrosRestantes);

                ocultarMascara();
                if (transectaActiva.get("visitas").length != 1 && transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].get("puntos").length == 0){

//                    if(parseInt(reanudacion)!==0)
                    ordenarEspecies(transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1],1);

                    $.mvc.route("/aplicacion/guiarPrimerPunto/"+transectaActiva.get("visitas")[0].get("puntos")[0].get("coordenadas"));
                }else{
                    
                    ordenarEspecies(transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1],1);
                    
                     if(parseInt(reanudacion)==0)
                        $.mvc.route("aplicacion/crearPunto");
                }
        })
    });
    },

    crearPunto:function(){

        if(transectaActiva.get("visitas").length == 0 || transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].get("puntos").length != CANTIDAD_PUNTOS){
            $("#mainCrearPunto").html($.template('js/vista/crearPunto.tpl',{}));
            mostrarModal("#crearPunto","fade","Recolectar Punto #"+(transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].get("puntos").length+1),function(){
                eliminarImagenes("#datosPlantas");
            });
        }else{
            mensajeError("Visita Completa!");
        }
    },

    almacenarPunto:function(){

        if (!validar($("#mainCrearPunto"))){
            mensajeError("Campos incorrectos!");
            return;
        }



        var estadoAguja = $("#estadoAguja").text().split(":")[1];
        var tipoSuleo = $("#tipoSuelo").val();
        var plantas = $("#datosPlantas").find("[name|=planta]");
        var items = $("#datosPlantas").find("[name|=item]");
        var punto = new Y.Punto({"estado":estadoAguja,"suelo":tipoSuleo});
        for(var i=0;i<items.length;i++){
            punto.get("items").push(recolectarItem(items[i]));
        }
        for(var i=0;i<plantas.length;i++){
            punto.get("items").push(recolectarPlanta(plantas[i]));
        }
        var cantPuntos = transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].get("puntos").length;
        if(cantPuntos ==0 || cantPuntos == CANTIDAD_PUNTOS-1){

            if(transectaActiva.get("visitas").length==1){
                mostrarMascara("Obteniendo datos del GPS");
                Gps.obtenerPosicion(function(lng,lat){
                    ocultarMascara();
                    punto.set("coordenadas",lng+"/"+lat);
                    transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].almacenarPunto(punto);
                    Gps.pararGps();

                });
            }else{
                if(transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].get("puntos").length == 0){
                    punto.set("coordenadas",transectaActiva.get("visitas")[0].get("puntos")[0].get("coordenadas"));
                }else{
                    punto.set("coordenadas",transectaActiva.get("visitas")[0].get("puntos")[CANTIDAD_PUNTOS-1].get("coordenadas"));

                }
                transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].almacenarPunto(punto);
            }
        }else{
            transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].almacenarPunto(punto);
        }
        cantPuntos=cantPuntos+1;
        refrescarGraficoPie(cantPuntos,"porcentajeTransecta");


        //$.ui.hideModal();
        cerrarModal();
        $("#metrosRestantes").empty();
        $("#metrosRestantes").append(transectaActiva.get("distanciaEntrePuntos")*(CANTIDAD_PUNTOS-cantPuntos));
        mensajeExitoso("Punto Recolectado");
        ordenarDinamicaEspecies(transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1]);
        arregloImgResiduales = [];

    },

    creacionPunto:function(opcion){
        $("#mainCrearPunto").html($.template('js/vista/recolectarPunto.tpl',{opcion:parseInt(opcion),estadoPunto:estadoPunto[opcion],suelos:tiposSuelos}));
//        asignarFuncionCierreModal(eliminarImagenes);
        $.mvc.route("aplicacion/cargarFormularioPlanta/1/"+opcion);
        $("#crearPuntoScroller").scroller().scrollToTop("0ms");
    },

    cargarFormularioPlanta:function(numeroId,conToques){
        var divPlanta = $("<div id='planta"+numeroId+"' name='planta' class='divRecolectables'/>");
        $("#datosPlantas").append(divPlanta);
        $(divPlanta).html($.template('js/vista/crearPlanta.tpl',{especies:especies,numeroId:numeroId,conToques:conToques}));
        $("#botonAgregarPlanta").attr("href","/aplicacion/cargarFormularioPlanta/"+(parseInt(numeroId)+1)+"/0");
        autocompletadoEspecies("autocompletado"+numeroId,true);
        $("#crearPuntoScroller").scroller().scrollToBottom("0ms");
    },

    cargarFormularioItem:function(numeroId){
        var divItem = $("<div id='item"+numeroId+"' name='item' class='divRecolectables'/>");
        $("#datosPlantas").append(divItem);
        $.mvc.route("aplicacion/seleccionarEjemplar/"+numeroId);
        $("#botonAgregarItem").attr("href","/aplicacion/cargarFormularioItem/"+(parseInt(numeroId)+1));
        $("#crearPuntoScroller").scroller().scrollToBottom("0ms");
    },

    verPuntos:function(){
        if(transectaActiva != null){
            $("#vistaPuntos").animateCss({x:"0",y:"0",duration:"0",easing:"easeOutSine"}
);
            $("#vistaPuntos").html($.template('js/vista/vistaPuntos.tpl',{transecta:transectaActiva,visitas:transectaActiva.get("visitas")}));

//                activarSliderPuntosVisita("visita"+transectaActiva.get("visitas")[0].get("fecha"),10,"sliderPuntosVisita",1);
//                activarSliderPuntosVisita("vistaPuntos",26,"sliderVisita",0);
            //SlidersManager.vaciar();
            var anchoVisitas = screen.width * 0.75;
            var anchoImagenes = anchoVisitas;// * 0.83;



//            SlidersManager.agregarSlider("adjuntosAVisita"+transectaActiva.get("visitas")[0].get("fecha"),"adjuntos",(screen.width/4)+"px",function(){});
            SlidersManagerImagenes.agregarSlider("imagenesvisita"+transectaActiva.get("visitas")[0].get("fecha"),"adjuntos",(screen.width/4)+"px");
            SlidersManagerImagenes.agregarSlider("adjuntosAvisita"+transectaActiva.get("visitas")[0].get("fecha"),"adjuntos",(screen.width/4)+"px");
            SlidersManager.agregarSlider("visita"+transectaActiva.get("visitas")[0].get("fecha"),"sliderPuntosVisita",anchoImagenes+"px",function(){});
            SlidersManager.agregarSlider("vistaPuntos","sliderVisita",anchoVisitas+"px",function(slid,siguiente){
                console.log("manager:");
                console.log(SlidersManager);
                console.log(slid);
                var idVisitaPunto = $(siguiente.find(".contenedorPuntosVisita")[0]).attr("id");
                console.log(idVisitaPunto);
                SlidersManager.agregarSlider(idVisitaPunto,"sliderPuntosVisita",anchoImagenes+"px",function(){});
                SlidersManagerImagenes.agregarSlider("adjuntosA"+idVisitaPunto,"adjuntos",(screen.width/4)+"px");
                SlidersManagerImagenes.agregarSlider("imagenes"+idVisitaPunto,"adjuntos",(screen.width/4)+"px");

            });
        }
/*        var anchoContenedor = screen.width * transectaActiva.get("visitas").length+"px";
        $("#vistaPuntos").css({width:anchoContenedor});*/
    },


    tomarFotoVisita: function(){
        tomarFoto(function(nombreImagen){
            verImagen(intel.xdk.camera.getPictureURL(nombreImagen),null,false,function(){
                intel.xdk.camera.deletePicture(nombreImagen);
                transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].desasociarImagen(nombreImagen);
            });

        transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].asociarImagen(nombreImagen);

        });

    },

    relevarRecolectableVisita: function(){
        $("#mainRelevarRecolectable").html($.template('js/vista/relevarRecolectable.tpl',{}));
        mostrarModal("#relevarRecolectable","fade","Recolectar",function(){eliminarImagenes("#recolectableVisita")});

    },

    cargarFormularioPlantaVisita:function(){
        $($("#recolectableVisita").get(0).previousSibling).empty();
        var divPlanta = $("<div id='plantaVisita1' name='planta' class='divRecolectables'/>");
        $("#recolectableVisita").append(divPlanta);
        $(divPlanta).html($.template('js/vista/crearPlanta.tpl',{especies:especies,numeroId:"Visita1",conToques:1}));
        autocompletadoEspecies("autocompletadoVisita1",true);
        $("#recolectableVisita").append('<div class="divBoton" onclick="asociarPlantaVisita()"><a name="recoletarPlanta" class="anchorBoton">Recolectar Planta</a></div>');

    },

    cargarFormularioItemVisita:function(){
        $($("#recolectableVisita").get(0).previousSibling).empty();
        var divItem = $("<div id='itemVisita' name='item' class='divRecolectables'/>");
        $("#recolectableVisita").append(divItem);
        $.mvc.route("aplicacion/seleccionarEjemplar/Visita");
        $("#recolectableVisita").append('<div class="divBoton" onclick="asociarItemVisita()"><a name="recoletarPlanta" class="anchorBoton">Recolectar Item</a></div>');
    },

    guiarPrimerPunto:function(longitud,latitud){
        $("#mainGuiarPrimerPunto").html($.template('js/vista/guiarPrimerPunto.tpl',{}));
//        mostrarModal("#guiarPrimerPunto","fade","Recolectar");
        mostrarModal("#guiarPrimerPunto","fade","Recolectar",function(){
            navigator.compass.clearWatch(watchHeadingId);
            setTimeout(function(){
                r.detener()
                setTimeout(function(){
                    r.detener()
                },1000);

            },500);
            dist = -1;
            Gps.pararGps();
            cerrarModal();

        });
        r = new Radar("contenedor",100);
        mostrarMascara("Obteniendo Posicion");
        var dist = -1;
        var longitudActual = -1;
        var latitudActual = -1;
        var destinoFinal = false;

        var watchHeadingId = navigator.compass.watchHeading(function(dir){

            if(dist != -1){
                if(dist<=DISTANCIA_ACEPTABLE){
                    $.mvc.route("aplicacion/detenerGuia");

                    $("#botonCerrarModal").trigger("click"); //triger


                    setTimeout(function(){
                        $.mvc.route("aplicacion/crearPunto");
                        mensajeExitoso("1er Punto Alcanzado");
                    },50);
                    destinoFinal = true;
                    dist = -1;
                    r.detener();
                    /*$.ui.hideModal();
                    Gps.pararGps();
                    setTimeout(function(){r.detener()},100);
                    navigator.compass.clearWatch(watchHeadingId);*/


                }

                var angulo = Gps.calcularAngulo(longitudActual,latitudActual,longitud,latitud);
                var anguloObservacion = dir.magneticHeading * (Math.PI/180);
                angulo = ((angulo) + anguloObservacion) ;
               // angulo = angulo - Math.PI - anguloObservacion;
                r.marcarObjetivo(-angulo,dist);
                //angulo = -(angulo*180/Math.PI);
                angulo = -(angulo*180/Math.PI)+90;
                $("#divFlechaSeguimiento").css3Animate({previous:true,time:"300ms",rotateX:angulo+"deg",origin:"51% 50%"});

                $("#distancia").empty();
                $("#distancia").append(dist.toFixed(1));
            }
        }, null, { frequency: 1000 });


        Gps.obtenerPosicion(function(lng,lat){
            ocultarMascara();
            if(!destinoFinal)
                dist = Gps.distanciaEntrePuntos(lng,lat,longitud,latitud);
            longitudActual = lng;
            latitudActual = lat;

        });

/*        asignarFuncionCierreModal(function(){
            navigator.compass.clearWatch(watchHeadingId);
            setTimeout(function(){
                r.detener()
                setTimeout(function(){
                    r.detener()
                },1000);

            },500);
            dist = -1;
            Gps.pararGps();
            cerrarModal();
            //$.ui.hideModal();
        });*/

        $("#contenedorFlechaSeguimiento").css({height: $("#contenedorDistancia").offset().height+"px"});

    },

    sincronizacion:function(){
        activarSubPagina("#sincronizacion","Sincronización");
        $("#mainSincronizacion").html($.template('js/vista/sincronizacion.tpl',{"conf":configuracion}));
        activarBotonAtras(function(){activarSubPagina("#uib_page_3","Miscelánea");});

    },


    buscarServidor:function(){
        if(campañaActiva != null){
            mensajeAviso('Campaña Activa','Debe desactivar la Campaña antes de poder sincronizar.<br>Para esto,valla al menú de "Campaña" y presione el botón "Desactivar" ubicado en la esquina superior derecha');
            return;
        }
        $("#dispositivos").empty();
        var ipServidorExterno = $("#servidorExterno").val();
        buscarRedConIP(ipServidorExterno,function(infoServidor){
            var $servidor = $('<li class="widget servidor"><a class="anchorServidor"><i class="fa fa-cloud"></i>'+infoServidor.nombrePC+'<div><a name="botonSincronizar" class="botonActivar" href="/aplicacion/sincronizar/'+infoServidor.ip+'/'+encodeURI(infoServidor.nombrePC)+'/'+infoServidor.infoAdicional.especies+'/'+infoServidor.infoAdicional.familias+'"><i class="fa fa-retweet logoSincronizar" ></i></a></div> </a></li>');
                      $("#dispositivos").removeClass("oculto");
                      $("#noServidores").addClass("oculto");
                      $("#dispositivos").append($servidor);
                      ocultarMascara();
        });
        
        /*if(ipServidorExterno != ""){
            $.ajax({
              type: "POST",
              url: "http://"+ipServidorExterno+":"+configuracion.puerto+"/quienSos/",
              data: {'nombre':'pepito'},
              success: function(data){
                  var infoServidor = JSON.parse(data);
                  if(infoServidor.hasOwnProperty("nombrePC")){
                      var $servidor = $('<li class="widget servidor"><a class="anchorServidor"><i class="fa fa-cloud"></i>'+infoServidor.nombrePC+'<div><a class="botonActivar" href="/aplicacion/sincronizar/'+infoServidor.ip+'/'+encodeURI(infoServidor.nombrePC)+'/'+infoServidor.infoAdicional.especies+'/'+infoServidor.infoAdicional.familias+'"><i class="fa fa-retweet logoSincronizar" ></i></a></div> </a></li>');
                      $("#dispositivos").removeClass("oculto");
                      $("#noServidores").addClass("oculto");
                      $("#dispositivos").append($servidor);
                      ocultarMascara();
                  }
                }
            });
        }*/
    },

    sincronizar:function(direccion,nombrePCCodificado,cantidadEspecies,cantidadFamilias){
        var nombrePC = decodeURI(nombrePCCodificado);
        auditor = new auditorActualizaciones(cantidadEspecies,cantidadFamilias,nombrePC);  
        var servidor = "http://"+direccion+":8000/sinc";
        sincronizarElementoSimple(servidor,"suelo","TipoSuelo","Suelo",function(s){tiposSuelos.push(s)},function(){tiposSuelos=[]});
        sincronizarElementoSimple(servidor,"dist","DistribucionGeografica","Distribución Geográfica",function(s){distribuciones.push(s)},function(){distribuciones=[]});
        sincronizarElementoSimple(servidor,"forma","FormaBiologica","Forma Biológica",function(s){formasBiologicas.push(s)},function(){formasBiologicas=[]});
        sincronizarElementoSimple(servidor,"tipo","TipoBiologico","Tipo Biológico",function(s){tiposBiologicos.push(s)},function(){tiposBiologicos=[]});
        sincronizarElementoSimple(servidor,"estado","EstadoDeConservacion","Estado De Conservación",function(s){estadosDeConservacion.push(s)},function(){estadosDeConservacion=[]});
        campaniasASincronizar = [];
        Y.TipoEjemplar.sincronizar(servidor,function(servidor){
            
            Y.Familia.sincronizar(servidor,function(){
                console.log("termino la familia y comienza ...");
                Y.Especie.sincronizar(servidor,function(){
                    console.log("termino la especie y termino");
                    campañas.map(function(c){
                        Y.Campania.obtenerCampaniaCompleta(c.nombre,c.fecha,function(campania){
                            campaniasASincronizar.push(campania);
                            campania.sincronizar(servidor);

                        });
                    })
                });
            });
            
            
        });
        /*Y.Familia.sincronizar(servidor,function(){
            console.log("termino la familia y comienza ...");
            Y.Especie.sincronizar(servidor,function(){
                console.log("termino la especie y termino");
                campañas.map(function(c){
                    Y.Campania.obtenerCampaniaCompleta(c.nombre,c.fecha,function(campania){
                        campaniasASincronizar.push(campania);
                        campania.sincronizar(servidor);
                        
                    });
                })
            });
        });*/
    },
    
     
    
    configuracion:function(){
        activarSubPagina("#configuracion","Configuración");
        $("#mainConfiguracion").html($.template('js/vista/configuracion.tpl',{"conf":configuracion}));
        activarBotonAtras(function(){activarSubPagina("#uib_page_3","Miscelánea");});

    },

    guardarConfiguracion:function(){
        var puerto = $("#mainConfiguracion").find("#puertoServidor").val();
        var direccion = $("#mainConfiguracion").find("#direccionServidor").val();
        if(puerto.length != 0 && direccion.length != 0){
            configuracion.servidor = direccion;
            configuracion.puerto = puerto;
            localStorage.setItem('conf', JSON.stringify(configuracion));
            activarSubPagina("#uib_page_3","Miscelánea");
            mensajeExitoso("Configuración Almacenada");
        }else{
            mensajeError("Hay campos vacios");
        }
    }



});

