var Y = Y || YUI();
Y.add('puntoModelo',function(Y){
    Y.Punto = Y.Base.create('punto', Y.Model, [],{},{
                
            ATTRS:{
                items: {
                    value: []
                },
                suelo: {
                    value: null
                }
            },
        
        }
    );
}, '0.0.1', { requires: ['model']});
