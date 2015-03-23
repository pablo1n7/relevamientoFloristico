function activarBotonAtras(funcionClick){
    $("#backButton").unbind();
    $("#backButton").css({"visibility":"initial"});
    $("#backButton").click(function(){
        desactivarBotonesHeader();
        funcionClick();
    });

}

function activarBotonFuncionalidad(nombre,funcionClick){
    $("#funcionalidad").append(nombre);
    $("#funcionalidad").css({"visibility":"initial"});
    $("#funcionalidad").click(function(){

        desactivarBotonesHeader();
        funcionClick();
    });


}

function desactivarBotonesHeader(){
    $("#backButton").css({"visibility":"hidden"});
    $("#backButton").unbind();
    $("#funcionalidad").css({"visibility":"hidden"});
    $("#funcionalidad").empty();
    $("#funcionalidad").unbind();
}

function activarSubPagina(nombreSubPagina,titulo){
    $($(nombreSubPagina).parent()[0]).unbind("doubleTap");
    navigator.compass.clearWatch(idBrujula);
    $("#tituloSubPagina").empty()
    $("#tituloSubPagina").append(titulo);
    activate_subpage(nombreSubPagina);
    desactivarBotonesHeader();
    if( (typeof diccionarioAyuda !== "undefined") && diccionarioAyuda[nombreSubPagina])
        $($(nombreSubPagina).parent()[0]).bind("doubleTap",function(){activarModoAyuda(nombreSubPagina,diccionarioAyuda[nombreSubPagina])});
}

function mostrarModal(div,efecto,titulo){
    $.ui.showModal(div,efecto);
    $("#modalHeader h1 ").empty();
    $("#modalHeader h1 ").append(titulo);

}

function activarModoAyuda(contexto,diccionario){
    console.log("SE JSUTIVIFACA");
    $("body").append('<div id="divAyuda" class="divAyuda"/>');
    $("#divAyuda").bind("doubleTap",function(){
        $("#divAyuda").remove();
    });
    var referenciaTop = $("#header").offset().height;
    if(contexto == "#modalContainer")
        referenciaTop = 43;
    var referenciaBottom = $("#navbar").offset().top - 5;
    if(contexto == "#modalContainer")
        referenciaBottom = 10000;
    $.each(Object.keys(diccionario),function(indice,elemento){
        var elementos = {};
        if( elemento=="botonFuncionalidad"){
            elementos = $("body").find("[name|="+elemento+"]");
            referenciaTop=0;
            referenciaBottom=10000;
        }else{
            elementos = $(contexto).find("[name|="+elemento+"]");
        }

        for (var i = 0; i<elementos.length;i++){
            var posicion = $(elementos[i]).offset();
            if((posicion.top > referenciaTop) && (posicion.top < referenciaBottom)){
                var $ayudaElemento = $("<div class='icon question'> </div>");
                $ayudaElemento.css(posicion);
                $ayudaElemento.css({"position":"absolute", "color":"rgba(82,155,234,255)"});
                $ayudaElemento.click(function(){
                    lanzarTooltip(diccionario[elemento],$(this).offset());
                });
                $("#divAyuda").append($ayudaElemento);
            }
        }
    });

}

function lanzarTooltip(objetoAyuda, posicion){
    $("#mensajeAyuda").remove();
    $divMensaje = $('<div id="mensajeAyuda" class="divMensajeAyuda"> <div class="widget-container content-area horiz-area wrapping-col right" > <span class="icon close" onclick="borrarMensajeAyuda()"></span> </div> <div class="divMensajeAyudaHeader">'+objetoAyuda.titulo+'</div></div>');
    $divMensaje.append('<p>'+ objetoAyuda.mensaje+ '</p>');
/*    posicion.width = "50";
    posicion.height = "";
    posicion.bottom = "";
    posicion.top = "";
    $divMensaje.css(posicion);*/
    $("#divAyuda").append($divMensaje);
}

function borrarMensajeAyuda(){
    $("#mensajeAyuda").remove();
};

function agregarAyuda(contexto,diccionario){
    console.log(contexto);
    var $contexto = $(contexto);
    $contexto.doubleTap(function(){activarModoAyuda(contexto,diccionario)});
}


//function(){console.log("Done for!");}
//

function mensajeConfirmacion(titulo,mensaje,funcionAceptar,funcionCancelar){
    $.ui.popup( {
       title:titulo,
       message:mensaje,
       doneText:"Aceptar",
       doneCallback: funcionAceptar,
       cancelText:"Cancelar",
       cancelCallback: funcionCancelar,
       cancelOnly:false
    });

}

function mensajeExitoso(mensaje){
    $.ui.popup( {
       title:"<div class='icon check exito' >Éxito</div>",
       message:mensaje,
       cancelText:"Aceptar",
       cancelOnly:true
    });
}

