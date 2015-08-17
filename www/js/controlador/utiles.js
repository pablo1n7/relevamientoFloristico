function activarBotonAtras(funcionClick){
    $("#backButton").unbind();
    $("#backButton").css({"visibility":"initial"});
    $("#backButton").click(function(){
        desactivarBotonesHeader();
        funcionClick();
    });

}

function activarBotonFuncionalidad(nombre,funcionClick){
    $("#funcionalidad").unbind();
    $("#funcionalidad").empty();
    ///////////////////////////
    $("#funcionalidad").append(nombre);
    $("#funcionalidad").css({"display":"none"});
    $("#funcionalidad").css({"visibility":"initial"});
    $("#funcionalidad").click(function(){

        desactivarBotonesHeader();
        funcionClick();
    });

    setTimeout(function(){
        $("#funcionalidad").css({"display":"block"});
    },100);


}

function desactivarBotonesHeader(){
    $("#backButton").css({"visibility":"hidden"});
    $("#backButton").unbind();
    //$("#funcionalidad").css({"visibility":"hidden"});
    //$("#funcionalidad").empty();
   // $("#funcionalidad").unbind();
}


// deseleccionar icono ==== $($("#navbar").find(".pressed")[0]).removeClass("pressed")
// seleccionar icono ===== $($("#navbar").find("a")[0]).addClass("pressed")
// #mainsub #uib_page_1 #uib_page_2 #uib_page_3

var subpaginas = ["#mainsub","#uib_page_1","#uib_page_2","#uib_page_3"];

function activarSubPagina(nombreSubPagina,titulo){
    $($(nombreSubPagina).parent()[0]).unbind("doubleTap");
    navigator.compass.clearWatch(idBrujula);
    $("#tituloSubPagina").empty()
    $("#tituloSubPagina").append(titulo);
    activate_subpage(nombreSubPagina);
    ////
    $("#funcionalidad").css({"visibility":"hidden"});
    $("#funcionalidad").empty();
    $("#funcionalidad").unbind();
    /////
    desactivarBotonesHeader();
    if( (typeof diccionarioAyuda !== "undefined") && diccionarioAyuda[nombreSubPagina])
        $($(nombreSubPagina).parent()[0]).bind("doubleTap",function(){activarModoAyuda(nombreSubPagina,diccionarioAyuda[nombreSubPagina])});
    $("#mainpage").scroller().scrollToTop("0ms");

    if(subpaginas.indexOf(nombreSubPagina) != -1){
        $($("#navbar").find(".pressed")[0]).removeClass("pressed");
        $($("#navbar").find("a")[subpaginas.indexOf(nombreSubPagina)]).addClass("pressed");

    }




}

function mostrarModal(div,efecto,titulo,callback){

    $.ui.showModal(div,efecto);
    $("#modalHeader h1 ").empty();
    $("#modalHeader h1 ").append(titulo);
    $("#seleccionarPropiedadScroller").scroller().scrollToTop("0ms");
    $("#crearPuntoScroller").scroller().scrollToTop("0ms");
    $("#flechaSeguimiento").addClass("esconder");
    setTimeout(function(){asignarFuncionCierreModal(callback);}, 500);


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
		var $mascaraPopUp = $('<div id="mascaraConfirmacionPopUp" class="mascaraPopUp mascaraConfirmacionPopUp"></div>');
		$("body").append($mascaraPopUp);
		var $divPopUp = $('<div class="popUp"/>');
		$mascaraPopUp.append($divPopUp);
		$divPopUp.append('<div class="cabeceraPopUp">'+titulo+'</div>');
		var $cuerpoPopUp = $('<div class="cuerpoPopUp">'+mensaje+'</div>');
		$divPopUp.append($cuerpoPopUp);
		var $contenedorBotones = $('<div class="contenedorBotones"/>');
		$contenedorBotones.append('<input type="button" id="aceptar" class="botonAceptar" value="Aceptar"/><input type="button" id="cancelar" class="botonCancelar" value="Cancelar"/>');
		$divPopUp.append($contenedorBotones);
		$("#cancelar").click(function(){
            $("#mascaraConfirmacionPopUp").remove()
            funcionCancelar()
        });
		$("#aceptar").click(function(){
		 	$("#mascaraConfirmacionPopUp").remove();
            funcionAceptar();
		 });


}

function mensajeAviso(titulo,mensaje){
		var $mascaraPopUp = $('<div id="mascaraConfirmacionPopUp" class="mascaraPopUp mascaraConfirmacionPopUp"></div>');
		$("body").append($mascaraPopUp);
		var $divPopUp = $('<div class="popUp"/>');
		$mascaraPopUp.append($divPopUp);
		$divPopUp.append('<div class="cabeceraPopUp"> <i class="fa fa-exclamation-triangle"></i>  '+titulo+' !</div>');
		var $cuerpoPopUp = $('<div class="cuerpoPopUp">'+mensaje+'</div>');
		$divPopUp.append($cuerpoPopUp);
		var $contenedorBotones = $('<div class="contenedorBotones centrado"/>');
		$contenedorBotones.append('<input type="button" id="cancelar" class="botonCancelar" value="Cancelar"/>');
		$divPopUp.append($contenedorBotones);
		$("#cancelar").click(function(){
            $("#mascaraConfirmacionPopUp").remove()
        });
}



function mensajeExitoso(mensaje){
    /*$.ui.popup( {
       title:"<div class='icon check exito' >Éxito</div>",
       message:mensaje,
       cancelText:"Aceptar",
       cancelOnly:true
    });
    */
    alertify.success(mensaje);
}

function mensajeError(mensaje){
    /*$.ui.popup( {
       title:"<div class='icon warning error' >Error</div>",
       message:mensaje,
       cancelText:"Aceptar",
       cancelOnly:true
    });*/
    alertify.error(mensaje);

}

