//typeof Y != "undefined" ? Y : Y = YUI();
var Y = Y || YUI();
Y.add('ejemplarModelo',function(Y){
    Y.Ejemplar = Y.Base.create('Ejemplar', Y.Model, [],{

            save:function(visita,idPunto){
                var _this = this;
                var idPunto = idPunto || "NULL";
                var q = "INSERT INTO Ejemplar('idTipoEjemplar','idTransecta','fecha','idPunto','foto') values("+this.get("tipoEjemplar").get("id")+","+visita.get("idTransecta")+","+visita.get("fecha")+","+idPunto+",'"+_this.get("foto")+"');";
                db.transaction(function(t){
                    t.executeSql(q, [],
                    function (t, data) {
                        _this.set('id',data.insertId);
                        _this.get("valores").map(function(valor){
                            valor.save(data.insertId);
                        });
                    },null);
                });
            },

            iconoRepresentacion:function(){
                return "fa-file-text ejemplar"
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
                },
                foto:{
                    value: ""
                }

            }
        }
    );

    Y.Ejemplar.obtenerEjemplaresAsociados = function(idPunto,idTransecta,fecha,callback){
        var q = "";
        if(idPunto == null)
            q = "select * from Ejemplar where idPunto isnull and idTransecta="+idTransecta+" and fecha="+fecha+";";
        else
            q = "select * from Ejemplar where idPunto="+idPunto+" and idTransecta="+idTransecta+" and fecha="+fecha+";";
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                var ejemplares = [];
                for (var i = 0; i < data.rows.length; i++) {
                    var ejemplar = new Y.Ejemplar({"id":data.rows.item(i).id,"tipoEjemplar":data.rows.item(i).idTipoEjemplar,"foto":data.rows.item(i).foto});
                    ejemplares.push(ejemplar);
                };
                callback(ejemplares);
            });
        });
    };
}, '0.0.1', { requires: ['model','propiedadModelo','tipoEjemplarModelo']});