function mensajeError(mensaje){
    $.ui.popup( {
       title:"<div class='icon warning error' >Error</div>",
       message:mensaje,
       cancelText:"Aceptar",
       cancelOnly:true
    });
}

function obtenerValoresBD(nombreTabla,arreglo){
    var q = "select * from "+nombreTabla;
    db.transaction(function (t) {
        t.executeSql(q, null, function (t, data) {
            for (var i = 0; i < data.rows.length; i++) {
                arreglo.push(data.rows.item(i).nombre);
                //console.log(data.rows.item(i));
            };
        });
    });
};


function toogleOpciones(elem){
    if($($(elem).children()[0]).css("width") == "65%"){
        $($(elem).children()[0]).css3Animate({
            width: "100%",
            time: "500ms",
            origin: "width",
        });

        $($(elem).children()[1]).css3Animate({
            width: "0%",
            time: "500ms",
            origin: "width"
        });
        return;
    }
    $($(elem).children()[0]).css3Animate({
        width: "65%",
        time: "500ms",
        origin: "width"
    });

    $($(elem).children()[1]).css3Animate({
        width: "35%",
        time: "500ms",
        origin: "width"
    });
}


//$("#contenedorTipos")
function toogleAlto(idElemento,height){
    $(idElemento).parent().unbind();
    $(idElemento).css({"height":"0px"});
    $(idElemento).parent().click( function(){
        $(idElemento).parent().unbind();
        $(idElemento).css3Animate({
            height: height,
            time: "1000ms",
            previous: true,
            success: function(){
                $(idElemento).parent().unbind();
                $(idElemento).parent().click(function(){
                    $(idElemento).parent().unbind();
                    $(idElemento).css3Animate({
                        height: "0%",
                        time: "1000ms",
                        previous: true,
                        success:function(){
                            toogleAlto(idElemento,height);
                        }
                    });
                });
            }
        });
    });

}

function activarBrujula(callback,listo){
    var options = {
        frequency: 300
    };
    var watchID = navigator.compass.watchHeading(callback, null, options);
    listo(watchID);
}


callbackCapturaImg = null;
function listenerCamara(e){

    /*var rutaImg = intel.xdk.camera.getPictureURL(e.filename);*/
    alert(e.filename);
    callbackCapturaImg(e.filename);

}

document.addEventListener("intel.xdk.camera.picture.add",listenerCamara);

function tomarFoto(callback){
    callbackCapturaImg = callback;
    intel.xdk.camera.takePicture(80,false,"jpg");
}


function verImagen(urlImg,elemento,noEliminable){
    var noEliminable = (noEliminable) ? noEliminable:false;
    var divFoto = $('<div id="visorImagen" class="visorImagen"/>');
    divFoto.append('<div class="widget-container content-area horiz-area wrapping-col iconosFoto iconoX"><span class="icon close" onclick="$(this.parentElement).parent().parent().remove();"></span></div>');
    var imagen = $('<img src='+urlImg+' class="imagenAVisualizar"/>');
    divFoto.append(imagen);
    if(!noEliminable){
        var otroDiv = $('<div class="widget-container content-area horiz-area wrapping-col iconosFoto contenedorTrash"><span class="icon trash"></span></div>')
        otroDiv.click(function(){confirmarEliminado(otroDiv,elemento)});
        divFoto.append(otroDiv);
    }
    $("body").append('<div id="divFondoImagen" class="divAyuda"/>');
    $('#divFondoImagen').append(divFoto);

}

function eliminarFoto(elemento){
    $(elemento).attr("style","");
    $(elemento.parentElement).parent().attr("style","background-color:white");
    var nombreFoto = $($(elemento.parentElement).find('[name|=imgUrl]')[0]).html();
    intel.xdk.camera.deletePicture(nombreFoto);
    $($(elemento.parentElement).find('[name|=imgUrl]')[0]).empty();

    $($(elemento.parentElement).find('[name|=verFoto]')[0]).addClass('oculto');
}


function confirmarEliminado(botonEliminar,elemento){
    var avisoTitulo = "Aviso";
    var avisoMensaje = "Esta seguro que desea eliminar esta imagen?";
    mensajeConfirmacion(avisoTitulo,avisoMensaje,function(){botonEliminar.parent().parent().remove();eliminarFoto(elemento);},function(){});
}


function eliminarRecolectable(spanX){

    var nombreFoto = $($(spanX).parent().parent().find('[name|=imgUrl]')[0]).html();
    if(nombreFoto != '')
        intel.xdk.camera.deletePicture(nombreFoto);
    $(spanX.parentElement).parent().parent().remove();

}