function obtenerValoresBD(nombreTabla,arreglo){
    var q = "select * from "+nombreTabla;
    db.transaction(function (t) {
        t.executeSql(q, null, function (t, data) {
            for (var i = 0; i < data.rows.length; i++) {
                if (data.rows.item(i).id_servidor != 1)
                    arreglo.push({"id":data.rows.item(i).id_servidor,"nombre":data.rows.item(i).nombre});
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

arregloImgResiduales = [];
callbackCapturaImg = null;
callbackCancelImg = null;
function listenerCamara(e){

    /*var rutaImg = intel.xdk.camera.getPictureURL(e.filename);*/
    arregloImgResiduales.push(e.filename);
    callbackCapturaImg(e.filename);

}

function listenerCancelCamara(){
    callbackCancelImg();
}

document.addEventListener("intel.xdk.camera.picture.add",listenerCamara);
document.addEventListener("intel.xdk.camera.picture.cancel",listenerCancelCamara);

function tomarFoto(callback,callbackCancel){
    callbackCapturaImg = callback;
    callbackCancelImg = callbackCancel;
    intel.xdk.camera.takePicture(40,false,"jpg");
}


function verImagen(urlImg,elemento,noEliminable,callback){
    var noEliminable = (noEliminable) ? noEliminable:false;
    var divFoto = $('<div id="visorImagen" class="visorImagen"/>');
    divFoto.append('<div class="widget-container content-area horiz-area wrapping-col iconosFoto iconoX"><span class="icon close" onclick="$(this.parentElement).parent().parent().remove();"></span></div>');
    var imagen = $('<img src='+urlImg+' class="imagenAVisualizar"/>');
    divFoto.append(imagen);
    if(!noEliminable){
        var otroDiv = $('<div class="widget-container content-area horiz-area wrapping-col iconosFoto contenedorTrash"><span class="icon trash"></span></div>')
        otroDiv.click(function(){
            var avisoTitulo = "Aviso";
            var avisoMensaje = "Esta seguro que desea eliminar esta imagen?";
            mensajeConfirmacion(avisoTitulo,avisoMensaje,function(){otroDiv.parent().parent().remove();callback(elemento);},function(){});
        });
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
    //buscarla y elimianrla del arreglo residual
    arregloImgResiduales.splice(arregloImgResiduales.indexOf(nombreFoto),1);
    $($(elemento.parentElement).find('[name|=imgUrl]')[0]).empty();
    $($(elemento.parentElement).find('[name|=verFoto]')[0]).addClass('oculto');
}


/*function confirmarEliminado(botonEliminar,elemento){
    var avisoTitulo = "Aviso";
    var avisoMensaje = "Esta seguro que desea eliminar esta imagen?";
    mensajeConfirmacion(avisoTitulo,avisoMensaje,function(){botonEliminar.parent().parent().remove();callback(elemento);},function(){});
}*/


function eliminarRecolectable(spanX){

    var nombreFoto = $($(spanX).parent().parent().find('[name|=imgUrl]')[0]).html();
    if(nombreFoto != ''){
        intel.xdk.camera.deletePicture(nombreFoto);
         arregloImgResiduales.splice(arregloImgResiduales.indexOf(nombreFoto),1);
    }
    $(spanX.parentElement).parent().parent().remove();

}

function eliminarImagenes(idDiv){
    var divsImg= $(idDiv).find("[name |= imgUrl]");
    for(var i=0; i<divsImg.length ; i++){
        var nombreFoto = $(divsImg[i]).html();
        if(nombreFoto != ""){
            intel.xdk.camera.deletePicture(nombreFoto);
        }
    }

    //$.ui.hideModal();
    cerrarModal();
    //$("#botonCerrarModal").remove();
}


function verImagenEspecie(selectEspecies){
    var nombreEspecie = $(selectEspecies).val();
    var especie = (especies.filter(function(esp){return esp.get("nombre")==nombreEspecie}))[0];
    verImagen('data:image/jpeg;base64,'+especie.verImagen(),null,true);
}


function autocompletadoEspecies(idElemento,sugerirSiempre){
    var especiesJson = [];
    for (var i=0;i<especies.length;i++){
        especiesJson.push({ 'id':especies[i].get("nombre"), 'value':especies[i].get("nombre"), 'info':especies[i].get("familia").get("nombre")});
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

objetoBrujulaSeguimiento = {};
objetoBrujulaSeguimiento.idSeguimiento= -1;
objetoBrujulaSeguimiento.dirAnterior = null;
objetoBrujulaSeguimiento.vueltas = 0;

function activarBrujulaSeguimiento(direccionCorrecta){
    direccionCorrecta = parseFloat(direccionCorrecta);
    if(objetoBrujulaSeguimiento.idSeguimiento != -1)
        navigator.compass.clearWatch(objetoBrujulaSeguimiento.idSeguimiento);
    activarBrujula(function(dir){
        var valorMovimiento = direccionCorrecta - dir.magneticHeading;
        var dirActual = dir.magneticHeading;

        if(objetoBrujulaSeguimiento.dirAnterior==null)
            objetoBrujulaSeguimiento.dirAnterior = dirActual;

        if ((objetoBrujulaSeguimiento.dirAnterior> 270 && objetoBrujulaSeguimiento.dirAnterior< 360) && dirActual < 90 ){
            objetoBrujulaSeguimiento.vueltas--;
        }else{

            if ( (objetoBrujulaSeguimiento.dirAnterior< 90) && (dirActual> 270 && dirActual< 360)){
                objetoBrujulaSeguimiento.vueltas++;
            }
            else{
    valorMovimiento = valorMovimiento + (360 * objetoBrujulaSeguimiento.vueltas);
    $("#flechaSeguimiento").css3Animate({previous:true,time:"1000ms",rotateX:valorMovimiento+"deg",origin:"51% 80.5%"});
            }

        }
        objetoBrujulaSeguimiento.dirAnterior = dirActual;

    },function(idBrujula){
        console.log(idBrujula);
        objetoBrujulaSeguimiento.idSeguimiento = idBrujula;
    });

}



var SlidersManager = function(){
    var objetosSliders = [];

    this.agregarSlider = function(idDivContenedor,claseHijos,ancho,callback){
        var slid = objetosSliders.filter(function(s){return s.id==idDivContenedor});
        if(slid.length == 0){
            objetosSliders.push(new Slider(idDivContenedor,claseHijos,ancho,callback));
        }else{
            slid[0].inicializar();
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

var SlidersManagerImagenes = function(){
    var objetosSlidersImagenes = [];

    this.agregarSlider = function(idDivContenedor,claseHijos,ancho){
        var slid = objetosSlidersImagenes.filter(function(s){return s.id==idDivContenedor});
        if(slid.length == 0){
            objetosSlidersImagenes.push(new SliderImagenes(idDivContenedor,claseHijos,ancho));
        }else{
            slid[0].inicializar();
        }
    };

    this.vaciarSlider = function(){
        objetosSliders = [];
    };



    return{
        objetos:objetosSlidersImagenes,
        vaciar: vaciarSlider,
        agregarSlider:this.agregarSlider
    }

}();

var Slider = function(idSlider,claseHijos,ancho,callback){
    this.id = idSlider;
    this.objetosMoviles = claseHijos;
    this.ancho = ancho;
    this.indice = 0;
    this.callback = callback;
    this.cantidadContenedores = $("#"+this.id).find("."+this.objetosMoviles).length;


    this.izquierda = function(){
        if(this.indice < this.cantidadContenedores-1){
            this.indice++;
            var contenedores =  $("#"+this.id).find("."+this.objetosMoviles);
            var cont1 = $(contenedores[this.indice-1]);
            var cont2 = $(contenedores[this.indice]);
            this.callback(this,cont2);
            cont1.hide();
            cont2.show();
//            $("#"+this.id).animateCss({x:-(parseInt(this.ancho))*this.indice,y:"0",duration:"600",easing:"easeOutSine"}).start();
        }
    };

    this.derecha = function(){
        if(this.indice > 0){
            this.indice--;
            var contenedores =  $("#"+this.id).find("."+this.objetosMoviles);
            var cont1 = $(contenedores[this.indice+1]);
            var cont2 = $(contenedores[this.indice]);
            cont1.hide();
            cont2.show();
//            $("#"+this.id).animateCss({x:-((parseInt(this.ancho))*this.indice),y:"0",duration:"600",easing:"easeOutSine"}).start();

        }
    };

    this.inicializar = function(){
        var divContenedor = $("#"+this.id);
        var contenedores = divContenedor.find("."+this.objetosMoviles);
        var cantSliders = contenedores.length;
          $(contenedores[0]).css({width:"100%",overflowX:"hidden"});
        this.indice = 0;
        for(var i=1;i<cantSliders;i++){
            $(contenedores[i]).css({width:"100%"});
            $(contenedores[i]).hide();
        }

        var _this = this;
        $("#"+this.id).unbind();
        $("#"+this.id).bind("swipeLeft",function(e){
            $("body").addClass("desenlazar");
            e.stopPropagation();
            _this.izquierda();
            setTimeout(function(){
                $("body").removeClass("desenlazar");
            },500);
        });
        $("#"+this.id).bind("swipeRight",function(e){
            $("body").addClass("desenlazar");
            e.stopPropagation();
            _this.derecha();
            setTimeout(function(){
                $("body").removeClass("desenlazar");
            },500);
        });

        
//        var botonIzquierda = $("#"+_this.id).find("[name|=sliderDerecha]")[0];
//        var botonDerecha = $("#"+_this.id).find("[name|=sliderDerecha]")[0];
        
/*        var botonIzquierda = $($("#"+_this.id).find("."+_this.objetosMoviles)).find("[name|=sliderIzquierda]")[0];
        var botonDerecha = $($("#"+_this.id).find("."+_this.objetosMoviles)).find("[name|=sliderIzquierda]")[0];*/
        var botonDerecha = [];
        var botonIzquierda = [];
        var arregloObjetos = $("#"+_this.id).find("."+_this.objetosMoviles);
        for(var i = 0;i < arregloObjetos.length ;i++){
            botonDerecha.push($(arregloObjetos[i]).find("[name|=sliderDerecha]")[0]);
            botonIzquierda.push($(arregloObjetos[i]).find("[name|=sliderIzquierda]")[0]);
        }
        
//        var alto = $($(botonDerecha).parent()).offset().height;
        var alto = $($(botonDerecha[0]).parent()).offset().height;
        $(botonDerecha).css({"height":alto+"px"});
        $(botonIzquierda).css({"height":alto+"px"});
        $(botonIzquierda).click(function(e){
            $("body").addClass("desenlazar");
            e.stopPropagation();
            _this.derecha();
            setTimeout(function(){
                $("body").removeClass("desenlazar");
            },500);
        });
        $(botonDerecha).click(function(e){
            $("body").addClass("desenlazar");
            e.stopPropagation();
            _this.izquierda();
            setTimeout(function(){
                $("body").removeClass("desenlazar");
            },500);
        });
        
    };

        this.inicializar();
}


var SliderImagenes = function(idSlider,claseHijos,ancho){
    this.id = idSlider;
    this.objetosMoviles = claseHijos;
    this.ancho = ancho;
    this.indice = 0;

    this.cantidadContenedores = $("#"+this.id).find("."+this.objetosMoviles).length;

    this.izquierda = function(){
//        if(this.indice < this.cantidadContenedores-1){
        if(this.indice < this.cantidadContenedores){
            this.indice++;
            var contenedores =  $("#"+this.id).find("."+this.objetosMoviles);
            var cont2 = $(contenedores[this.indice]);
            //$("#"+this.id).animateCss({x:-((parseInt(this.ancho)+15)*this.indice),y:"0",duration:"200",easing:"easeOutSine"}).start();
            var valor = ((parseInt(this.ancho)+15)*-this.indice);
            $("#"+this.id).css({"left":valor+"px"});
        }
    };

    this.derecha = function(){
        if(this.indice > 0){
            this.indice--;
            //$("#"+this.id).animateCss({x:-((parseInt(this.ancho)+15)*this.indice),y:"0",duration:"200",easing:"easeOutSine"}).start();
            var valor = ((parseInt(this.ancho)+15)*-this.indice);
            $("#"+this.id).css({"left":valor+"px"});

        }
    };

    this.inicializar = function(){
        var divContenedor = $("#"+this.id);
        var contenedores = divContenedor.find("."+this.objetosMoviles);
        propiedades = $(contenedores[0]).offset();
        var cantSliders = contenedores.length;
        $(contenedores[0]).css({width:this.ancho,overflowX:"hidden"});
        this.indice = 0;
        for(var i=1;i<cantSliders;i++){
            $(contenedores[i]).css({width:this.ancho});
        }

        var anchoContenedor = ( (cantSliders * 15) + ( parseInt(this.ancho) * cantSliders) )+"px";

        if(cantSliders != 0)
            $("#"+this.id).css({width:anchoContenedor});

     //   this.cantidadContenedores = Math.ceil(((screen.width / parseInt(this.ancho))) / cantSliders);
        this.cantidadContenedores = cantSliders - parseInt(((screen.width / (parseInt(this.ancho)+15))));
        /*if(cantSliders>3)
            this.cantidadContenedores++;
        */
        var _this = this;
        $("#"+this.id).unbind();
        $("#"+this.id).bind("swipeLeft",function(e){
            $("body").addClass("desenlazar");
            e.stopPropagation();
            _this.izquierda();
            setTimeout(function(){
                $("body").removeClass("desenlazar");
            },500);
        });
        $("#"+this.id).bind("swipeRight",function(e){
            $("body").addClass("desenlazar");
            e.stopPropagation();
            _this.derecha();
            setTimeout(function(){
                $("body").removeClass("desenlazar");
            },500);
        });
    };

        this.inicializar();
}



function asociarItemVisita(){
    if (!validar($("#mainRelevarRecolectable"))){
            mensajeError("Campos incorrectos!");
            return;
    }
    var item = recolectarItem($("#recolectableVisita").find("[name|=item]")[0]);
    transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].almacenarItem(item);
    //$.ui.hideModal();
    mensajeExitoso("Item Recolectado");
    cerrarModal();
    arregloImgResiduales = [];
}

function recolectarItem(item){
    var campos = $(item).find(".input-group");
    var foto = $(campos[0]).find("[name|=imgUrl]")[0].innerHTML || "";
    var nombreTipoEjemplar = $($(campos[0]).find("[name|=tipoEjemplares]")[0]).val();
    var tipoEjemplar = tipoEjemplares.filter(function(tE){return tE.get("nombre")== nombreTipoEjemplar})[0];
    var ejemplar = new Y.Ejemplar({"tipoEjemplar":tipoEjemplar,"foto":foto});
    ejemplar.crearCampos(tipoEjemplar.get("campos"));
    ejemplar.completarCampos(campos.slice(1,campos.length));

    return ejemplar;
}

function asociarPlantaVisita(){
    if (!validar($("#mainRelevarRecolectable"))){
            mensajeError("Campos incorrectos!");
            return;
    }
    var planta = recolectarPlanta($("#recolectableVisita").find("[name|=planta]")[0]);
    transectaActiva.get("visitas")[transectaActiva.get("visitas").length-1].almacenarItem(planta);
//    $.ui.hideModal();
    mensajeExitoso("Planta Recolectada");
    cerrarModal();
    arregloImgResiduales = [];
}

function recolectarPlanta(planta){
    var campo = $($(planta).find(".input-group")[0]);
    var foto = campo.find("[name|=imgUrl]")[0].innerHTML || "";
    var toques = campo.find("[name|=toquesPlanta]")[0].value;
    var nombreEspecie = campo.find("[name|=especie]")[0].value;
    var estadoFenologico = campo.find("[name|=estadoFenologico]")[0].value;
    var especie = especies.filter(function(e){return e.get("nombre")==nombreEspecie})[0];
    var planta = new Y.Planta({"especie":especie,"toques":toques,"foto":foto,"estadoFenologico":estadoFenologico});

    return planta;
}



var Radar = function(idContenedor,cantidad){

		this.estadoZoom = 0;
		this.contenedor = $("#"+idContenedor);
		this.cantidad = cantidad;
		var _this = this;
        this.seguimientoActivo =true;
        this.objetivoEncontrado = false;

		this.agregarCuadro = function(clase){
			var cuadro = $('<div class="cuadro '+clase+'"></div>');
			_this.contenedor.append(cuadro);
            cuadro.css({height:cuadro.offset().width+"px"});
		}
		this.crearCuadricula = function(clase,cantidad){
			_this.contenedor.empty();
			for (var i = 0; i < cantidad; i++) {
				_this.agregarCuadro(clase);
			};
            //$("#radar").css({height:_this.contenedor.offset().width+"px"});
            $("#radar").css({height:_this.contenedor.offset().width+2+"px"});
            _this.contenedor.css({height:_this.contenedor.offset().width+"px"});
		};

		this.zoom = function(){
			if(_this.estadoZoom == 0){
				_this.zoomIn();
				_this.estadoZoom = _this.estadoZoom+1;
			}
			else{
				_this.zoomOut();
				_this.estadoZoom = _this.estadoZoom-1;
			}
		}

		this.zoomIn = function(){
			_this.crearCuadricula("cuadroZoomIn",(parseInt(25)));
		}

		this.zoomOut = function(){
			_this.crearCuadricula("cuadroZoomOut",_this.cantidad);
		}

		this.crearCuadricula("cuadroZoomOut",_this.cantidad);
		$("#radar").click(function(){
			_this.zoom();
		});

        this.detener= function(){
            _this.seguimientoActivo = false; 

        };
    
        this.sonar = function(intermitente){
            var intermitente = intermitente || 3;
            intermitente++;
            if(_this.seguimientoActivo){
                setTimeout(function(){ 
                    _this.sonar(intermitente);
                },300);

            }
            if(_this.objetivoEncontrado){
                if (intermitente >= 8){
                    intermitente=3;
                    intel.xdk.player.playSound("sonidos/bipRadar.mp3");
                    console.log("BEEP");
                }
                var color= "rgba(255,255,0,0."+intermitente+")";
                $("#objetivo").css({backgroundColor:color});
            }
        };

		this.marcarObjetivo = function(angulo,distancia){
            var x0 = 500;
            var y0 = 500;
            var porcentaje = 10;

            var x1 = (((Math.cos(angulo)*distancia)*(_this.estadoZoom+1))+x0)/porcentaje;
            var y1 = (((Math.sin(angulo)*distancia)*(_this.estadoZoom+1))+y0)/porcentaje;

            x1--;
            y1--;


           if(_this.contenedor.find("#objetivo").length!=0){
               $("#objetivo").remove();
               //clearInterval(_this.idIntervalo);

           }
			_this.contenedor.append("<div id='objetivo'/>");
            $("#objetivo").css({marginLeft:x1+"%",marginTop:y1+"%"});
            
			
            _this.objetivoEncontrado=true;
		}

		this.marcarCentro = function(){
			$(_this.contenedor.find(".cuadro")[parseInt(_this.cantidad/2)]).addClass("persona");

		}

        this.sonar();
	}

function asignarFuncionCierreModal(callback){

    var botonClose = $($("a.close")[0]);
    var nuevoBoton = $("<div id='botonCerrarModal' class='botonCerrarModal'>");
    nuevoBoton.css(botonClose.offset());
    nuevoBoton.css({'background-color':'rgba(0,0,0,0)','position':'absolute','width':'50px','height':'50px'});
    $("#modalHeader").append(nuevoBoton);
    nuevoBoton.click(function(){
        console.log("Cerrando Modal!");
        $("#botonCerrarModal").remove();
        cerrarModal();
        arregloImgResiduales = [];
        callback();
    });


}

function mostrarMascara(mensaje){
    $("body").addClass("bloquear");
    $.ui.showMask(mensaje);
}

function ocultarMascara(){
    $("body").removeClass("bloquear");
    $.ui.hideMask();

}

function ordenarEspecies(especiesPredominante,ultimaVisita){
    diccionarioEspecies ={};
    for (var i = 0; i< ultimaVisita.get("puntos").length; i++ ){
        var plantasPunto = ultimaVisita.get("puntos")[i].get("items").filter(function(item){ return item.name == "Planta" });
        plantasPunto.map(function(planta,indice){
            if(diccionarioEspecies.hasOwnProperty(planta.get("especie").get("nombre")))
                diccionarioEspecies[planta.get("especie").get("nombre")] = diccionarioEspecies[planta.get("especie").get("nombre")] +1;
            else
                diccionarioEspecies[planta.get("especie").get("nombre")] = 1;
        });
    }
    
    arregloObjetos=[];
    var claves =Object.keys(diccionarioEspecies);
    for(var i = 0; i < claves.length;  i++ ){
        arregloObjetos.push({"nombre":claves[i],"valor":diccionarioEspecies[claves[i]]});
    }

    arregloObjetos.sort(function(c,d){ return c.valor < d.valor });
    var cantidad = (3 >= arregloObjetos.length)?arregloObjetos.length:3;
    for(var i=cantidad-1; i>=0 ;i--){
        especies.unshift(especies.splice(especies.indexOf(especies.filter(function(e){return e.get("nombre") == arregloObjetos[i].nombre})[0]),1)[0]);
    }



}

function ordenarEspecies1(especiesPredominante,ultimaVisita){
    diccionarioEspecies ={};
    Y.Planta.obtenerPlantasVisita(ultimaVisita.get("idTransecta"),ultimaVisita.get("fecha"),function(plantas){
        plantas.map(function(planta,indice){
            if(diccionarioEspecies.hasOwnProperty(planta.get("especie")))
                diccionarioEspecies[planta.get("especie")] = diccionarioEspecies[planta.get("especie")] +1;
            else
                diccionarioEspecies[planta.get("especie")] = 1;
        });


        arregloObjetos=[];
        var claves =Object.keys(diccionarioEspecies);
        for(var i = 0; i < claves.length;  i++ ){
            arregloObjetos.push({"nombre":claves[i],"valor":diccionarioEspecies[claves[i]]});
        }

        arregloObjetos.sort(function(c,d){ return c.valor < d.valor });
        var cantidad = (3 >arregloObjetos.length)?arregloObjetos.length:4;
        for(var i=cantidad-1; i>=0 ;i--){
            especies.unshift(especies.splice(especies.indexOf(especies.filter(function(e){return e.get("nombre") == arregloObjetos[i].nombre})[0]),1)[0]);
        }




    });

}



function validar($divPagina){
    var valido = true;
    var inputs = $divPagina.find("input");
    for(var i = 0; i< inputs.length;i++){
        var $input = $(inputs[i]);
        var tipo = $input.attr("type");
        var patron = $input.attr("patron");
        if(tipo !="range" && patron != null ){
            valido = validarCampo($input) && valido;
        }
    }
    return valido;

}




function validarCampo($campo){
    var valor = $campo.val();
    var patron = $campo.attr("patron");
    var reg = new RegExp(patron,"i");


    if(valor.match(reg)==null){
        //mensajeError($campo.attr("mensaje"));
        $campo.addClass("errorValidacion");

        if ($("#"+$campo.attr("name")+"error").length == 0 && ($campo.attr("mensaje") != ""))
            $campo.parent()[0].insertBefore($("<p id='"+$campo.attr("name")+"error' class='mensajeError'>"+ $campo.attr("mensaje") +"</p>").get(0),$campo.get(0));

        return false;
    }
    $campo.removeClass("errorValidacion");
    $("#"+$campo.attr("name")+"error").remove();
    return true;
}



function verificarVisitas(){
    var q = "select * from Visita ORDER BY fecha DESC LIMIT 1;";
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    var q1 = "select count(*) as contador from Punto where idTransecta="+data.rows.item(i).idTransecta+" AND fecha="+data.rows.item(i).fecha+";";
                    var transectaAActivar = data.rows.item(i).idTransecta;
                    var fechaAActivar = data.rows.item(i).fecha;
                    db.transaction(function (t) {
                        t.executeSql(q1, null, function (t, data) {
                            console.log("cantidad Puntos ultima Visita:"+data.rows.item(0).contador);
                            if(data.rows.item(0).contador < CANTIDAD_PUNTOS){
                                mensajeConfirmacion("Reanudar Visita","Hay una Visita pendiente, desea continuarla?",
                                    function(){console.log("reanudo");
                                               $.mvc.route("aplicacion/activarTransecta/"+transectaAActivar+"/1");
                                    },function(){
                                        console.log("cancelo");
                                        mostrarMascara("Eliminando visita, por favor espere");
                                        Y.Visita.obtenerVisitaTransecta(transectaAActivar,fechaAActivar,function(visita){
                                            visita.borrar();
                                            mensajeExitoso("Visita Borrada");
                                            ocultarMascara();
                                        });
                                    });
                            }else{
                                buscarRedConIP(configuracion.servidor,function(infoServidor){
                                    mensajeConfirmacion("Sincronización","Se encontró activo el servidor: '"+infoServidor.nombrePC+"'. Desea acceder a la pantalla de sincronización?",function(){
                                        $.mvc.route("/aplicacion/sincronizacion");
                                        var $servidor = $('<li class="widget servidor"><a class="anchorServidor"><i class="fa fa-cloud"></i>'+infoServidor.nombrePC+'<div><a class="botonActivar" href="/aplicacion/sincronizar/'+infoServidor.ip+'/'+encodeURI(infoServidor.nombrePC)+'/'+infoServidor.infoAdicional.especies+'/'+infoServidor.infoAdicional.familias+'"><i class="fa fa-retweet logoSincronizar" ></i></a></div> </a></li>');
                                        $("#dispositivos").removeClass("oculto");
                                        $("#noServidores").addClass("oculto");
                                        $("#dispositivos").append($servidor);
                                    },function(){

                                    })
                                });
                                
                            }
                        });
                    });
                };
            });
        });
}

function visualizarAdjunto(indiceVisita,indiceAdjunto){
    indiceVisita = parseInt(indiceVisita);
    indiceAdjunto = parseInt(indiceAdjunto);
    var adjunto = transectaActiva.get("visitas")[indiceVisita].get("items")[indiceAdjunto];
    $("#mainVerAdjunto").empty();
    $("#mainVerAdjunto").append(adjunto.mostrar());
    mostrarModal("#verAdjunto","fade","Adjunto #"+(indiceAdjunto+1),function(){});
};

function visualizarPunto(indiceVisita,indicePunto){
    indiceVisita = parseInt(indiceVisita);
    indicePunto = parseInt(indicePunto);
    var punto = transectaActiva.get("visitas")[indiceVisita].get("puntos")[indicePunto];
    //var adjuntos = transectaActiva.get("visitas")[indiceVisita].get("puntos")[indicePunto].get("items");
    $("#mainVerPunto").empty();
    var $divPunto = $('<div class="infoPunto"/>');
    $divPunto.append("<p><b> Estado aguja: </b>"+punto.get("estado")+"</p>");
    $divPunto.append("<p><b> Suelo: </b>"+punto.get("suelo")+"</p>");
    $("#mainVerPunto").append($divPunto);
    mostrarMascara("Cargando Items");
    punto.obtenerItems(transectaActiva.get("visitas")[indiceVisita],function(adjuntos){
        setTimeout(function(){
            for(var i = 0 ; i<adjuntos.length; i++){
                $("#mainVerPunto").append(adjuntos[i].mostrar());
            }
            ocultarMascara();
        },1000);
    });


    mostrarModal("#verPunto","fade","Punto #"+(indicePunto+1),function(){});

};


function cerrarModal(){
    $("#flechaSeguimiento").removeClass("esconder");
    $.ui.hideModal();
}


function comprobandoHardware(){
    var $mascaraPopUp = $('<div id="mascaraPopUpComprobacion" class="mascaraPopUp"></div>');
    $("body").append($mascaraPopUp);
    var $divPopUp = $('<div class="popUp"/>');
    $mascaraPopUp.append($divPopUp);
    $divPopUp.append('<div class="cabeceraPopUp"><i class="fa fa-cog fa-spin"></i>  Comprobando Hardware</div>');
    var $cuerpoPopUp = $('<div class="cuerpoPopUp"><div>Espere por favor:</div></div>');
    $cuerpoPopUp.append('<br>');
    $cuerpoPopUp.append('<div>Comprobando Brujula...<img id="comprobandoBrujula" class="imagenComprobando" src="img/comprobando.gif" /></div>');
    $cuerpoPopUp.append('<div id="mensajeErrorBrujula" class="errorComprobacion oculto">ERROR!: Este dispositivo no posee sensor GeoMagnético.</div>');
    $cuerpoPopUp.append('<br>');
    $cuerpoPopUp.append('<div>Comprobando GPS...<img id="comprobandoGPS" class="imagenComprobando" src="img/comprobando.gif" /></div>');
    $cuerpoPopUp.append('<div id="mensajeErrorGPS" class="errorComprobacion oculto">ERROR!: Este dispositivo no posee GPS o está desactivado.</div>');
    $cuerpoPopUp.append('<br>');
    $cuerpoPopUp.append('<div id="mensajeErrorGeneral" class="errorComprobacion errorGeneral oculto">Fallo la Comprobación: Habilite los sensores y reinicie la App.</div>');

    $divPopUp.append($cuerpoPopUp);

    contadorHardware = 0;

    navigator.geolocation.getCurrentPosition(function(e){
        console.log(e);
        $("#comprobandoGPS").attr("src","img/ok.png");
        contadorHardware++;
    },function(e){
        console.log(e);
        if(e.code == 2){
            $("#comprobandoGPS").attr("src","img/noOk.png");
            $("#mensajeErrorGPS").removeClass("oculto");
            $("#mensajeErrorGeneral").removeClass("oculto");
        }else{
            $("#comprobandoGPS").attr("src","img/ok.png");
            contadorHardware++;
        }
    },{timeout: 15000,enableHighAccuracy: true });

    navigator.compass.getCurrentHeading(function(e){
            console.log(e);
            $("#comprobandoBrujula").attr("src","img/ok.png");
        contadorHardware++;
        },function(e){
            console.log(e);
            $("#comprobandoBrujula").attr("src","img/noOk.png");
            $("#mensajeErrorBrujula").removeClass("oculto");
            $("#mensajeErrorGeneral").removeClass("oculto");
        });

    intervaloComprobacion = setInterval(function(){
        if(contadorHardware == 2){
            clearInterval(intervaloComprobacion);
            $("#mascaraPopUpComprobacion").remove();
            verificarVisitas();
        }
        },2000);
}




function sincronizarElementoSimple(servidor,elemento,tabla,mensaje,callback,callbackVacio) {
   $.ajax({
            type: "GET",
            url: servidor,
            data: {'nombre':elemento,'identidad':'pepe'},
            success: function(dataJson){
                    console.log(dataJson);
                    var q1 = "delete from "+tabla+";";
                    db.transaction(function(t){
                        t.executeSql(q1, [],function (t, data) {
                            elementos = JSON.parse(dataJson);
                            callbackVacio();
                            for(var i =0; i < elementos.length;i++){
                                (function(id,nombre){
                                    console.log(tabla);
                                    console.log(id);
                                    console.log(nombre);
                                    console.log("INSERT INTO "+tabla+"('id_servidor','nombre') values("+id+",'"+nombre+"');");
                                      db.transaction(function(t){
                                            t.executeSql("INSERT INTO "+tabla+"('id_servidor','nombre') values("+id+",'"+nombre+"');", [],
                                            function (t, data) {
                                                //data.insertId
                                                callback({"id":id,"nombre":nombre});
                                            },null);
                                        });
                                }(elementos[i].id,elementos[i].nombre));
                            }
                        },function(){});
                    });
            },
            fail:function(data){
                mensajeError("Error en sincroniazción de '"+mensaje+"'");
            }
        });
    };



function buscarEnRed(red){
    mostrarMascara("Buscando Servidores en red "+red);
    var ipRedBase = "http://192.168.";
    var ipRed = ipRedBase+red+".";
    for (var i=2;i<255;i++){
        $.ajax({
          type: "POST",
          url: ipRed+i+":8000/quienSos/",
          //timeout: 3000,
          data: {'nombre':'pepito'},
          success: function(data){
              var infoServidor = JSON.parse(data);
              if(infoServidor.hasOwnProperty("nombrePC")){
                  var $servidor = $('<li class="widget servidor"><a class="anchorServidor"><i class="fa fa-desktop"></i>'+infoServidor.nombrePC+'<div><a class="botonActivar" href="/aplicacion/sincronizar/'+infoServidor.ip+'/'+encodeURI(infoServidor.nombrePC)+'/'+infoServidor.infoAdicional.especies+'/'+infoServidor.infoAdicional.familias+'"><i class="fa fa-retweet logoSincronizar" ></i></a></div> </a></li>');
                  $("#dispositivos").removeClass("oculto");
                  $("#noServidores").addClass("oculto");
                  $("#dispositivos").append($servidor);
                  ocultarMascara();
    //class="listaDispositivos"
              }
            }
        }).fail(function(){console.log("fallo")});
    }
}



function enviarFoto(servidor,elemento){
            if(elemento.get("foto")=="" || elemento.get("imgSincronizada")==1){
                auditor.actualizarProgreso();
                console.warn("-----------------------------------"+elemento.name+" auditada SIN FOTO");
                return;
            }

            var win = function (r) {
                console.warn("-----------FOTO ENVIADA------------------------");
                console.warn("-----------------------------------");
                console.warn(r);
                console.warn("-----------------------------------");
                
                db.transaction(function(t){
                    t.executeSql("UPDATE "+elemento.name+" SET 'imgSincronizada'= 1 where id="+elemento.get('id')+";", [],
                    function (t, data) {
                        elemento.set("imgSincronizada",1);
                    },null);
                });
                
                auditor.actualizarProgreso();
                console.warn("-----------------------------------"+elemento.name+" auditada");
                console.log("Code = " + r.responseCode);
                console.log("Response = " + r.response);
                console.log("Sent = " + r.bytesSent);
            }

            var fail = function (error) {
                console.log("upload error source " + error.source);
                console.log("upload error target " + error.target);
                //mensajeError("Error subiendo Imagen de elemento "+elemento.name+"!");
                auditor.actualizarProgreso("error","Error imagen "+elemento.name+" #"+elemento.get("id_servidor"));
            }

            var fileURL =  intel.xdk.camera.getPictureURL(elemento.get("foto"));
            var options = new FileUploadOptions();
            options.fileKey = "imagen";
            options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
            options.mimeType = "image/jpg";

            params={'nombre':elemento.name,'identidad':identidad,'id_servidor':elemento.get("id_servidor")};
            options.params = params;

            var ft = new FileTransfer();
            ft.upload(fileURL, encodeURI(servidor), win, fail, options);
//            ft.upload(fileURL, encodeURI("http://192.168.1.68:8000/subirImagen"), win, fail, options);
}




function refrescarGraficoPie(porcentaje,elemento){
    console.log("refrescando");
    $("#"+elemento).empty();
    $("#"+elemento).append(porcentaje+"%");
}




function auditorActualizaciones(cantidadEspecies,cantidadFamilias,equipo){
    this.equipo = equipo;
    this.cantidadEjemplares = 0;
    this.cantidadPlantas = 0;
    this.cantidadVisitas = 0;
    this.progreso = 0;
    this.cantidadEspecies = cantidadEspecies;
    this.cantidadEspeciesAux =cantidadEspecies;
    this.cantidadFamilias = cantidadFamilias;
    this.total = 2;
    var _this = this;
    db.transaction(function (t) {
     //   t.executeSql("select (select COUNT(*) from ejemplar where ejemplar.id_servidor isnull) as cEjemplar,(select COUNT(*) from visita where visita.id_servidor isnull) as cVisita , COUNT(*) as cPlanta from planta as p where p.id_servidor isnull;", null, function (t, data) {
        t.executeSql("select (select COUNT(*) from ejemplar) as cEjemplar,(select COUNT(*) from visita) as cVisita , COUNT(*) as cPlanta from planta", null, function (t, data) {
            console.log("cantidad Planta para enviar: "+data.rows.item(0).cPlanta); 
            _this.cantidadPlantas = data.rows.item(0).cPlanta;
            console.log("cantidad Ejemplar para enviar: "+data.rows.item(0).cEjemplar);
            _this.cantidadEjemplares = data.rows.item(0).cEjemplar;
            console.log("cantidad Visitas para enviar: "+data.rows.item(0).cVisita);
            _this.cantidadVisitas  = data.rows.item(0).cVisita;
            _this.total = parseInt(_this.cantidadEjemplares) +parseInt(_this.cantidadEspecies) + parseInt(_this.cantidadFamilias) + parseInt(_this.cantidadPlantas) + parseInt(_this.cantidadVisitas);
            _this.actualizar();
        });
    });
    
        
    this.actualizarProgreso = function(clase,mensaje){
        var clase = clase || "";
        if (clase == "Especie"){
            if (this.cantidadEspeciesAux >0)
                this.cantidadEspeciesAux --;
            else
                return;
        }
        
        if (clase == "error"){
            $("#log").append('<p>'+mensaje+'</p>');
            $("#log").removeClass("oculto");
            $("#log").get(0).scrollTop=100000000000000;
        }
        
        this.progreso++;
        this.actualizar();
    }
    
    this.actualizar = function(){
        console.log("total: "+this.total);
        if(this.total == 0)
            return;
            var valor = (this.progreso / this.total)*100;
        $("#barraProgreso").css({"width":valor+"%"});
        if(this.total <= this.progreso){
            setTimeout(function(){
                $.mvc.route("aplicacion/init");
                $.mvc.route("aplicacion/");
                //$("#mascaraPopUpSinc").remove();
                $("#log").append('<p><b>Reintente Sincronizar Nuevamente para intentar solventar estos errores.</b></p>');
                $("#log").get(0).scrollTop=100000000000000;
                $("#barraProgreso").empty().append("Sincronización Finalizada");
                $($(".divBotonLog")[0]).removeClass("desenlazar");
                mensajeExitoso("Sincronizacion Finalizada");
                console.log("Sincronizacion Finalizada");
            },10000);
            $("#barraProgreso").append("Aplicando Cambios...");
        }else{
            console.log("progreso "+this.progreso+ " de "+this.total);
        }
    };

    this.inicializar = function(){
        var $mascaraPopUp = $('<div id="mascaraPopUpSinc" class="mascaraPopUp"></div>');
        $("body").append($mascaraPopUp);
        var $divPopUp = $('<div class="popUp"/>');
        $mascaraPopUp.append($divPopUp);
        $divPopUp.append('<div class="cabeceraPopUp"><i class="fa fa-refresh fa-spin"></i>  Sincronizando...</div>');
        var $cuerpoPopUp = $('<div class="cuerpoPopUp"><div>Estableciendo Conección con"'+this.equipo+'" <br> Espere por favor:</div></div>');
        $cuerpoPopUp.append('<br>');
        $cuerpoPopUp.append('<div class="contenedorBarraProgreso"><div id="barraProgreso" class="barraProgreso"/></div>');
        $cuerpoPopUp.append('<div id="log" class="logError oculto"><p><b>Informe de errores:</b></p></div>');
        var $anchor = $('<a name="" class="anchorBoton">Aceptar</a>');
        $anchor.click(function(e){
            $("#mascaraPopUpSinc").remove();
        });
        var $divBoton = $('<div class="divBoton divBotonLog desenlazar" ></div>');
        $divBoton.append($anchor)
        $cuerpoPopUp.append($divBoton);
        $divPopUp.append($cuerpoPopUp);
    };
    
    this.inicializar();
    return this;
    
}

function verificarBateria(){
    window.addEventListener("batterystatus", onBatteryStatus, false);
    window.addEventListener("batterycritical", onBatteryCritical, false);
}

function onBatteryStatus(info) {
    nivelBateria = info.level;
    console.log("Level: " + info.level + " isPlugged: " + info.isPlugged);
    refrescarGraficoPie(info.level,"porcentajeBateria");
}


function onBatteryCritical(info) {
    // Handle the battery critical event
    mensajeAviso("Bateria Baja","Nivel de Bateria Critico. Porfavor conecte la alimentación del dispositivo");
 //   alert("Battery Level Critical " + info.level + "%\nRecharge Soon!");
}

function buscarRedConIP(ipServidorExterno,callbackExito){
     if(ipServidorExterno != ""){
            $.ajax({
              type: "POST",
              url: "http://"+ipServidorExterno+":"+configuracion.puerto+"/quienSos/",
              data: {'nombre':'pepito'},
              success: function(data){
                  var infoServidor = JSON.parse(data);
                  if(infoServidor.hasOwnProperty("nombrePC")){
                      callbackExito(infoServidor);
                  }
                }
            });
    }
}

