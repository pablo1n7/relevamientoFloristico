<div id="datosTransecta">
    <textarea id="ambiente" name="ambiente" rows="3" cols="20" placeholder="Ingrese el Ambiente de la Transcta"></textarea>

{{if(it.especies.length!=0){ }}
<div class="input-group contenedorTipos">
    <p>Seleccione las Especies Predominantes.</p>
    <div id="contenedorEspecies" class="widget-container content-area vertical-col">
        <div class="columnaEspecies">

            {{for(var i=0; i<= it.especies.length-1;i=i+2){ }}
<div class="divSeleccion">
                        <div class="widget uib_w_11 d-margins divCheckboxEspecies" data-ver="1">
                            <input name="tilde" type="checkbox" value="{{=it.especies[i].get('nombre')}}" id="{{=it.especies[i].get('nombre')}}">
                            <label class="content-box" for="{{=it.especies[i].get('nombre')}}"></label>
                            <div>{{=it.especies[i].get("nombre")}}</div>

                        </div>
</div>
            {{ } }}

        </div>
        <div class="columnaEspecies">

            {{for(var i=1; i<= it.especies.length-1;i=i+2){ }}
<div class="divSeleccion">
                        <div class="widget uib_w_11 d-margins divCheckboxEspecies" data-ver="1">
                            <input name="tilde" type="checkbox" value="{{=it.especies[i].get('nombre')}}" id="{{=it.especies[i].get('nombre')}}">
                            <label class="content-box" for="{{=it.especies[i].get('nombre')}}"></label>
                            <div>{{=it.especies[i].get("nombre")}}</div>

                        </div>
            </div>
            {{ } }}
        </div>
    </div>
</div>
{{ }}}


    <input id="cuadro" type="text" placeholder="Ingrese el nombre del Cuadro (opcional)"/>

    <div id="brujulaMovil" class="brujulaMovil" style="width:{{=it.screen.width-(it.screen.width/2.5)}}px;height:{{=it.screen.width-(it.screen.width/2.5)}}px">
        <div id="brujulaFija" class="brujulaFija"></div>
    </div>
    <div style="text-align:center">
        <div><p id="valorSentido">0</p>grados</div>
        <p id="mensajeBrujula">Toque la brujula para fijar el sentido de la transecta.</p></div>
</div>

<div class="divBoton">
    <a name="crearTransecta" class="anchorBoton" href="/aplicacion/crearTransecta">Crear Transecta</a>
</div>
