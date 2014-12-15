var Y = Y || YUI();
Y.add('valorModelo',function(Y){
    Y.Valor = Y.Base.create('valor', Y.Model, [],{


        asignarValor: function(campo){
            var tipo = this.get("propiedad").get("tipo");
            this.set("valor",tipo.obtenerValor(campo));

        }
    },{

            ATTRS:{
                valor: {
                    value:null
                },
                propiedad:{
                    value: null
                }
            },

        }
    );
}, '0.0.1', { requires: ['model','propiedadModelo']});
