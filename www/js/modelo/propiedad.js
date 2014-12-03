var Y = Y || YUI();
Y.add('propiedadModelo',function(Y){
    Y.Propiedad = Y.Base.create('propiedad', Y.Model, [],{},{
                
            ATTRS:{
                nombre: {
                    value: 'nombre propiedad'
                },
                descripcion: {
                    value: 1
                },
                valor: {
                    value:null
                },
                tipo:{
                    value: null
                }
            },
        
        }
    );
}, '0.0.1', { requires: ['model','tipoModelo']});
