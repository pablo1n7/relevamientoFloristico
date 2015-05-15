var Y = Y || YUI();
Y.add('puntoModelo',function(Y){
    Y.Punto = Y.Base.create('punto', Y.Model, [],{

        save:function(visita,callback){
                var _this = this;
                var q = "INSERT INTO Punto('idTransecta','fecha','estadoPunto','tipoSuelo','coordenada') values("+visita.get("idTransecta")+","+visita.get("fecha")+",'"+_this.get("estado")+"','"+_this.get("suelo")+"','"+_this.get("coordenadas")+"');";
                db.transaction(function(t){
                    t.executeSql(q, [],
                        function (t, data) {
                            _this.set('id',data.insertId);
                            _this.get("items").map(function(item){item.save(visita,_this.get("id"))});
                            callback(_this);
                        },null);
                    });


        },

        borrar:function(){
            this.get("items").map(function(item){
                item.borrar();
            });
            var q = "delete from Punto where id = "+this.get("id")+";";
            db.transaction(function(t){
                t.executeSql(q, [],function (t, data) {},function(){
                    console.log("un Punto Eliminado");
                });
            });
        },

        obtenerItems:function(v,callback){
            var _this = this;
            if(this.get("items").length != 0){
                callback(this.get("items"));
                return;
            }
            Y.Planta.obtenerPlantasAsociadas(_this.get("id"),v.get("idTransecta"),v.get("fecha"),function(plantas){
                console.log("Obteniendo plantas");
                //v.get("items").concat(plantas);
                _this.set("items",_this.get("items").concat(plantas))
                Y.Ejemplar.obtenerEjemplaresAsociados(_this.get("id"),v.get("idTransecta"),v.get("fecha"),function(ejemplares){
                    console.log("Obteniendo Ejemplares");
                    //v.get("items").concat(ejemplares);
                    _this.set("items",_this.get("items").concat(ejemplares));
                    callback(_this.get("items"));
                });
            });

        }




    },{
                
            ATTRS:{
                id:{
                    value:-1
                },
                items: {
                    value: []
                },
                suelo: {
                    value: null
                },
                estado:{
                    value: null
                },
                coordenadas:{
                    value: null
                }
            },
        
        }
    );


    Y.Punto.completarPuntos = function(puntos,visita,callback){

        cantidadPuntos = puntos.length;

        for (var i = 0; i<puntos.length;i++){
            (function(punto){
                Y.Planta.obtenerPlantasAsociadas(punto.get("id"),visita.get("idTransecta"),visita.get("fecha"),function(items){
                    punto.set("items",punto.get("items").concat(items));
                    Y.Ejemplar.obtenerEjemplaresAsociados(punto.get("id"),visita.get("idTransecta"),visita.get("fecha"),function(items){
                        punto.set("items",punto.get("items").concat(items));
                        cantidadPuntos--;
                    });
                })
            }(puntos[i]))
        }

        var idIntervaloBorrar = -1;
        idIntervaloBorrar = setInterval(function(){
            console.log("indiada");
            if(cantidadPuntos <= 0){
                console.log("Finalizando indiada");
                clearInterval(idIntervaloBorrar);
                callback(puntos);
            }
        },5000);


    };

    Y.Punto.obtenerPuntosVisita = function(visita,callback){
        var q = "select * from Punto where idTransecta="+visita.get("idTransecta")+" and fecha="+visita.get("fecha")+";";
            db.transaction(function (t) {
                t.executeSql(q, null, function (t, data) {
                    var puntos = [];
                    for (var i = 0; i < data.rows.length; i++) {
                        var punto = new Y.Punto({"id":data.rows.item(i).id,"estado":data.rows.item(i).estadoPunto,"coordenadas":data.rows.item(i).coordenada, "suelo": data.rows.item(i).tipoSuelo });
                        puntos.push(punto);
                    }
                    callback(puntos);
                });
            });
    };
}, '0.0.1', { requires: ['model']});
