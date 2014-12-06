var Y = Y || YUI();
Y.add('especieModelo',function(Y){
    Y.Especie = Y.Base.create('especie', Y.Model, [],{},{
                
            ATTRS:{
                nombre: {
                    value: 'nombre'
                },
                tipoBilogico: {
                    value: 'unTipo'
                },
                formaBilogica: {
                    value: 'unaForma'
                }
            },
        
        }
    );
}, '0.0.1', { requires: ['model','familiaModelo']});
