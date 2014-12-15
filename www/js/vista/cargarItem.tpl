<div class="input-group">
<label for="perfiles">Perfil</label>
<select id="perfiles" name="perfiles" onchange='$.mvc.route("aplicacion/crearItem");'>
    {{for(var i=0; i<= it.perfiles.length-1;i++){ }}
            <option>{{=it.perfiles[i].get("nombre")}}</option>
    {{ } }}
</select>
</div>
<div id="item"></div>
<div class="divBoton">
    <a href="/aplicacion/cargarItem" class="anchorBoton"> Guardar </a>
</div>
