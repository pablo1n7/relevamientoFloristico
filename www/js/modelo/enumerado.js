var Y = Y || YUI();
Y.add('enumeradoModelo',function(Y){
    Y.Enumerado = Y.Base.create('enumerado', Y.TipoPropiedad, [],{},{
                
            ATTRS:{
                valores: {
                    value:[]
                }
            }
        }
    );
}, '0.0.1', { requires: ['model','tipoPropiedadModelo']});
