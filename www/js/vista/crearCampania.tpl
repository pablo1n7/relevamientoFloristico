<input name="nombreCampaña" id="nombreCampaña" type="text" placeholder="Nombre de la Campaña" patron="^([a-zñáéíóú]+)([a-zñáéíóú0-9 ]+)$" mensaje="Nota: El nombre debe comenzar con letra y no puede estar vacio">
<input name="descripcionCampaña" id ="descripcionCampaña" type="text" placeholder="Ingrese una Descripción"/>






{{ if(it.tipoEjemplares.length != 1){ }}

<div id="contenedorListaTipos" class="input-group contenedorListaTipos">
    Tipos de ejemplares
    {{for(var i=1; i<= it.tipoEjemplares.length-1;i++){ }}
<div class="divSeleccion">
<div class="widget uib_w_11 d-margins divCheckbox" data-ver="1">
    <input name="tilde" type="checkbox" value="{{=it.tipoEjemplares[i].get('id')}}" id="{{=it.tipoEjemplares[i].get('id')}}">
    <label class="content-box" for="{{=it.tipoEjemplares[i].get('id')}}"> </label>

</div>
    <div class="input-group">
    {{=it.tipoEjemplares[i].get('nombre')}}
        </div>
</div>
    {{ } }}

</div>

{{ } }}

<div class="divBoton">
    <a name="crearCampaña" class="anchorBoton" href="/aplicacion/crearCampania">Crear Campaña</a>
</div>



