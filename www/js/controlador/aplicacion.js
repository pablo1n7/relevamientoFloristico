$.mvc.controller.create("aplicacion", {
    views:["js/vista/main.tpl",'js/vista/cargarEjemplar.tpl','js/vista/crearTipoEjemplar.tpl','js/vista/listaTipoEjemplar.tpl','js/vista/verTipoEjemplar.tpl','js/vista/listaFamilias.tpl','js/vista/crearFamilia.tpl','js/vista/listaEspecies.tpl','js/vista/crearEspecie.tpl','js/vista/verEspecie.tpl','js/vista/crearPlanta.tpl','js/vista/listaCampania.tpl','js/vista/crearCampania.tpl','js/vista/campaniaActiva.tpl','js/vista/crearTransecta.tpl','js/vista/crearPunto.tpl','js/vista/recolectarPunto.tpl','js/vista/seguimientoTransecta.tpl','js/vista/vistaPuntos.tpl'], //These are the views we will use with the controller
    init:function(){

        popularBD();
        CANTIDAD_PUNTOS = 28;
        tipoEjemplares=[];
        familias = [];
        especies = [];
        campañas = [];
        campañaActiva = null;
        transectaActiva = null;
        estadoPunto=["Toque Directo","Muerto en Pie","Suelo Desnudo"];
        estadosDeConservacion=[];
        formasBiologicas=[];
        tiposBiologicos =[];
        tiposSuelos=[];
        distribuciones = [];

        idBrujula = -1;

        obtenerValoresBD("EstadoDeConservacion",estadosDeConservacion);
        obtenerValoresBD("FormaBiologica",formasBiologicas);
        obtenerValoresBD("TipoBiologico",tiposBiologicos);
        obtenerValoresBD("DistribucionGeografica",distribuciones);
        obtenerValoresBD("TipoSuelo",tiposSuelos);






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

    seleccionarEjemplar: function(numeroId){
        $("#item"+numeroId).html($.template('js/vista/cargarEjemplar.tpl',{tipoEjemplares:campañaActiva.get("tipoEjemplares"),numeroId:numeroId}));
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
         idTipos.push("1");
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
            campañaActiva = camp;
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
        transectaActiva = null;
        $.mvc.route("aplicacion/listaCampanias");
    },



    creacionTransecta:function(){

        activarSubPagina("#crearTransecta","Nueva Transecta");
        activarBotonAtras(function(){$.mvc.route("aplicacion/listaCampanias");});
        $("#mainCrearTransecta").html($.template('js/vista/crearTransecta.tpl',{screen:screen,especies:especies}));
        autocompletadoEspecies("especiePredominante1",false);
        autocompletadoEspecies("especiePredominante2",false);
        autocompletadoEspecies("especiePredominante3",false);
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
        var ambiente= $("#ambiente").val();
        var sentido = $("#valorSentido").text();
        var cuadro = $("#cuadro").val();

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


        var transecta = new Y.Transecta({"ambiente":ambiente,"sentido":sentido,"cuadro":cuadro,"campania":campañaActiva,"nombreEspecies":nombreEspecies});
        $.ui.showMask('Guardando...');
        transecta.save(function(){
            $.ui.hideMask();
            campañaActiva.get("transectas").push(transecta);

            mensajeExitoso("La transecta ha sido agregado con éxito");
            //$.mvc.route("aplicacion/listaCampanias");
            $.mvc.route("aplicacion/activarTransecta/"+transecta.get("id"));

            $.mvc.route("aplicacion/crearPunto");


        });
    },

    activarTransecta: function(id){

        Y.Transecta.obtenerTransecta(id,function(transecta){
            transectaActiva = transecta;
            var visita = new Y.Visita({fecha:Date.now()});
            //visita.save(transecta.get("id"));
            transecta.get("visitas").push(visita);
            activarBrujulaSeguimiento(transectaActiva.get("sentido"));
            activarSubPagina("#mainsub","Pagina Principal");
             $("#mainSeguimiento").html($.template('js/vista/seguimientoTransecta.tpl'));
            justgageTransecta = new JustGage({ id: "justgageTransecta",value: 0,min: 0,max: 100,title: "Progreso Transecta", symbol:"%",label:"Completado",levelColors:["#02cb28"],titleFontColor:"white",labelFontColor:"white",valueFontColor:"white"});
            justgageCampania = new JustGage({ id: "justgageCampania",value: 0,min: 0,max: 100,title: "Progreso Campania", symbol:"%",label:"Completado",levelColors:["#02cb28"],titleFontColor:"white",labelFontColor:"white",valueFontColor:"white",humanFriendly:true,humanFriendlyDecimal:'1'});


        });

    },

    crearPunto:function(){

        $("#mainCrearPunto").html($.template('js/vista/crearPunto.tpl',{}));
        mostrarModal("#crearPunto","fade","Recolectar Punto");
    },

    almacenarPunto:function(){
        var estadoAguja = $("#estadoAguja").text().split(":")[1];
        var tipoSuleo = $("#tipoSuelo").val();
        var plantas = $("#datosPlantas").find("[name|=planta]");
        var items = $("#datosPlantas").find("[name|=item]");
        punto = new Y.Punto({"estado":estadoAguja,"suelo":tipoSuleo});
        for(var i=0;i<items.length;i++){
            //var unItem = new Y.Ejemplar({"tipo":});
            var campos = $(items[i]).find(".input-group");
            var foto = $(campos[0]).find("[name|=imgUrl]")[0].innerHTML || "";
            var nombreTipoEjemplar = $($(campos[0]).find("[name|=tipoEjemplares]")[0]).val();
            var tipoEjemplar = tipoEjemplares.filter(function(tE){return tE.get("nombre")== nombreTipoEjemplar})[0];
            var ejemplar = new Y.Ejemplar({"tipoEjemplar":tipoEjemplar,"foto":foto});
            ejemplar.crearCampos(tipoEjemplar.get("campos"));
            ejemplar.completarCampos(campos.slice(1,campos.length));
            //ejemplar.save(function(){console.log("Ejemplar Guardado con Exito")});
            punto.get("items").push(ejemplar);
        }

        for(var i=0;i<plantas.length;i++){
            var campo = $($(plantas[i]).find(".input-group")[0]);
            var foto = campo.find("[name|=imgUrl]")[0].innerHTML || "";
            var toques = campo.find("[name|=toquesPlanta]")[0].value;
            var nombreEspecie = campo.find("[name|=especie]")[0].value;
            var planta = new Y.Planta({"especie":nombreEspecie,"toques":toques,"foto":foto});
            punto.get("items").push(planta);
        }
         /*$.ui.showMask('Guardando...');*/
        var cantPuntos = transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].get("puntos").length;
        if(cantPuntos ==0 || cantPuntos == CANTIDAD_PUNTOS){
            console.log("aca obtengo posicion gps");
        }
        justgageTransecta.refresh(cantPuntos+1);
        var valorTemporal = parseFloat(justgageCampania.originalValue);
        justgageCampania.refresh((valorTemporal+0.1).toFixed(1));
        transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].almacenarPunto(punto);
        $.ui.hideModal();
        /*punto.save(transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1],function(unPunto){
            $.ui.hideMask();
            $.ui.hideModal();
            transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].get("puntos").push(unPunto);
            console.log("GuARDO PUNTO");
        });*/


    },

    creacionPunto:function(opcion){
        $("#mainCrearPunto").html($.template('js/vista/recolectarPunto.tpl',{opcion:parseInt(opcion),estadoPunto:estadoPunto[opcion],suelos:tiposSuelos}));
        var botonClose = $($("a.close")[0]);
        var nuevoBoton = $("<div id='botonCerrarModal'>");
        nuevoBoton.css({'background-color':'rgba(0,0,0,0)','position':'absolute','zIndex':'3'});
        nuevoBoton.css(botonClose.offset());
        $("#modalHeader").append(nuevoBoton);
        nuevoBoton.click(eliminarImagenes);
        $.mvc.route("aplicacion/cargarFormularioPlanta/1/"+opcion);
    },

    cargarFormularioPlanta:function(numeroId,conToques){
        var divPlanta = $("<div id='planta"+numeroId+"' name='planta' class='divRecolectables'/>");
        $("#datosPlantas").append(divPlanta);
        $(divPlanta).html($.template('js/vista/crearPlanta.tpl',{especies:especies,numeroId:numeroId,conToques:conToques}));
        $("#botonAgregarPlanta").attr("href","/aplicacion/cargarFormularioPlanta/"+(parseInt(numeroId)+1)+"/0");

        if(device.platform == "Android"){
            $("#mainCrearPunto").css({"height": "90%",
                                   "overflowY":"hidden"});
            setTimeout(function(){
                    $("#mainCrearPunto").scroller({
                        verticalScroll:true,
                        horizontalScroll:false,
                        autoEnable:true
                    });
            },1000);
        }


        autocompletadoEspecies("autocompletado"+numeroId,true);


    },

    cargarFormularioItem:function(numeroId){
        var divItem = $("<div id='item"+numeroId+"' name='item' class='divRecolectables'/>");
        $("#datosPlantas").append(divItem);
        $.mvc.route("aplicacion/seleccionarEjemplar/"+numeroId);
        $("#botonAgregarItem").attr("href","/aplicacion/cargarFormularioItem/"+(parseInt(numeroId)+1));

        if(device.platform == "Android"){
            $("#mainCrearPunto").css({"height": "90%",
                                   "overflowY":"hidden"});
            setTimeout(function(){
                    $("#mainCrearPunto").scroller({
                        verticalScroll:true,
                        horizontalScroll:false,
                        autoEnable:true
                    });
            },1000);
        }
    },

    verPuntos:function(){
        if(transectaActiva != null){
            $("#vistaPuntos").html($.template('js/vista/vistaPuntos.tpl',{transecta:transectaActiva,visitas:transectaActiva.get("visitas")}));

//                activarSliderPuntosVisita("visita"+transectaActiva.get("visitas")[0].get("fecha"),10,"sliderPuntosVisita",1);
//                activarSliderPuntosVisita("vistaPuntos",26,"sliderVisita",0);
            SlidersManager.vaciar();
            SlidersManager.agregarSlider("visita"+transectaActiva.get("visitas")[0].get("fecha"),11,"sliderPuntosVisita",10,function(){});
            SlidersManager.agregarSlider("vistaPuntos",transectaActiva.get("visitas").length,"sliderVisita",26,function(slid,siguiente){
                console.log("manager:");
                console.log(SlidersManager);
                console.log(slid);
                var idVisitaPunto = $(siguiente.find(".contenedorPuntosVisita")[0]).attr("id");
                console.log(idVisitaPunto);
                SlidersManager.agregarSlider(idVisitaPunto,11,"sliderPuntosVisita",10,function(){});
            });
/*            for(var i=1; i<transectaActiva.get("visitas").length;i++){
                SlidersManager.agregarSlider("visita"+transectaActiva.get("visitas")[i].get("fecha"),11,"sliderPuntosVisita",10);
            }    */
        }
    }
});
