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

        },
        sincronizar:function(servidor,idVisitaServidor){
            if(this.get("id_servidor") != null){
                //sincronizar ITEMS y todo lo demas
                var items = this.get("items");
                var idPuntoServidor =this.get("id_servidor");
                items.map(function(item){
                    item.sincronizar(servidor,idVisitaServidor,idPuntoServidor);
                });
                return;
            }

            var _this = this;
            var suelo = this.get("suelo");
            var estado = this.get("estado");
            var coordenadas = this.get("coordenadas");
            var datosPunto = {'visita':idVisitaServidor,'suelo':suelo,'coordenadas':coordenadas,"estado":estado};
            $.ajax({
            type: "POST",
            url: servidor,
            data: {'nombre':'punto','identidad':identidad,"datos":JSON.stringify(datosPunto)},
            success: function(dataJson){
                    console.log(dataJson);
                    var elementoPunto = JSON.parse(dataJson);
                    (function(elemento){
                              db.transaction(function(t){
                                    t.executeSql("UPDATE Punto SET 'id_servidor'="+elemento.id_servidor+" where id="+_this.get('id')+";", [],
                                    function (t, data) {
                                        _this.set("id_servidor",elemento.id_servidor);
                                        _this.sincronizar(servidor,idVisitaServidor);
                                    },null);
                                });
                        }(elementoPunto));
                },
                fail:function(data){
                    mensajeError("Error en sincroniazción de 'Punto'");
                }
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
                },
                id_servidor:{
                    value:null
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
                        var punto = new Y.Punto({"id":data.rows.item(i).id,"id_servidor":data.rows.item(i).id_servidor,"estado":data.rows.item(i).estadoPunto,"coordenadas":data.rows.item(i).coordenada, "suelo": data.rows.item(i).tipoSuelo });
                        puntos.push(punto);
                    }
                    callback(puntos);
                });
            });
    };
}, '0.0.1', { requires: ['model']});
