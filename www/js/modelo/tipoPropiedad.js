var Y = Y || YUI();
Y.add('tipoPropiedadModelo',function(Y){
    Y.TipoPropiedad = Y.Base.create('tipoPropiedad', Y.Model, [],{


            obtenerValor: function(campo){
                return $(campo).find("input")[0].value;
            },

            save: function(callback){
                this.savePadre("NULL","NULL",callback);
            },

            delete: function(){

            },

            deletePadre:function(callback){
                var q = "delete from TipoPropiedad where id="+this.get("idPadre");
                db.transaction(function(t){
                    t.executeSql(q, [],function (t, data){
                        callback();
                    });
                },function(a){
                    console.log("Error");
                    console.log(a);
                });
            },

            savePadre:function(idRango,idEnumerado,callback){
                var _this = this;
                if(_this.get("idPadre") == -1 ){
                    db.transaction(function(t){
                        t.executeSql("INSERT INTO TipoPropiedad('nombre','idRango','idEnumerado') values('"+_this.get("nombre")+"',"+idRango+","+idEnumerado+");", [],
                        function (t, data) {
                            _this.set('idPadre',data.insertId);
                            callback();
                            console.log(data);
                        },null);
                    });

                }else{
                    callback();
                };
            }


    },{
        
            ATTRS:{

                idPadre:{
                    value:-1
                },
                nombre: {
                    value: 'nombre tipo'
                }
            }
        
        
        }
    );


    Y.TipoPropiedad.obtenerTipoPropiedad = function(idTipoPropiedad,callback){

        switch(idTipoPropiedad){
            case 1:
                    callback(Y.Alfanumerico.getInstancia());
                    break;
            case 2:
                    callback(Y.Numerico.getInstancia());
                    break;
            default:
                    var q = "select * from TipoPropiedad where id="+idTipoPropiedad;
                    db.transaction(function (t) {
                        t.executeSql(q, null, function (t, data) {
                            for (var i = 0; i < data.rows.length; i++) {
                                if(data.rows.item(i).idRango != "null"){
                                    Y.Rango.obtenerRango(data.rows.item(i).idRango,data.rows.item(i).id,callback);
                                };
                                if(data.rows.item(i).idEnumerado != "null"){
                                    Y.Enumerado.obtenerEnumerado(data.rows.item(i).idEnumerado,data.rows.item(i).id,callback);
                                }

                            }
                        });
                    });
        }


    };

}, '0.0.1', { requires: ['model']});
