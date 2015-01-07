<input name="nombreEspecie" id="nombreEspecie" type="text" placeholder="Nombre Especie">
<div class="input-group">
    <span>Forma Biologico</span>
    <select id="formaBiologica">
        <option>Arbusto</option>
        <option>Hierba</option>
        <option>Graminea</option>
    </select>
</div>
<div class="input-group">
    <span>Tipo Biologico</span>
    <select id="tipoBiologica">
        <option>Eudicotiledónea</option>
        <option>Monocotiledónea</option>
    </select>

</div>
<div class="input-group">
    <span>Estado de Conservación</span>
    <select id="estadoDeConservacion">
        <option>Protegida</option>
        <option>Vulnerable</option>
        <option>Amenazada</option>
        <option>En Peligro</option>
    </select>

</div>
<div class="input-group">
    <span>Distribución Geografica</span>
    <select id="distribucionGeografica">
        <option>Exotica</option>
        <option>Nativa</option>
        <option>Endemica</option>
    </select>

</div>

<div class="input-group">
    <span>Indice de Calidad</span>
    <input id="rango1" class="slider" onchange="$('#label1').text(this.value);" type="range" min="0" max="5" value="0" />
    <span id="label1" class="range-value">0</span>
</div>

<div class="divBoton">
    <a name="crearEspecie" class="anchorBoton" href="/aplicacion/crearEspecie">Crear Especie</a>
</div>

