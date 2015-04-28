<div id="datosTransecta">
    <input id="ambiente" name="ambiente" type="text" placeholder="Ingrese el Ambiente de la Transcta" patron="^([a-zñáéíóú]+)([a-zñáéíóú0-9 ]+)$" mensaje="Nota: El ambiente debe comenzar con letra y no puede estar vacio"/>


    <input id="cuadro" type="text" placeholder="Ingrese el nombre del Cuadro (opcional)"/>

    <div class="input-group">
        <span> Distancia Entre Puntos (Mts)</span>
        <br>
        <input id="distanciaEntrePuntos" class="slider" onchange="$('#distanciaEntrePuntosLabel').text(this.value);" type="range" min="1" max="3" value="3">
        <span id="distanciaEntrePuntosLabel" class="range-value">3</span>
    </div>




    <div id="brujulaMovil" class="brujulaMovil" style="width:{{=it.screen.width-(it.screen.width/2.5)}}px;height:{{=it.screen.width-(it.screen.width/2.5)}}px">
        <div id="brujulaFija" class="brujulaFija"></div>
    </div>
    <div style="text-align:center">
        <div><p id="valorSentido">0</p>grados</div>
        <p id="mensajeBrujula">Toque la brujula para fijar el sentido de la transecta.</p></div>
</div>


<div class="input-group">
    <div class="headerElemento headerPlanta">
        Especies Predominantes
    </div>
    <input type="text" id="especiePredominante1" placeholder="Nombre Especie"/>
    <input type="text" id="especiePredominante2" placeholder="Nombre Especie"/>
    <input type="text" id="especiePredominante3" placeholder="Nombre Especie"/>
</div>


<div class="divBoton">
    <a name="crearTransecta" class="anchorBoton" href="/aplicacion/crearTransecta">Crear Transecta</a>
</div>
