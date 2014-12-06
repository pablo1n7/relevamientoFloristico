var Y = Y || YUI();
Y.add('plantaModelo',function(Y){
    Y.Planta = Y.Base.create('planta', Y.Item, [],{},{
            ATTRS:{
                especie: {
                    value: null
                }
            
                }
        }
    );
}, '0.0.1', { requires: ['model','itemModelo','especieModelo']});
