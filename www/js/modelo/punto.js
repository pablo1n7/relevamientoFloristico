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
                        var punto = new Y.Punto({"id":data.rows.item(i).id,"estado":data.rows.item(i).estadoPunto,"coordenadas":data.rows.item(i).coordenada});
                        puntos.push(punto);
                    }
                    callback(puntos);
                });
            });
    };
}, '0.0.1', { requires: ['model']});
