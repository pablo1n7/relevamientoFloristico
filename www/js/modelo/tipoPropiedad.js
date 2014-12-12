var Y = Y || YUI();
Y.add('tipoPropiedadModelo',function(Y){
    Y.TipoPropiedad = Y.Base.create('tipoPropiedad', Y.Model, [],{


            obtenerValor: function(campo){
                return campo.find("input")[0].value;
            }

    },{
        
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
