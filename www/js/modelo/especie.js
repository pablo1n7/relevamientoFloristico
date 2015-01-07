var Y = Y || YUI();
Y.add('especieModelo',function(Y){
    Y.Especie = Y.Base.create('especie', Y.Model, [],{},{
                
            ATTRS:{
                nombre: {
                    value: 'nombre'
                },
                tipoBiologico: {
                    value: 'unTipo'
                },
                formaBiologica: {
                    value: 'unaForma'
                },
                distribucionGeografica:{
                    value: 'unaDistribucion'
                },
                indiceDeCalidad:{
                    value: -1
                },
                estadoDeConservacion:{
                    value: 'unEstado'
                },
                familia:{
                    value: 'unaFamilia'
                }

            },
        
        }
    );
}, '0.0.1', { requires: ['model','familiaModelo']});
