
<div class="input-group">
    <div name="verFoto" class="widget-container content-area horiz-area wrapping-col left oculto">
        <i class="fa fa-eye iconoVerFoto"></i>
    </div>
    <div class="widget-container content-area horiz-area wrapping-col right">
        <span class="icon close" onclick="eliminarRecolectable(this);"></span>
    </div>
    <div class="headerElemento headerPlanta">
        Planta
    </div>
    Toques
    <input name="toquesPlanta" type="number" placeholder="toques">
    <br>
    <br>
    <span>Especie</span>

        <input name="especie" id="autocompletado{{=it.numeroId}}" type="text" placeholder="Especie">


<div class="icon picture verFotoEspecie" onclick="verImagenEspecie(this.previousSibling)"></div>
    <div name="imgUrl" class="oculto"></div>
    <div class="divFoto" onclick="
                                  _this=this;
                                  console.log('PASO');
                                  $(this).addClass('desenlazar');
                                  tomarFoto(function(nombre){
                                  console.log(nombre);
                                    var urlImg = intel.xdk.camera.getPictureURL(nombre);
                                    console.log(urlImg);
                                  var fotoAnt = $($(_this).parent().find('[name|=imgUrl]')[0]).html();


                                $($(_this).parent().find('[name|=imgUrl]')[0]).empty();
                                $($(_this).parent().find('[name|=imgUrl]')[0]).append(nombre);
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
                                        verImagen(urlImg,_this);

                                    });
                                    $(_this).removeClass('desenlazar');
                                    if(fotoAnt != '')
                                        intel.xdk.camera.deletePicture(fotoAnt);
                                    });

                                  ">
        <div class="icon camera iconoCamara">

        </div>
    </div>

</div>
