
<div class="input-group">
    <div name="verFoto" class="widget-container content-area horiz-area wrapping-col left oculto">
        <i class="fa fa-eye iconoVerFoto"></i>
    </div>
    <div class="widget-container content-area horiz-area wrapping-col right">
        <span class="icon close" onclick="$(this.parentElement).parent().remove();"></span>
    </div>
    Planta
    <input name="toquesPlanta" type="number" placeholder="toques">
    <br>
    <br>
    <span>Especie</span>
    <select name="especie">
        {{for(var i=0; i<= it.especies.length-1;i++){ }}
            <option>{{=it.especies[i].get("nombre")}}</option>
        {{ } }}
    </select>
    <div class="divFoto" onclick="
                                  _this=this;
                                  console.log('PASO');
                                  $(this).addClass('desenlazar');
                                  tomarFoto(function(urlImg){
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
                                        verImagen(urlImg,_this);
                                        $(_this).removeClass('desenlazar');
                                    });

                                  });

                                  ">
        <div class="icon camera iconoCamara">

        </div>
    </div>

</div>
