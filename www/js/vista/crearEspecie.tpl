<div class="input-group">
    <span>Nombre</span>
    <input name="nombreEspecie" id="nombreEspecie" type="text" placeholder="Ej: Chuquiraga avellanedae" patron="^([a-zñáéíóú]+)([a-zñáéíóú.0-9 ]+)$" mensaje="Nota: El nombre debe comenzar con letra y no puede estar vacio">

</div>

<div class="input-group" name="familiaEspecie">
    <span>Familia</span>
    <select id="familia">
        {{for(var i=0; i<= it.familias.length-1;i++){ }}
            <option>{{=it.familias[i].get("nombre")}}</option>
        {{ } }}
    </select>
</div>

<div class="input-group" name="formaBiologica">
    <span>Forma Biologico</span>
    <select id="formaBiologica">
        {{for(var i=0; i<= it.formasBiologicas.length-1;i++){ }}
            <option>{{=it.formasBiologicas[i]}}</option>
        {{ } }}
    </select>
</div>
<div class="input-group" name="tipoBiologico">
    <span>Tipo Biologico</span>
    <select id="tipoBiologica">
        {{for(var i=0; i<= it.tiposBiologicos.length-1;i++){ }}
            <option>{{=it.tiposBiologicos[i]}}</option>
        {{ } }}
    </select>

</div>
<div class="input-group" name="estadoConservacion">
    <span>Estado de Conservación</span>
    <select id="estadoDeConservacion">
        {{for(var i=0; i<= it.estadosDeConservacion.length-1;i++){ }}
            <option>{{=it.estadosDeConservacion[i]}}</option>
        {{ } }}
    </select>

</div>
<div class="input-group" name="distribucionGeografica">
    <span>Distribución Geografica</span>
    <select id="distribucionGeografica">
        {{for(var i=0; i<= it.distribuciones.length-1;i++){ }}
            <option>{{=it.distribuciones[i]}}</option>
        {{ } }}
    </select>

</div>

<div class="input-group" name="indiceCalidad">
    <span>Indice de Calidad</span>
    <input id="indiceDeCalidad" class="slider" onchange="$('#indiceCalidadLabel').text(this.value);" type="range" min="0" max="5" value="0" />
    <span id="indiceCalidadLabel" class="range-value">0</span>
</div>


<div class="input-group" data-ver="1" name="forrajera">
    <span>Forrajera</span>
    <select id="forrajera">
        <option value="1" > Si </option>
        <option value="0"> No </option>
    </select>
</div>


<div class="divBoton">
    <a name="crearEspecie" class="anchorBoton" href="/aplicacion/crearEspecie">Crear Especie</a>
</div>

