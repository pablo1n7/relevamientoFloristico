var Y = Y || YUI();
Y.add('alfanumericoModelo',function(Y){
    Y.Alfanumerico = Y.Base.create('alfanumerico', Y.TipoPropiedad, [],{
            representacion:function(){
                var $input = $("<input/>");
                $input.attr({'placeholder':'a,b,cd...',"type":"text"});
                return $input;
            },
            normalizar:function(){
                var tipo = {idPadre:this.get("idPadre"),id:this.get("idPadre"),tipo:"alfanumerico"};
                return tipo;
            }



        },{
            ATTRS:{

            }
        }
    );

    Y.Alfanumerico.instancia = null;

    Y.Alfanumerico.getInstancia = function(){
        if(Y.Alfanumerico.instancia == null)
            Y.Alfanumerico.instancia = new Y.Alfanumerico({'idPadre':1});
        return Y.Alfanumerico.instancia;
    };

    Y.Alfanumerico.representacionComoCrear = function(){
        return "";
    };



}, '0.0.1', { requires: ['model','tipoPropiedadModelo']});
