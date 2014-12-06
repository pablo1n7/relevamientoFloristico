//typeof Y != "undefined" ? Y : Y = YUI();
var Y = Y || YUI();
Y.add('itemModelo',function(Y){
    Y.Item = Y.Base.create('item', Y.Model, [],{},{
            ATTRS:{
                campos:{
                    value: []  
                },
                perfil:{
                    value: null
                }
            }
        }
    );
}, '0.0.1', { requires: ['model','propiedadModelo','perfilModelo']});
