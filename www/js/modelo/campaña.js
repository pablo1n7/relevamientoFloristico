var Y = Y || YUI();
Y.add('campaniaModelo',function(Y){
    Y.Campania = Y.Base.create('campania', Y.Model, [],{},{
                
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
