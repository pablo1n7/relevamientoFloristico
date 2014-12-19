<div class="widget-container content-area vertical-col">
    {{for(var i=0; i<= it.perfiles.length-1;i++){ }}
        <ul class="list widget uib_w_10 d-margins">
            <li class="widget">{{=it.perfiles[i].get("nombre")}}</li>
        </ul><span class="uib_shim"></span>
    {{ } }}
</div>