function eliminarImagenes(){
    var divsImg= $("#datosPlantas").find("[name |= imgUrl]");
    for(var i=0; i<divsImg.length ; i++){
        var nombreFoto = $(divsImg[i]).html();
        if(nombreFoto != ""){
            alert("Borre "+(i+1));
            intel.xdk.camera.deletePicture(nombreFoto);
        }
    }

    $.ui.hideModal();
    $("#botonCerrarModal").remove();
}


function verImagenEspecie(selectEspecies){
    var nombreEspecie = $(selectEspecies).val();
    var especie = (especies.filter(function(esp){return esp.get("nombre")==nombreEspecie}))[0];
    verImagen('data:image/jpeg;base64,'+especie.verImagen(),null,true);
}


function autocompletadoEspecies(idElemento,sugerirSiempre){
    var especiesJson = [];
    for (var i=0;i<especies.length;i++){
        especiesJson.push({ 'id':especies[i].get("nombre"), 'value':especies[i].get("nombre"), 'info':especies[i].get("familia")});
	}

    var options = {
        script: "inicio",
        varname: "inicio",
        json: true,
        maxentries: 3,
        noresults: "Sin Resultados!",
        valores: especiesJson,
        alwaysSuggest: sugerirSiempre
    };
    var as = new AutoSuggest(idElemento, options);
}

idSeguimiento= -1;
dirAnterior = null;
vueltas = 0;

function activarBrujulaSeguimiento(direccionCorrecta){
    direccionCorrecta = parseFloat(direccionCorrecta);
    if(idSeguimiento != -1)
        navigator.compass.clearWatch(idSeguimiento);
    activarBrujula(function(dir){
        var valorMovimiento = direccionCorrecta - dir.magneticHeading;
        var dirActual = dir.magneticHeading;

        if(dirAnterior==null)
            dirAnterior = dirActual;

        if ((dirAnterior> 270 && dirAnterior< 360) && dirActual < 90 ){
            vueltas--;
        }else{

            if ( (dirAnterior< 90) && (dirActual> 270 && dirActual< 360)){
                vueltas++;
            }
            else{
    valorMovimiento = valorMovimiento + (360 * vueltas);
    $("#flechaSeguimiento").css3Animate({previous:true,time:"300ms",rotateX:valorMovimiento+"deg",origin:"51% 80.5%"});
            }

        }




        //$("#flechaSeguimiento").css3Animate({previous:true,time:"300ms",rotateX:(direccionCorrecta-dir.magneticHeading)+"deg",origin:"51% 80.5%"});
        dirAnterior = dirActual;

    },function(idBrujula){idSeguimiento = idBrujula})

}


//pantallaActual = null;


estadoSliders = [{contador:0,callback:function(idDivFechaVisita){activarSliderPuntosVisita(idDivFechaVisita,10,"sliderPuntosVisita",1);}},{contador:0,callback:function(idDivFechaVisita){}}];

function activarSliderPuntosVisita(idContenedorVisita, desplazamiento,claseHijos,indice){
    estadoSliders[indice].contador=0;
    var divContenedor = $("#"+idContenedorVisita);
    var contenedores = divContenedor.find("."+claseHijos);
    propiedades = $(contenedores[0]).offset();
    divContenedor.css({height:propiedades.height});
    var cantSliders = contenedores.length;
    for(var i=1;i<cantSliders;i++){
        $(contenedores[i]).css({marginTop:-propiedades.height,left:propiedades.left+screen.width});
    }

    /*$(divContenedor.find("."+claseDivEvento)[0]).bind("swipeLeft",function(e){e.preventDefault();correrIzquierda(divContenedor,cantSliders,claseHijos,indice)});
    $(divContenedor.find("."+claseDivEvento)[0]).bind("swipeRight",function(e){e.preventDefault();correrDerecha(divContenedor,cantSliders,claseHijos,indice)});*/
    divContenedor.bind("swipeLeft",function(e){e.stopPropagation();correrIzquierda(divContenedor,cantSliders,claseHijos,indice,desplazamiento)});
    divContenedor.bind("swipeRight",function(e){e.stopPropagation();correrDerecha(divContenedor,cantSliders,claseHijos,indice,desplazamiento)});
}



function correrIzquierda(divContenedor,cantidadContenedores,claseHijos,indice,desplazamiento){

    if(estadoSliders[indice].contador != cantidadContenedores-1 ){
        divContenedor.addClass("desenlazar");
        var contenedores =  divContenedor.find("."+claseHijos);
        var cont1 = $(contenedores[estadoSliders[indice].contador]);
        console.log(estadoSliders[indice].contador);
        cont1.css3Animate({
                            x: -(screen.width + (screen.width/desplazamiento)),
                            time: "500ms",
                            previous: true,
                        });
        estadoSliders[indice].contador = (estadoSliders[indice].contador+1);//%cantidadContenedores;
        var cont2 = $(contenedores[estadoSliders[indice].contador]);
        cont2.css3Animate({
                            x: -(screen.width + (screen.width/desplazamiento)),
                            time: "500ms",
                            previous: true,
                            success: function(){
                                divContenedor.removeClass("desenlazar");
                                if(indice == 0){
                                    estadoSliders[indice].callback($($(divContenedor.find("."+claseHijos)[estadoSliders[indice].contador]).find(".contenedorPuntosVisita")[0]).attr("id"));
                                }
                            }
                        });
    }
}

