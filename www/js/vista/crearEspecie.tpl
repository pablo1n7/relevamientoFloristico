<input name="nombreEspecie" id="nombreEspecie" type="text" placeholder="Nombre Especie">
<div class="input-group">
    <span>Familia</span>
    <select id="familia">
        {{for(var i=0; i<= it.familias.length-1;i++){ }}
            <option>{{=it.familias[i].get("nombre")}}</option>
        {{ } }}
    </select>
</div>

<div class="input-group">
    <span>Forma Biologico</span>
    <select id="formaBiologica">
        {{for(var i=0; i<= it.formasBiologicas.length-1;i++){ }}
            <option>{{=it.formasBiologicas[i]}}</option>
        {{ } }}
    </select>
</div>
<div class="input-group">
    <span>Tipo Biologico</span>
    <select id="tipoBiologica">
        {{for(var i=0; i<= it.tiposBiologicos.length-1;i++){ }}
            <option>{{=it.tiposBiologicos[i]}}</option>
        {{ } }}
    </select>

</div>
<div class="input-group">
    <span>Estado de Conservación</span>
    <select id="estadoDeConservacion">
        {{for(var i=0; i<= it.estadosDeConservacion.length-1;i++){ }}
            <option>{{=it.estadosDeConservacion[i]}}</option>
        {{ } }}
    </select>

</div>
<div class="input-group">
    <span>Distribución Geografica</span>
    <select id="distribucionGeografica">
        {{for(var i=0; i<= it.distribuciones.length-1;i++){ }}
            <option>{{=it.distribuciones[i]}}</option>
        {{ } }}
    </select>

</div>

<div class="input-group">
    <span>Indice de Calidad</span>
    <input id="indiceDeCalidad" class="slider" onchange="$('#indiceCalidadLabel').text(this.value);" type="range" min="0" max="5" value="0" />
    <span id="indiceCalidadLabel" class="range-value">0</span>
</div>

<div class="divBoton">
    <a name="crearEspecie" class="anchorBoton" href="/aplicacion/crearEspecie">Crear Especie</a>
</div>

