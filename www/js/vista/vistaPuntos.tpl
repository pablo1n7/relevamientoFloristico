<div>

    {{ for(var j=0; j<it.transecta.get('visitas').length;j++){ }}
    <div class="sliderVisita">
        <div class="headerVisita">
            <div id="infoVisita">
                <p>Ambiente de Transecta: {{=it.transecta.get('ambiente')}}</p>
                    Fecha de Visita: {{=new Date(it.transecta.get('visitas')[j].get("fecha")).toLocaleString()}}
            </div>
        </div>
        <div id="imagenesVisita" class="imagenesVisita">
        {{ for(var k=0; k<it.transecta.get('visitas')[j].get('imagenes').length;k++){ }}
            <div onclick="verImagen('{{=intel.xdk.camera.getPictureURL(it.transecta.get('visitas')[j].get('imagenes')[k])}}',null,true);" class="imgRecolectable" style="background-position: 50% 50%;background-size: cover;background-image:url({{=intel.xdk.camera.getPictureURL(it.transecta.get('visitas')[j].get('imagenes')[k])}})"></div>
        {{ } }}
        </div>

        <div id="adjuntosAVisita" class="imagenesVisita">
            <div class="imgRecolectable">ADJ de Visita 1</div>
            <div class="imgRecolectable">ADJ de Visita 2</div>
            <div class="imgRecolectable">ADJ de Visita 3</div>
            <div class="imgRecolectable">ADJ de Visita 4</div>
            <div class="imgRecolectable">ADJ de Visita 5</div>
        </div>


        <div id="visita{{=it.visitas[j].get('fecha')}}"  class="contenedorPuntosVisita">
            <div  class="pr1">
                <div id="contenedorImagenes0" class="sliderPuntosVisita">
                {{
                var arreglo = {" Suelo Desnudo ":"contenedorSueloDesnudo"," Muerto en Pie ":"contenedorMuertoEnPie"," Toque Directo ":"contenedorToqueDirecto"};
                    var contador= 0;
                    for(var i = 0; i<it.transecta.get('visitas')[j].get('puntos').length; i++){ }}
                    {{if( contador == 9){ contador=0;}}
                        </div>
                        <div class="sliderPuntosVisita" id="contenedorImagenes{{=i}}">
                    {{ } contador++; }}


                    <div class="imgRecolectable {{=arreglo[it.transecta.get('visitas')[j].get('puntos')[i].get('estado')] }}">
                        <div class="listonImagen">{{=i+1}}</div>
                    </div>
                {{ } }}
                </div>

            </div>
        </div>
    </div>
    {{ } }}
</div>
