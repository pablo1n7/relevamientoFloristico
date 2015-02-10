<input name="toquesPlanta" id="toquesPlanta" type="number" placeholder="toques">
<input name="alturaPlanta" id="alturaPlanta" type="number" placeholder="altura">
<div class="input-group">
    <span>Especie</span>
    <select id="especie">
        {{for(var i=0; i<= it.especies.length-1;i++){ }}
            <option>{{=it.especies[i].get("nombre")}}</option>
        {{ } }}
    </select>
</div>


<div class="divBoton">
    <a name="crearPlanta" class="anchorBoton" href="/aplicacion/crearPlanta">Cargar Planta</a>
</div>
