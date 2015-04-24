var Y = Y || YUI();
Y.add('numericoModelo',function(Y){
    Y.Numerico = Y.Base.create('numerico', Y.TipoPropiedad, [],{
            representacion:function(){
                var $input = $("<input/>");
                $input.attr({'value':'0','placeholder':'0,1,2...',"type":"number","patron": "^(-?[0-9]+)$", "mensaje":"" });
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
                Y.Numerico.instancia = new Y.Numerico({'idPadre':2});
            return Y.Numerico.instancia;
        };
    
     Y.Numerico.representacionComoCrear = function(){
         return "";
    };

}, '0.0.1', { requires: ['model','tipoPropiedadModelo']});
