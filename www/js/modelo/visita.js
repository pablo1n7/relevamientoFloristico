var Y = Y || YUI();
Y.add('visitaModelo',function(Y){
    Y.Visita = Y.Base.create('visita', Y.Model, [],{

        save:function(idTransecta){
            _this = this;
            var q = "INSERT INTO Visita ('idTransecta','fecha') values("+idTransecta+","+this.get("fecha")+");";
            db.transaction(function(t){
                t.executeSql(q, [],function(){
                    _this.set("idTransecta",idTransecta)
                    _this.get("puntos").map(function(punto){
                        punto.save(_this,function(unPunto){
                            console.log("GuARDO PUNTO");
                        });

                    });
                    _this.get("items").map(function(item){
                        item.save(_this);
                    });

                    _this.get("imagenes").map(function(nombre){
                        var q = "INSERT INTO VisitaFoto ('idTransecta','fecha','nombreFoto') values("+idTransecta+","+_this.get("fecha")+",'"+nombre+"');";
                        db.transaction(function(t){
                            t.executeSql(q, [],
                            function (t, data) {
                            },function(){});
                    });




                    });
                },null);
            });
        },

        asociarImagen:function(nombre){
            this.get("imagenes").push(nombre);
        },

        desasociarImagen:function(nombre){
            this.set("imagenes",this.get("imagenes").filter(function(elemento){return elemento != nombre}));

        },

        almacenarPunto:function(punto){
            this.get("puntos").push(punto);
            if(this.get("puntos").length == CANTIDAD_PUNTOS+1){
                this.save(transectaActiva.get("id"));
            }

        }

    },{
                
            ATTRS:{
                idTransecta:{
                    value: -1
                },
                fecha: {
                    value: '15/02/2015'
                },
                puntos: {
                    value:[]
                },
                items:{
                    value:[]
                },
                imagenes:{
                    value:[]
                }
            },
        
        }
    );


    Y.Visita.obtenerVisitasTransecta = function(transecta,callback){
         var q = "select * from Visita where idTransecta="+transecta.get("id")+";";
            db.transaction(function (t) {
                t.executeSql(q, null, function (t, data) {
                    var visitas = [];
                    for (var i = 0; i < data.rows.length; i++) {
                        var visita = new Y.Visita({"idTransecta":transecta.get("id"),"fecha":data.rows.item(i).fecha});
                        //items y plantas.
                        (function(v){Y.Punto.obtenerPuntosVisita(visita,function(puntos){
                            console.log("Obteniendo Puntos, Items y todo eso");
                            v.set("puntos",puntos);
                        });
                        }(visita));

                        (function(v){
                               var q = "select * from VisitaFoto where idTransecta="+v.get("idTransecta")+" and fecha="+v.get("fecha")+";";
                                db.transaction(function (t) {
                                    t.executeSql(q, null, function (t, data) {
                                        var imagenes =[];
                                        for (var i = 0; i < data.rows.length; i++) {
                                            imagenes.push(data.rows.item(i).nombreFoto);
                                        };
                                        v.set("imagenes",imagenes);
                                    });
                                });
                        }(visita));

                        visitas.push(visita);
                    };
                    callback(visitas);
                });
            });
    }


}, '0.0.1', { requires: ['model']});
