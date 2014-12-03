var Y = Y || YUI();
Y.add('rangoModelo',function(Y){
    Y.Rango = Y.Base.create('rango', Y.Tipo, [],{},{
                
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
}, '0.0.1', { requires: ['model','tipoModelo']});
