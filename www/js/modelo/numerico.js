var Y = Y || YUI();
Y.add('numericoModelo',function(Y){
    Y.Numerico = Y.Base.create('numerico', Y.TipoPropiedad, [],{
            representacion:function(){
                var $input = $("<input/>");
                $input.attr({'placeholder':'0,1,2...',"type":"number"});
                return $input;
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
    
     Y.Numerico.representacionComoCrear = function(){
         return "";
    };

}, '0.0.1', { requires: ['model','tipoPropiedadModelo']});
