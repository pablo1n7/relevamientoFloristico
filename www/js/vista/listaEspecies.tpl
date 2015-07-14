{{if(it.especies.length!=1){ }}
<div class="widget-container content-area vertical-col">
    <ul name="listaEspecies" class="list widget uib_w_10 d-margins">
    {{for(var i=0; i<= it.especies.length-1;i++){
        if(it.especies[i].get('id') !=1){
    }}

            <li class="widget"><a href='/aplicacion/verEspecie/{{=encodeURIComponent(it.especies[i].get("nombre"))}}'>{{=it.especies[i].get("nombre")}}</li></a>

    {{ } } }}
    </ul><span class="uib_shim"></span>
</div>

{{ }
    else{ }}
    No se encuentran Especies creadas.
{{ } }}
