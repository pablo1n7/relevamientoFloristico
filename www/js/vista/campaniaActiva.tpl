<div class="divBoton">
    <a name="empezarVisita" class="anchorBoton" href="/aplicacion/creacionTransecta">Empezar Transecta</a>
</div>

{{if(it.campania.get("tipoEjemplares").length!=0){ }}
<div class="input-group contenedorTipos">
    Toque para ver Tipos Asociados
    <div id="contenedorTipos" class="widget-container content-area vertical-col">
            <ul class="list widget uib_w_10 d-margins">
            {{for(var i=0; i<= it.campania.get("tipoEjemplares").length-1;i++){ }}
                    <li class="widget"><a>{{=it.campania.get("tipoEjemplares")[i].get("nombre")}}</a></li>
            {{ } }}
            </ul><span class="uib_shim"></span>
    </div>
</div>
{{ }}}
