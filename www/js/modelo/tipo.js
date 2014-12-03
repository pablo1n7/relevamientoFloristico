var Y = Y || YUI();
Y.add('tipoModelo',function(Y){
    Y.Tipo = Y.Base.create('tipo', Y.Model, [],{},{
        
            ATTRS:{
                nombre: {
                    value: 'nombre tipo'
                },
                ejemplo: {
                    value: null
                }
            }
        
        
        }
    );
}, '0.0.1', { requires: ['model']});
