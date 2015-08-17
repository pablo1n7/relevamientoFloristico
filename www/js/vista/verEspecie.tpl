<p class="pEspecie"><b>Nombre: </b>{{=it.especie.get("nombre")}}</p>
<p class="pEspecie"><b>Familia: </b>{{=it.especie.get("familia").get("nombre")}}</p>
<p class="pEspecie"><b>Tipo Biológico: </b>{{=it.especie.get("tipoBiologico").nombre}}</p>
<p class="pEspecie"><b>Forma Biológica: </b>{{=it.especie.get("formaBiologica").nombre}}</p>
<p class="pEspecie"><b>Distribución Geográfica: </b>{{=it.especie.get("distribucionGeografica").nombre}}</p>
<p class="pEspecie"><b>Estado de Conservación: </b>{{=it.especie.get("estadoDeConservacion").nombre}}</p>
<p class="pEspecie"><b>Indice de Calidad: </b>{{=it.especie.get("indiceDeCalidad")}}</p>

<p class="pEspecie"><b>Especie Forrajera: </b>
    {{if (it.especie.get("forrajera")==1){ }}

    Si

    {{ } else{}}

    No

    {{ } }}
</p>

<p class="pEspecie"><b>Imagen Representativa de la Especie: </b></p>
<div style='width:100%'>
    <img src='data:image/jpeg;base64,{{=it.especie.verImagen()}}' style='width:100%'/>
</div>
