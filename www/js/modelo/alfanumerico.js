var Y = Y || YUI();
Y.add('alfanumericoModelo',function(Y){
    Y.Alfanumerico = Y.Base.create('alfanumerico', Y.TipoPropiedad, [],{
            representacion:function(nombre){
                var $div = $("<div/>");
                var $label = $("<label/>");
                $label.append(nombre);
                $div.append($label);
                var $input = $("<input/>");
                $input.attr({'placeholder':'a,b,cd...',"type":"text"});
                $div.append($input);
                return $div;
            }
        },{
            ATTRS:{

            }
        }
    );

    Y.Alfanumerico.instancia = null;
        Y.Alfanumerico.getInstancia = function(){
            if(Y.Alfanumerico.instancia == null)
                Y.Alfanumerico.instancia = new Y.Alfanumerico();
            return Y.Alfanumerico.instancia;
        };

}, '0.0.1', { requires: ['model','tipoPropiedadModelo']});
