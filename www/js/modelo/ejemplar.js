//typeof Y != "undefined" ? Y : Y = YUI();
var Y = Y || YUI();
Y.add('ejemplarModelo',function(Y){
    Y.Ejemplar = Y.Base.create('Ejemplar', Y.Model, [],{

            save:function(callback){
                var _this = this;
                var q = "INSERT INTO Ejemplar('idTipoEjemplar') values("+this.get("tipoEjemplar").get("id")+");";
                db.transaction(function(t){
                    t.executeSql(q, [],
                    function (t, data) {
                        _this.set('id',data.insertId);
                        _this.get("valores").map(function(valor){
                            valor.save(data.insertId);
                        });
                        callback();
                    },null);
                });
            },

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
