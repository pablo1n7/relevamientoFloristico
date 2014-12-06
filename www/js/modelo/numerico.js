var Y = Y || YUI();
Y.add('numericoModelo',function(Y){
    Y.Numerico = Y.Base.create('numerico', Y.TipoPropiedad, [],{
            representacion:function(nombre){
                var $div = $("<div/>");
                var $label = $("<label/>");
                $label.append(nombre);
                $div.append($label);
                var $input = $("<input/>");
                $input.attr({'placeholder':'0,1,2...',"type":"number"});
                $div.append($input);
                return $div;
            }
        },{
            ATTRS:{
            },
        }
    );
    
    Y.Numerico.instancia = null;
        Y.Numerico.getInstancia = function(){
            if(Y.Numerico.instancia == null)
                Y.Numerico.instancia = new Y.Numerico();
            return Y.Numerico.instancia;
        };
    
}, '0.0.1', { requires: ['model','tipoPropiedadModelo']});
