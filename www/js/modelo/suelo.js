var Y = Y || YUI();
Y.add('sueloModelo',function(Y){
    Y.Suelo = Y.Base.create('suelo', Y.Model, [],{},{
                
            ATTRS:{
                nombre: {
                    value: 'nombre propiedad'
                },
                descripcion: {
                    value: 1
                }
            },
        
        }
    );
}, '0.0.1', { requires: ['model']});
