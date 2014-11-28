//typeof Y != "undefined" ? Y : Y = YUI();
var Y = Y || YUI();
Y.add('itemModelo',function(Y){
    Y.Item = Y.Base.create('item', Y.Model, [],{},{
            ATTRS:{
                nombre: {
                    value: 'UnNombre'
                },
                descripcion: {
                    value: 'UnaDescripción'
                }            }
        }
    );
}, '0.0.1', { requires: ['model']});
