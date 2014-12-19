<div class="input-group">
<label for="tipoEjemplares">Perfil</label>
<select id="selectTipoEjemplares" name="tipoEjemplares" onchange='$.mvc.route("aplicacion/crearEjemplar");'>
    {{for(var i=0; i<= it.tipoEjemplares.length-1;i++){ }}
            <option>{{=it.tipoEjemplares[i].get("nombre")}}</option>
    {{ } }}
</select>
</div>
<div id="ejemplar"></div>
<div class="divBoton">
    <a href="/aplicacion/cargarEjemplar" class="anchorBoton"> Guardar </a>
</div>
