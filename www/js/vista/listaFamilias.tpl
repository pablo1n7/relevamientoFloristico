{{if(it.familias.length!=0){ }}
<div class="widget-container content-area vertical-col">
    <ul name="listaFamilias" class="list widget uib_w_10 d-margins">
    {{for(var i=0; i<= it.familias.length-1;i++){ }}

            <li class="widget"><a>{{=it.familias[i].get("nombre")}}</li></a>

    {{ } }}
    </ul><span class="uib_shim"></span>
</div>

{{ }
    else{ }}
    No se encuentran Familias Biologicas creadas.
{{ } }}
