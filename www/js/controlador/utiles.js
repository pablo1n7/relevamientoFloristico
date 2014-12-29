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
    $("#tituloSubPagina").empty()
    $("#tituloSubPagina").append(titulo);
    activate_subpage(nombreSubPagina);
    desactivarBotonesHeader();
}

function mostrarModal(div,efecto,titulo){
    $.ui.showModal(div,efecto);
    $("#modalHeader h1 ").append(titulo);

}

function activarModoAyuda(contexto,diccionario){
    $("body").append('<div id="divAyuda" class="divAyuda"/>');
    $("#divAyuda").bind("doubleTap",function(){
        $("#divAyuda").remove();
    });

    $.each(Object.keys(diccionario),function(indice,elemento){
        var elementos = $(contexto).find("[name|="+elemento+"]");
        var posicion = $(elementos[0]).offset();
        var $ayudaElemento = $("<div class='icon question'> </div>");
        $ayudaElemento.css(posicion);
        $ayudaElemento.css({"position":"absolute", "color":"rgba(82,155,234,255)"});
        $ayudaElemento.click(function(){ console.log(diccionario[elemento])});
        $("#divAyuda").append($ayudaElemento);
    });

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
