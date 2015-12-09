<div class="input-group">
    <div name="verFoto" class="widget-container content-area horiz-area wrapping-col left oculto">
        <i class="fa fa-eye iconoVerFoto"></i>
    </div>
    <div class="widget-container content-area horiz-area wrapping-col right">
        <span class="icon close" onclick="eliminarRecolectable(this);"></span>
    </div>
    <div class="headerItem headerElemento">
        Item
    </div>
    Tipo Ejemplar
    <br>
    <select id="selectTipoEjemplares{{=it.numeroId}}" class="seleccionable" name="tipoEjemplares" onchange='$.mvc.route("aplicacion/crearEjemplar/{{=it.numeroId}}");'>
        {{for(var i=0; i<= it.tipoEjemplares.length-1;i++){ }}
                <option>{{=it.tipoEjemplares[i].get("nombre")}}</option>
        {{ } }}
    </select>
    <div id="ejemplar{{=it.numeroId}}"></div>
    <div name="imgUrl" class="oculto"></div>
    <div class="divFoto" onclick="
                                  _this=this;
                                  console.log('PASO');
                                  $(this).addClass('desenlazar');
                                  tomarFoto(function(nombre){
                                var urlImg = intel.xdk.camera.getPictureURL(nombre);
                                  var fotoAnt = $($(_this).parent().find('[name|=imgUrl]')[0]).html();
                                if(fotoAnt != ''){
                                    intel.xdk.camera.deletePicture(fotoAnt);
                                    arregloImgResiduales.splice(arregloImgResiduales.indexOf(fotoAnt),1);
                                }

                                $($(_this).parent().find('[name|=imgUrl]')[0]).empty();
                                $($(_this).parent().find('[name|=imgUrl]')[0]).append(nombre);

                                    console.log(urlImg);
                                    $(_this).css({'background-image':'url('+urlImg+')',
                                        'backgroundSize':'cover',
                                        'background-position':'50%'});
                                    $(_this).parent().css({'background-color':'rgba(255,255,255,0.7)'});
                                    $(_this).parent().parent().css({'background-image':'url('+urlImg+')',
                                        'backgroundSize':'cover',
                                        'background-position':'50%'});
                                    $($(_this).parent().find('[name|=verFoto]')[0]).removeClass('oculto');
                                  $($(_this).parent().find('[name|=verFoto]')[0]).unbind();
                                    $($(_this).parent().find('[name|=verFoto]')[0]).click(function(){
                                        verImagen(urlImg,_this,false,eliminarFoto);
                                        $(_this).removeClass('desenlazar');
                                    });

                                  },function(){

                                        $(_this).removeClass('desenlazar');

                                  });

                                  ">
        <div name="camara" class="icon camera iconoCamara">
</div>

