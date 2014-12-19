{{

cargarModoCreacion = function(e){
    var tipos = e.target;
    var tipoSeleccionado = Object.keys(it.tipos)[tipos.selectedIndex];
    var $div = $(tipos.parentElement).find('[name|=divTipo]');
    $div.empty();
    $div.append(it.tipos[tipoSeleccionado].call());
};

agregarPropiedad=function(){
    var $div = $('<div/>');
    $div.attr({"class":"input-group"});
    $div.append('<div style="text-align: right;"><span class="icon close" onclick="remover(this.parentElement);"></span></div>');
    $div.append('<input name="nombre" type="text" placeholder="nombre Propiedad"/>');
    $div.append('<textarea name="descripcion" rows="3" cols="20" placeholder="Ingrese una Descripción (opcional)"></textarea>');
    var $list = $("<select name='tipoPropiedad' />");

    $.each(Object.keys(it.tipos), function(indice, tipo){
        $list.append(new Option(tipo,indice));
    });
    $list.change(cargarModoCreacion);
    $div.append($list);
    $div.append($('<div name="divTipo"/>'));
    $("#campos").append($div);


};

remover = function(elem){
    $(elem).parent().remove();
};

}}

<div id="perfil">
<input id="nombrePerfil" type="text" placeHolder="Nombre Perfil"/>
<textarea id ="descripcionPerfil" rows="3" cols="20" placeholder="Ingrese una Descripción"></textarea>
    <br>
    <div id="campos"></div>
    <br>


        <span class="icon add" onclick="agregarPropiedad()">Añadir Propiedad</span>
        <br>
        <span class="icon add" onclick="$.mvc.route('/aplicacion/seleccionarPropiedad')">Añadir Existente</span>

</div>
<div class="divBoton" >
    <a class="anchorBoton" href="/aplicacion/crearPerfil">Crear Perfil</a>
    <a class="anchorBoton" href="/aplicacion/seleccionarItem">Crear Item</a>
</div>
