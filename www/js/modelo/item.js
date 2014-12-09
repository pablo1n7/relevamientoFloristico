//typeof Y != "undefined" ? Y : Y = YUI();
var Y = Y || YUI();
Y.add('itemModelo',function(Y){
    Y.Item = Y.Base.create('item', Y.Model, [],{

            representacion: function(){
                var $div = $('<div/>');
                $div.attr({"class":"input-group"});
                for(var i = 0 ; i<this.get("campos").length;i++){
                    $div.append(this.get("campos")[i].representacion());
                }
                return $div;

            }


    },{
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
