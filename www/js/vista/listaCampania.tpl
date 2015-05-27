{{if(it.campanias.length!=0){ }}
<div class="widget-container content-area vertical-col">
    <ul name="listaCampañas" class="list widget uib_w_10 d-margins">
    {{for(var i=0; i<= it.campanias.length-1;i++){ }}

            <li id="{{=encodeURIComponent(it.campanias[i].nombre)}}/{{=it.campanias[i].fecha}}" class="widget" onclick="toogleOpciones(this)"><a class="nombreCampania">{{=it.campanias[i].nombre}}</a> <div class="contenedorOpciones">  <a class="icon check botonActivar" href="/aplicacion/activarCampania/{{=encodeURIComponent(it.campanias[i].nombre)}}/{{=it.campanias[i].fecha}}"></a>
        <a class="icon close botonEliminar" href="/aplicacion/borrarCampania/{{=encodeURIComponent(it.campanias[i].nombre)}}/{{=it.campanias[i].fecha}}"></a></div></li>

    {{ } }}
    </ul><span class="uib_shim"></span>
</div>

{{ }
    else{ }}
    No se encuentran Campañas creadas.
{{ } }}
