var Y = Y || YUI();
Y.add('tipoPropiedadModelo',function(Y){
    Y.TipoPropiedad = Y.Base.create('tipoPropiedad', Y.Model, [],{},{
        
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