function correrDerecha(divContenedor,cantidadContenedores,claseHijos,indice,desplazamiento){

    if(estadoSliders[indice].contador != 0 ){
        divContenedor.addClass("desenlazar");
        var contenedores =  divContenedor.find("."+claseHijos);
        var cont1 = $(contenedores[estadoSliders[indice].contador]);
        cont1.css3Animate({
                            x: (screen.width + (screen.width/desplazamiento)),
                            time: "500ms",
                            previous: true,
                        });
        estadoSliders[indice].contador = (estadoSliders[indice].contador-1);
        var cont2 = $(contenedores[estadoSliders[indice].contador]);
        cont2.css3Animate({
                            x: (screen.width + (screen.width/desplazamiento)),
                            time: "500ms",
                            previous: true,
                            success: function(){
                                divContenedor.removeClass("desenlazar");
                                if(indice == 0){
                                    estadoSliders[indice].callback($($(divContenedor.find("."+claseHijos)[estadoSliders[indice].contador]).find(".contenedorPuntosVisita")[0]).attr("id"));
                                }

                            }
                        });
        }
}



var SlidersManager = function(){
    var objetosSliders = [];

    this.agregarSlider = function(idDivContenedor,cantidadContenedores,claseHijos,desplazamiento,callback){
        var slid = objetosSliders.filter(function(s){return s.id==idDivContenedor});
        if(slid.length == 0){
            objetosSliders.push(new Slider(idDivContenedor,cantidadContenedores,claseHijos,desplazamiento,callback));
        }
    };

    this.vaciarSlider = function(){
        objetosSliders = [];
    };



    return{
        objetos:objetosSliders,
        vaciar: vaciarSlider,
        agregarSlider:this.agregarSlider
    }

}();

var Slider = function(idSlider,cantidadContenedores,claseHijos,desplazamiento,callback){
    this.id = idSlider;
    this.cantidadContenedores = cantidadContenedores;
    this.objetosMoviles = claseHijos;
    this.desplazamiento = desplazamiento;
    this.indice = 0;
    this.callback = callback;


    this.izquierda = function(){
        if(this.indice < this.cantidadContenedores){
            var contenedores =  $("#"+this.id).find("."+this.objetosMoviles);
            var cont1 = $(contenedores[this.indice]);
            cont1.css3Animate({
                    x: -(screen.width + (screen.width/this.desplazamiento)),
                    time: "500ms",
                    previous: true
                });
            this.indice++;
            var cont2 = $(contenedores[this.indice]);
            var _this = this;
            cont2.css3Animate({
                        x: -(screen.width + (screen.width/this.desplazamiento)),
                        time: "500ms",
                        previous: true,
                        success:function(){
                            console.log("derecha");
                            _this.callback(_this,cont2);
                            $("#vistaPuntos").addClass("oculto");
                            $("#vistaPuntos").removeClass("oculto");
                        }
            });
        }
    };

    this.derecha = function(){
        if(this.indice > 0){
            var contenedores =  $("#"+this.id).find("."+this.objetosMoviles);
            var cont1 = $(contenedores[this.indice]);
            cont1.css3Animate({
                    x: (screen.width + (screen.width/this.desplazamiento)),
                    time: "500ms",
                    previous: true
                });
            this.indice--;
            var cont2 = $(contenedores[this.indice]);
            var _this = this;
            cont2.css3Animate({
                        x: (screen.width + (screen.width/this.desplazamiento)),
                        time: "500ms",
                        previous: true,
                        success:function(){
                            $("#vistaPuntos").addClass("oculto");
                            $("#vistaPuntos").removeClass("oculto");
                        }
                    });
        }
    };

    var divContenedor = $("#"+this.id);
    var contenedores = divContenedor.find("."+this.objetosMoviles);
    propiedades = $(contenedores[0]).offset();
    divContenedor.css({height:propiedades.height});
    var cantSliders = contenedores.length;
    for(var i=1;i<cantSliders;i++){
        $(contenedores[i]).css({marginTop:-propiedades.height,left:propiedades.left+screen.width});
    }
    var _this = this;
    $("#"+this.id).bind("swipeLeft",function(e){
        e.stopPropagation();
        _this.izquierda();
    });
    $("#"+this.id).bind("swipeRight",function(e){
        e.stopPropagation();
        _this.derecha();
    });
}




















