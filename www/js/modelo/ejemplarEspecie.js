var Y = Y || YUI();
Y.add('ejemplarEspecieModelo',function(Y){
    Y.EjemplarEspecie = Y.Base.create('ejemplarEspecie', Y.Model, [],{},{
            ATTRS:{
                especie: {
                    value: null
                },

                toques:{
                    value: 0
                },

                altura:{
                    value: 0
                }

                }
        }
    );
}, '0.0.1', { requires: ['model','especieModelo']});
