<div id="datosTransecta">




    <div class="input-group" name="ambiente">
        <span>Ambiente</span>
        <input id="ambiente" type="text" placeholder="Ej: Estepa arbustiva" patron="^([a-zñáéíóú]+)([a-zñáéíóú0-9 ]+)$" mensaje="Nota: El ambiente debe comenzar con letra y no puede estar vacio"/>
    </div>

    <div class="input-group" name="cuadro">
        <span>Cuadro</span>
        <input id="cuadro" type="text" placeholder="Ej: el salado (opcional)"/>
    </div>

    <div class="input-group" name="distanciaEntrePuntos">
        <span> Distancia Entre Puntos (Mts)</span>
        <br>
        <input id="distanciaEntrePuntos" class="slider" onchange="$('#distanciaEntrePuntosLabel').text(this.value);" type="range" min="1" max="10" value="3">
        <span id="distanciaEntrePuntosLabel" class="range-value">3</span>
    </div>




    <div id="brujulaMovil" class="brujulaMovil" style="width:{{=it.screen.width-(it.screen.width/2.5)}}px;height:{{=it.screen.width-(it.screen.width/2.5)}}px">
        <div id="brujulaFija" name="brujula" class="brujulaFija"></div>
    </div>
    <div style="text-align:center">
        <div><p id="valorSentido">0</p>grados</div>
        <p id="mensajeBrujula">Toque la brujula para fijar el sentido de la transecta.</p></div>
</div>


<div class="input-group" name="especiesPredominantes">
    <div class="headerElemento headerPlanta">
        Especies Predominantes
    </div>
    <input type="text" id="especiePredominante1" placeholder="Ej: atriplex lampa (opcional)"/>
    <input type="text" id="especiePredominante2" placeholder="Ej: distichlis (opcional)"/>
    <input type="text" id="especiePredominante3" placeholder="Ej: gamochaeta (opcional)"/>
</div>


<div class="divBoton">
    <a name="crearTransecta" class="anchorBoton" href="/aplicacion/crearTransecta">Crear Transecta</a>
</div>
