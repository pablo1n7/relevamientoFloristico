<div>

    {{ for(var j=0; j<it.transecta.get('visitas').length;j++){ }}
    <div class="sliderVisita">
        <div class="headerVisita">
            <div id="infoVisita">
                <p>Ambiente de Transecta: {{=it.transecta.get('ambiente')}}</p>
                    Fecha de Visita: {{=new Date(it.transecta.get('visitas')[j].get("fecha")).toLocaleString()}}
            </div>
        </div>



<div style="width:100%;overflow:hidden;">
        <div id="imagenesvisita{{=it.transecta.get('visitas')[j].get('fecha')}}" class="imagenesVisita" style="width:100%">

        {{ if(it.transecta.get('visitas')[j].get('imagenes').length == 0){ }}

            <div style="text-align:center; width:100%; margin: 10px;"> No hay Imagenes asociadas</div>

        {{ } }}

        {{ for(var k=0; k<it.transecta.get('visitas')[j].get('imagenes').length;k++){ }}
            <div onclick="verImagen('{{=intel.xdk.camera.getPictureURL(it.transecta.get('visitas')[j].get('imagenes')[k])}}',null,true);" class="imgRecolectable adjuntos" style="width:{{=(screen.width/4.5)}}px;background-position: 50% 50%;background-size: cover;background-image:url({{=intel.xdk.camera.getPictureURL(it.transecta.get('visitas')[j].get('imagenes')[k])}})"></div>
        {{ } }}


        </div>
</div>



<div style="width:100%;overflow:hidden;">
        <div id="adjuntosAvisita{{=it.transecta.get('visitas')[j].get('fecha')}}" class="imagenesVisita" style="width:100%">
        {{ if(it.transecta.get('visitas')[j].get('items').length == 0){ }}
            <div id="" style="text-align:center; margin: 10px;"> No hay Items asociados</div>

        {{ } }}
            {{ for(var k=0; k<it.transecta.get('visitas')[j].get('items').length;k++){ }}
            <div class="imgRecolectable adjuntos" style="width:{{=(screen.width/4.5)}}px;background-position: 50% 50%;background-size: cover;background-image:url({{=intel.xdk.camera.getPictureURL(it.transecta.get('visitas')[j].get('items')[k].get('foto'))}})">

                <i class="fa {{=it.transecta.get('visitas')[j].get('items')[k].iconoRepresentacion()}}"></i>



            </div>
        {{ } }}

        </div>
</div>


        <div id="visita{{=it.visitas[j].get('fecha')}}"  class="contenedorPuntosVisita">

            <div id="contenedorImagenes0" class="sliderPuntosVisita">

                {{ if(it.transecta.get('visitas')[j].get('puntos').length == 0){ }}

                    <div style="margin:10px;text-align:center; width:100%"> No hay Puntos asociados</div>

                {{ } }}

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
    {{ } }}
</div>
