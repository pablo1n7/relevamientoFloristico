var Y = Y || YUI();
Y.add('campañaModelo',function(Y){
    Y.Campaña = Y.Base.create('campaña', Y.Model, [],{},{
                
            ATTRS:{
                fecha: {
                    value: '15/02/2015'
                },
                descripcion: {
                    value: 'Descripcion'
                },
                transectas:{
                    value: null
                }
            },
        
        }
    );
}, '0.0.1', { requires: ['model']});
