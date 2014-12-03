var Y = Y || YUI();
Y.add('transectaModelo',function(Y){
    Y.Transecta = Y.Base.create('transecta', Y.Model, [],{},{
                
            ATTRS:{            
                sentido:{
                    value: 320
                },
                visitas:{
                    value: []
                }
            },
        
        }
    );
}, '0.0.1', { requires: ['model']});
