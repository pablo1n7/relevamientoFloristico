var Y = Y || YUI();
Y.add('enumeradoModelo',function(Y){
    Y.Enumerado = Y.Base.create('enumerado', Y.TipoPropiedad, [],{
            representacion:function(){
                var $list = $("<select/>");
                $.each(this.get("valores"), function(indice, tipo){
                    $list.append(new Option(tipo,indice));
                });
                return $list;
            }
    },{
                
            ATTRS:{
                valores: {
                    value:[]
                }
            }
        }
    );

    Y.Enumerado.representacionComoCrear = function(){
        $div = $("<div/>");
        $input = $('<input type="text" name="valores" placeholder="Rojo,Verde,Amarillo"/>');
        $label = $("<label>Conjunto</label>");
        $div.append($label);
        $div.append($input);
        return $div;
    };


}, '0.0.1', { requires: ['model','tipoPropiedadModelo']});
