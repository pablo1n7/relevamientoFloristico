var Y = Y || YUI();
Y.add('perfilModelo',function(Y){
    Y.Perfil = Y.Base.create('perfil', Y.Model, [],{
        agregarPropiedad:function(propiedad){
            this.get('campos').push(propiedad);
        }
    },{
            ATTRS:{
                nombre:{
                    value: "por defecto"
                },
                descripcion:{
                    value: "una Descripcion"
                },
                campos:{
                    value: []  
                }
            }
        }
    );
}, '0.0.1', { requires: ['model','propiedadModelo']});