var Y = Y || YUI();
Y.add('puntoModelo',function(Y){
    Y.Punto = Y.Base.create('punto', Y.Model, [],{

        save:function(visita,callback){
                var _this = this;
                var q = "INSERT INTO Punto('idTransecta','fecha','estadoPunto','tipoSuelo','coordenada') values("+visita.get("idTransecta")+","+visita.get("fecha")+",'"+_this.get("estado")+"','"+_this.get("suelo")+"','"+_this.get("coordenada")+"');";
                db.transaction(function(t){
                    t.executeSql(q, [],
                        function (t, data) {
                            _this.set('id',data.insertId);
                            _this.get("items").map(function(item){item.save(visita,_this.get("id"))});
                            callback(_this);
                        },null);
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
                coordenada:{
                    value: null
                }
            },
        
        }
    );

    Y.Punto.obtenerPuntosVisita = function(visita,callback){
        var q = "select * from Punto where idTransecta="+visita.get("idTransecta")+" and fecha="+visita.get("fecha")+";";
            db.transaction(function (t) {
                t.executeSql(q, null, function (t, data) {
                    var puntos = [];
                    for (var i = 0; i < data.rows.length; i++) {
                        var punto = new Y.Punto({"id":data.rows.item(i).id,"estado":data.rows.item(i).estadoPunto});
                        puntos.push(punto);
                    }
                    callback(puntos);
                });
            });
    };
}, '0.0.1', { requires: ['model']});
