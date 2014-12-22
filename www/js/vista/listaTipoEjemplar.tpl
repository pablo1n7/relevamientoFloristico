<div class="widget-container content-area vertical-col">
    <ul class="list widget uib_w_10 d-margins">
    {{for(var i=0; i<= it.tipoEjemplares.length-1;i++){ }}

            <li class="widget"><a class="" href="/aplicacion/verTipoEjemplar/{{=it.tipoEjemplares[i].get('id')}}">{{=it.tipoEjemplares[i].get("nombre")}}</li></a>

    {{ } }}
    </ul><span class="uib_shim"></span>
</div>

