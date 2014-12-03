var Y = Y || YUI();
Y.add('enumeradoModelo',function(Y){
    Y.Enumerado = Y.Base.create('enumerado', Y.Tipo, [],{},{
                
            ATTRS:{
                valores: {
                    value:[]
                }
            }
        }
    );
}, '0.0.1', { requires: ['model','tipoModelo']});
