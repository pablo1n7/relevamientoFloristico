 <div class="grid grid-pad urow uib_row_15 row-height-15" data-uib="layout/row" data-ver="0">
    <div class="col uib_col_15 col-0_12-12" data-uib="layout/col" data-ver="0">
        <div class="widget-container content-area vertical-col">
            <span class="uib_shim"></span>

            Estado de la aguja: {{=it.estadoPunto}}
            <br><br>
            <div class="input-group">
                Suelo
                <select name="tipoSuelo">
                    {{for(var i = 0; i<it.suelos.length; i++){ }}
                        <option> {{=it.suelos[i]}} </option>
                    {{ } }}
                </select>
            </div>

            Recolección
            <br><br>
            <div id="datosPlantas">


            </div>

            {{if(it.opcion == 0){ }}

        <a id="botonAgregarPlanta" name="agregarPropiedad" class="icon add botonTipo2" href="/aplicacion/cargarFormularioPlanta/1" >Añadir Planta</a>
        <br>
        <a id="botonAgregarItem" name="agregarPropiedadExistente" href="/aplicacion/cargarFormularioItem/1" class="icon add botonTipo2" >Añadir Item</a>

        <div class="divBoton">
            <a name="crearPunto" class="anchorBoton" href="/aplicacion/crearPunto">Almacenar Punto</a>
        </div>



            {{ } }}
        </div>
    </div>
    <span class="uib_shim"></span>
</div>
