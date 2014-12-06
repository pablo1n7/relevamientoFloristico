{{

agregarPropiedad=function(){
    var $div = $('<div/>');
    $div.attr({"class":"input-group"});
    $div.append('<input name="nombre" type="text" placeholder="nombre Propiedad"/>');
    var list = $("<select/>");

    $.each(it.tipos, function(indice, tipo){ 
        list.append(new Option(tipo,indice));
    });
    $div.append(list);
    $div.append('<button onclick="remover(this);">-</button>');
    $("#campos").append($div);
};

remover = function(elem){
    $(elem).parent().remove();
};

}}

<div id="perfil">
<label>Nombre Perfil</label> <input id="nombrePerfil" type="text"/>
    <button onclick="agregarPropiedad()">+</button>
</div>
<div id="campos"></div>
<a href="/aplicacion/crearPerfil">Crear Perfil</a>