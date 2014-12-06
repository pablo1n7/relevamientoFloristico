var Y = Y || YUI();
Y.add('familiaModelo',function(Y){
    Y.Familia = Y.Base.create('familia', Y.Model, [],{},{
                
            ATTRS:{
                nombre: {
                    value: 'nombre'
                },
                especies: {
                    value: []
                }
            },
        
        }
    );
}, '0.0.1', { requires: ['especieModelo']});