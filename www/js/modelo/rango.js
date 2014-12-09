var Y = Y || YUI();
Y.add('rangoModelo',function(Y){
    Y.Rango = Y.Base.create('rango', Y.TipoPropiedad, [],{

            representacion:function(){
                var $inputRango = $('<input class="slider inputRango" type="range" min="'+this.get("valorMin")+'" max="'+this.get("valorMax")+'" value="'+this.get("valorMin")+'">');
                return $inputRango;
            }


    },{
            ATTRS:{
                valorMax: {
                    value: 1
                },
                valorMin: {
                    value: 0
                }
            }
        }
    );

     Y.Rango.representacionComoCrear = function(){
        var $div = $("<div/>");
        var $inputMax = $('<input type="number" name="valorMax" placeholder="Valor Maximo" />');
        var $inputMin = $('<input type="number" name="valorMin" placeholder="Valor Minimo" />');
        $div.append($inputMin);
        $div.append($inputMax);
        return $div;
    };

}, '0.0.1', { requires: ['model','tipoPropiedadModelo']});
