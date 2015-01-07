{{if(it.especies.length!=0){ }}
<div class="widget-container content-area vertical-col">
    <ul name="listaEspecies" class="list widget uib_w_10 d-margins">
    {{for(var i=0; i<= it.especies.length-1;i++){ }}

            <li class="widget"><a>{{=it.especies[i].get("nombre")}}</li></a>

    {{ } }}
    </ul><span class="uib_shim"></span>
</div>

{{ }
    else{ }}
    No se encuentran Especies creadas.
{{ } }}
