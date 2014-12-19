//typeof Y != "undefined" ? Y : Y = YUI();
var Y = Y || YUI();
Y.add('ejemplarModelo',function(Y){
    Y.Ejemplar = Y.Base.create('Ejemplar', Y.Model, [],{

            representacion: function(){
                var $div = $('<div/>');
                for(var i = 0 ; i<this.get("valores").length;i++){
                    $div.append(this.get("valores")[i].get("propiedad").representacion());
                }
                return $div;

            },

            completarCampos: function(campos){
                $.each(this.get("valores"),function(indice,valor){
                    valor.asignarValor($(campos[indice]));

                });
            },

            crearCampos: function(campos){

                for(var i=0;i<=campos.length-1;i++){
                    var valor = new Y.Valor({"propiedad":campos[i]});
                    this.get("valores").push(valor);
                };

                /*var pepe = this;
                $.each(campos,function(indice,propiedad){
                    var valor = new Y.Valor({"propiedad":propiedad});
                    pepe.get("valores").push(valor);
                });*/
            }


    },{
            ATTRS:{
                valores:{
                    value: []
                },
                tipoEjemplar:{
                    value: null
                }
            }
        }
    );
}, '0.0.1', { requires: ['model','propiedadModelo','tipoEjemplarModelo']});
