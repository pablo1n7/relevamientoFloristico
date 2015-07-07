var Y = Y || YUI();
Y.add('visitaModelo',function(Y){
    Y.Visita = Y.Base.create('visita', Y.Model, [],{

        save:function(idTransecta){
            var _this = this;
            var q = "INSERT INTO Visita ('idTransecta','fecha') values("+idTransecta+","+_this.get("fecha")+");";
            db.transaction(function(t){
                t.executeSql(q, [],function(){
                    _this.set("idTransecta",idTransecta)
                },null);
            });
        },


        borrar:function(){
            var _this = this;
            var q = "select * from VisitaFoto where idTransecta = "+this.get("idTransecta")+" and fecha= "+this.get("fecha")+" ;";
            db.transaction(function (t) {
                t.executeSql(q, null, function (t, data) {
                    for (var i = 0; i < data.rows.length; i++) {
                        //console.log(data.rows.item(i));
                        intel.xdk.camera.deletePicture(data.rows.item(i).nombreFoto);

                    };

                    var q = "delete from VisitaFoto where idTransecta = "+_this.get("idTransecta")+" and fecha= "+_this.get("fecha")+" ;";
                    db.transaction(function (t) {
                        t.executeSql(q, null, function (t, data) {
                            for (var i = 0; i < data.rows.length; i++) {
                                console.log(data.rows.item(i));
                            };
                        });
                    });

                });
            });

            this.get("items").map(function(item){
                item.borrar();
            });

            this.get("puntos").map(function(punto){
                punto.borrar();
            });
            var q1 = "delete from Visita where idTransecta = "+this.get("idTransecta")+" and fecha= "+this.get("fecha")+";";
            db.transaction(function(t){
                t.executeSql(q1, [],function (t, data) {
                    console.log("una Visita Eliminada");
                },function(){});
            });

        },



        asociarImagen:function(nombre){
            this.get("imagenes").push(nombre);
            var q = "INSERT INTO VisitaFoto ('idTransecta','fecha','nombreFoto') values("+this.get("idTransecta")+","+this.get("fecha")+",'"+nombre+"');";
            db.transaction(function(t){
                t.executeSql(q, [],function (t, data) {},function(){});
            });
        },

        desasociarImagen:function(nombre){
            this.set("imagenes",this.get("imagenes").filter(function(elemento){return elemento != nombre}));

        },
        enviarImagenes:function(){

        },

        almacenarPunto:function(punto){
            this.get("puntos").push(punto);
             punto.save(this,function(unPunto){console.log("GuARDO PUNTO");});
            /*if(this.get("puntos").length == CANTIDAD_PUNTOS){
                this.save(transectaActiva.get("id"));
            }*/

        },
        almacenarItem:function(item){
            this.get("items").push(item);
            item.save(this);
        },
        sincronizar:function(servidor,idTransectaServidor){
                if(this.get("id_servidor")!=null){
                    /*var visitas = this.get("visitas");
                    for(var i=0;i < visitas.length;i++){
                        visitas[i].sincronizar(servidor,this.get("id_servidor"));
                    }*/
                    return;
                }else{
                    var _this = this;
                    datosVisita={'transecta':idTransectaServidor,'fecha':this.get("fecha")};
                    $.ajax({
                    type: "POST",
                    url: servidor,
                    data: {'nombre':'visita','identidad':identidad,"datos":JSON.stringify(datosVisita)},
                    success: function(dataJson){
                            console.log(dataJson);
                            var elementoVisita = JSON.parse(dataJson);
                            (function(elemento){
                                      db.transaction(function(t){
                                            t.executeSql("UPDATE Visita SET 'id_servidor'="+elemento.id_servidor+" where idTransecta="+_this.get('idTransecta')+" and fecha="+_this.get('fecha')+";", [],
                                            function (t, data) {
                                                _this.set("id_servidor",elemento.id_servidor);
                                                _this.sincronizar(servidor,idTransectaServidor);
                                            },null);
                                        });
                                }(elementoVisita));
                        },
                        fail:function(data){
                            mensajeError("Error en sincroniazción de 'Transecta'");
                        }
                    });


                }
        }

    },{
                
            ATTRS:{
                idTransecta:{
                    value: -1
                },
                id_transecta:{
                    value:null
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
                },
                id_servidor:{
                    value: null
                }
            },
        
        }
    );



    Y.Visita.obtenerVisitaTransecta = function(idTransecta,fecha,callback){

        var visita = new Y.Visita({"idTransecta":idTransecta,"fecha":fecha});
        //items y plantas.
        (function(v){
            Y.Planta.obtenerPlantasAsociadas(null,v.get("idTransecta"),v.get("fecha"),function(plantas){
                console.log("Obteniendo plantas");
                //v.get("items").concat(plantas);
                v.set("items",v.get("items").concat(plantas));
                (function(v){Y.Punto.obtenerPuntosVisita(visita,function(puntos){
                        console.log("Obteniendo Puntos, Items y todo eso");
                        v.set("puntos",puntos);
                        (function(v){Y.Ejemplar.obtenerEjemplaresAsociados(null,v.get("idTransecta"),v.get("fecha"),function(ejemplares){
                            console.log("Obteniendo Ejemplares");
                            //v.get("items").concat(ejemplares);
                            v.set("items",v.get("items").concat(ejemplares))

                            Y.Punto.completarPuntos(v.get("puntos"),v,function(puntos){
                                callback(v);
                            });




                        });
                        }(v));
                    });
                }(v));
            });
        }(visita));

    };



    Y.Visita.obtenerVisitasTransecta = function(transecta,callback){
         var q = "select * from Visita where idTransecta="+transecta.get("id")+";";
         var contadorVisitas = 0;
            db.transaction(function (t) {
                t.executeSql(q, null, function (t, data) {
                    var visitas = [];
                    if(data.rows.length == 0){
                        callback(visitas);
                        return;
                    }
                    contadorVisitas = data.rows.length;
                    for (var i = 0; i < data.rows.length; i++) {
                        var visita = new Y.Visita({"idTransecta":transecta.get("id"),"fecha":data.rows.item(i).fecha});
                        //items y plantas.
                        (function(v){
                            Y.Planta.obtenerPlantasAsociadas(null,v.get("idTransecta"),v.get("fecha"),function(plantas){
                                console.log("Obteniendo plantas");
                                //v.get("items").concat(plantas);
                                v.set("items",v.get("items").concat(plantas))
                            });
                        }(visita));
                        (function(v){Y.Ejemplar.obtenerEjemplaresAsociados(null,v.get("idTransecta"),v.get("fecha"),function(ejemplares){
                            console.log("Obteniendo Ejemplares");
                            //v.get("items").concat(ejemplares);
                            v.set("items",v.get("items").concat(ejemplares))
                        });
                        }(visita));
                        (function(v){Y.Punto.obtenerPuntosVisita(visita,function(puntos){
                            console.log("Obteniendo Puntos, Items y todo eso");
                            v.set("puntos",puntos);
/*                            if(data.rows.item(0).fecha == v.get("fecha"))
                                callback(visitas);*/

                            contadorVisitas--;

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

                    idIntervaloVisitas = setInterval(function(){
                        console.log("empezando indiada 2 (visitas)");
                        if(contadorVisitas == 0){
                            console.log("terminadndo Indiada 2 (visitas)");
                            clearInterval(idIntervaloVisitas);
                            callback(visitas);

                        }
                    },5000);

                });
            });
    }


}, '0.0.1', { requires: ['model']});
