var Y = Y || YUI();
Y.add('transectaModelo',function(Y){
    Y.Transecta = Y.Base.create('transecta', Y.Model, [],{

        save:function(callback,callbackError){
            var _this = this;
            var q = "INSERT INTO Transecta ('nombreCampania','fechaCampania','sentido','ambiente','cuadro','distanciaEntrePuntos') values('"+this.get("campania").get("nombre")+"',"+this.get("campania").get("fecha")+","+this.get("sentido")+",'"+this.get("ambiente")+"','"+this.get("cuadro")+"',"+this.get("distanciaEntrePuntos")+");";
            db.transaction(function(t){
                t.executeSql(q, [],
                function (t, data) {
                    _this.set('id',data.insertId);
                    for(var i=0;i < _this.get("nombreEspecies").length;i++){
                        var q2 = "INSERT INTO TransectaEspecie ('idTransecta','nombreEspecie') values("+_this.get('id')+",'"+_this.get('nombreEspecies')[i]+"');";
                    (function(q){db.transaction(function(t){
                                t.executeSql(q, [],null,null);
                            });
                    })(q2);

                    }
                    callback();
                },function(a){callbackError();console.log(a);});
            });
        },

        borrar:function(){
            var _this = this;
            Y.Visita.obtenerVisitasTransecta(this,function(visitas){
                visitas.map(function(v){

                    Y.Punto.completarPuntos(v.get("puntos"),v,function(){
                        v.borrar();
                    });




                });
                var q = "delete from TransectaEspecie where idTransecta="+_this.get("id")+";";
                    db.transaction(function (t){
                        t.executeSql(q, null, function (t, data) {
                            /*for (var i = 0; i < data.rows.length; i++) {
                                console.log(data.rows.item(i));
                            };*/
                            var q1 = "delete from Transecta where id="+_this.get("id")+";";
                            db.transaction(function (t){
                                t.executeSql(q1, null, function (t, data) {
                                  //  mensajeExitoso("Transecta Eliminada");
                                });
                        });
                        });
                });
            });
        },
        sincronizar:function(servidor,idCampaniaServidor){
                 if(this.get("id_servidor")!=null){
                    var visitas = this.get("visitas");
                    for(var i=0;i < visitas.length;i++){
                        visitas[i].sincronizar(servidor,this.get("id_servidor"));
                    }
                    return;
                }else{
                    var _this = this;
                    datosTransecta={'id':this.get("id"),'sentido':this.get("sentido"),'ambiente':this.get("ambiente"),'cuadro':this.get("cuadro"),'campania':idCampaniaServidor,'distanciaEntrePuntos':this.get("distanciaEntrePuntos")};
                    $.ajax({
                    type: "POST",
                    url: servidor,
                    data: {'nombre':'transecta','identidad':identidad,"datos":JSON.stringify(datosTransecta)},
                    success: function(dataJson){
                            console.log(dataJson);
                            var elementoTransecta = JSON.parse(dataJson);
                            (function(elemento){
                                      db.transaction(function(t){
                                            t.executeSql("UPDATE Transecta SET 'id_servidor'="+elemento.id_servidor+" where id="+elemento.id+";", [],
                                            function (t, data) {
                                                _this.set("id_servidor",elemento.id_servidor);
                                                _this.sincronizar(servidor,idCampaniaServidor);
                                            },null);
                                        });
                                }(elementoTransecta));
                        },
                        fail:function(data){
                            mensajeError("Error en sincroniazción de 'Transecta'");
                        }
                    });


                }
        }
    },{
                
            ATTRS:{
                id:{
                    value: -1
                },
                id_servidor:{
                    value:null
                },
                sentido:{
                    value: 360
                },
                ambiente:{
                    value: "un ambiente"
                },
                cuadro:{
                    value: "un cuadro"
                },
                campania:{
                    value: "un cuadro"
                },
                visitas:{
                    value: []
                },
                nombreEspecies:{
                    value:[]
                },
                distanciaEntrePuntos:{
                    value:3
                }

            },
        
        }
    );

    Y.Transecta.obtenerTransectas = function(nombre,fecha,callback,callbackDeVacio){
        var q = "select * from Transecta where nombreCampania='"+nombre+"' and fechaCampania="+fecha+";"
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    var transecta = new Y.Transecta({"id":data.rows.item(i).id,"id_servidor":data.rows.item(i).id_servidor,"ambiente":data.rows.item(i).ambiente,"sentido":data.rows.item(i).sentido,"cuadro":data.rows.item(i).cuadro, "distanciaEntrePuntos":data.rows.item(i).distanciaEntrePuntos});

                    //(function(t,callback){
                      //  Y.Visita.obtenerVisitasTransecta(t,function(visitas){
                        //    t.set("visitas",visitas);
                          //  callback(t);
                    //    })

                    //}(transecta,callback))

                    callback(transecta);
                };
                if (data.rows.length == 0){
                    callbackDeVacio();
                }
            });
        });

    };

    Y.Transecta.obtenerTransectasCompletas = function(nombre,fecha,callback,callbackDeVacio){
        var q = "select * from Transecta where nombreCampania='"+nombre+"' and fechaCampania="+fecha+";";
        var arregloTransectas = [];
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    var transecta = new Y.Transecta({"id":data.rows.item(i).id,"id_servidor":data.rows.item(i).id_servidor,"ambiente":data.rows.item(i).ambiente,"sentido":data.rows.item(i).sentido,"cuadro":data.rows.item(i).cuadro, "distanciaEntrePuntos":data.rows.item(i).distanciaEntrePuntos});

                    //(function(t,callback){
                    (function(t){
                        Y.Visita.obtenerVisitasTransecta(t,function(visitas){
                            t.set("visitas",visitas);
                            arregloTransectas.push(t);
                            //callback(t);
                        })

                    //}(transecta,callback));
                    }(transecta));

                    //callback();
                };
                
                var controlarTransectas = function(coleccionTransectas,totalTransectas,callback){
                    console.warn("Indiada 3.0!");
                    console.warn("Total: "+totalTransectas);
                    console.warn("Tamaño arreglo: "+coleccionTransectas.length);
                    if(coleccionTransectas.length < totalTransectas){
                        setTimeout(function(){
                            controlarTransectas(coleccionTransectas,totalTransectas,callback);
                        },2000);
                    }else{
                        console.log("Finalizando Indiada 3.0");
                        callback(coleccionTransectas);
                    }
                };
                
                if (data.rows.length == 0){
                    callbackDeVacio();
                }else{
                    controlarTransectas(arregloTransectas,data.rows.length,callback);
                }
            });
        });

    };

    Y.Transecta.obtenerTransecta = function(id,callback){
        var q = "select * from Transecta where id="+id+";";
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    var transecta = new Y.Transecta({"id":data.rows.item(i).id,"id_servidor":data.rows.item(i).id_servidor,"ambiente":data.rows.item(i).ambiente,"sentido":data.rows.item(i).sentido,"cuadro":data.rows.item(i).cuadro,"distanciaEntrePuntos":data.rows.item(i).distanciaEntrePuntos,"nombreCampania":data.rows.item(i).nombreCampania,"fechaCampania":data.rows.item(i).fechaCampania});
                    Y.Visita.obtenerVisitasTransecta(transecta,function(visitas){
                        transecta.set("visitas",visitas);
                        callback(transecta);
                    })
                };
            });
        });

    }


}, '0.0.1', { requires: ['model']});
