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
    $("#tituloSubPagina").empty()
    $("#tituloSubPagina").append(titulo);
    activate_subpage(nombreSubPagina);
    desactivarBotonesHeader();
    if(diccionarioAyuda[nombreSubPagina])
        $($(nombreSubPagina).parent()[0]).bind("doubleTap",function(){activarModoAyuda(nombreSubPagina,diccionarioAyuda[nombreSubPagina])});
}

function mostrarModal(div,efecto,titulo){
    $.ui.showModal(div,efecto);
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
