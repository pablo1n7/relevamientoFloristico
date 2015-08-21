var Y = Y || YUI();
Y.add('campaniaModelo',function(Y){
    Y.Campania = Y.Base.create('campania', Y.Model, [],{

            save:function(callback){
                var q = "INSERT INTO Campania('nombre','descripcion','fecha') values('"+this.get("nombre")+"','"+this.get("descripcion")+"',"+this.get("fecha")+");";
                var tipos = this.get("tipoEjemplares");
                var nombre= this.get("nombre");
                var fecha = this.get("fecha");
                db.transaction(function(t){
                    t.executeSql(q, [],
                    function (t, data) {
                        callback();
                    },null);
                });
            },

            borrar: function(){
                this.get("transectas").map(function(transecta){
                    transecta.borrar();
                });
                var _this = this;
                var q1 = "delete from Campania where nombre='"+_this.get("nombre")+"' and fecha="+_this.get("fecha")+" ;";
                    db.transaction(function (t){
                        t.executeSql(q1, null, function (t, data) {
                            console.log("Campania Eliminada");
                            //mensajeExitoso("Campaña Eliminada.");
                        });
                });
                

            },

            sincronizar:function(servidor){

                if(this.get("id_servidor")!=null){
                    var transectas = this.get("transectas");
                    for(var i=0;i < transectas.length;i++){
                        transectas[i].sincronizar(servidor,this.get("id_servidor"));
                    }
                    return;
                }else{
                    var _this=this;
                    /*var tiposEjemplar = this.get("tipoEjemplares");
                    for(var i=0; i< tiposEjemplar.length;i++){
                        if(tiposEjemplar[i].get("id_servidor")==null)
                            return tiposEjemplar[i].sincronizar(servidor,function(servidor){_this.sincronizar(servidor);});
                    }
                    var idtiposEjemplar = tiposEjemplar.map(function(tipoEjemplar){return tipoEjemplar.get("id_servidor")});*/

//                    datosCampania={'nombre':this.get("nombre"),'descripcion':this.get("descripcion"),'fecha':this.get("fecha"),'tiposEjemplaresAsociados':idtiposEjemplar};
                    datosCampania={'nombre':this.get("nombre"),'descripcion':this.get("descripcion"),'fecha':this.get("fecha")};

                    $.ajax({
                    type: "POST",
                    url: servidor,
                    data: {'nombre':'campania','identidad':identidad,"datos":JSON.stringify(datosCampania)},
                    success: function(dataJson){
                            console.log(dataJson);
                            var elementoCampania = JSON.parse(dataJson);
                            (function(elemento){
                                      db.transaction(function(t){
                                            t.executeSql("UPDATE Campania SET 'id_servidor'="+elemento.id_servidor+" where nombre='"+elemento.nombre+"' and fecha="+elemento.fecha+";", [],
                                            function (t, data) {
                                                _this.set("id_servidor",elemento.id_servidor);
                                                _this.sincronizar(servidor);
                                            },null);
                                        });
                                }(elementoCampania));
                        },
                        fail:function(data){
                            mensajeError("Error en sincroniazción de 'Campaña'");
                        }
                    });


                }
        }







    },{

            ATTRS:{
                nombre:{
                    value: 'unNombre'
                },
                fecha: {
                    value: '15/02/2015'
                },
                descripcion: {
                    value: 'Descripcion'
                },
                transectas:{
                    value: []
                },
                id_servidor:{
                    value: null
                }
            },

        }
    );

     Y.Campania.obtenerCampanias = function(callback){
         var q = "select * from Campania";
            db.transaction(function (t) {
                t.executeSql(q, null, function (t, data) {
                    for (var i = 0; i < data.rows.length; i++) {
                        callback({nombre:data.rows.item(i).nombre,fecha:data.rows.item(i).fecha});
                    };
                });
            });

    };

    Y.Campania.obtenerCampania = function(nombre,fecha,callback){
         var q = "select * from Campania where nombre='"+nombre+"' and fecha="+fecha;
            db.transaction(function (t) {
                t.executeSql(q, null, function (t, data) {
                    for (var i = 0; i < data.rows.length; i++) {
                        var campania = new Y.Campania({nombre:data.rows.item(i).nombre,
                                                   id_servidor:data.rows.item(i).id_servidor,
                                                   fecha:data.rows.item(i).fecha,
                                                   descripcion:data.rows.item(i).descripcion});
                        Y.Transecta.obtenerTransectas(data.rows.item(i).nombre,data.rows.item(i).fecha,
                                                      function(transectas){
                            transectas.map(function(t){t.set("campania",campania);});
                            campania.set("transectas",transectas);
                            callback(campania);
                            //transecta.set("campania",campania);
                            //campania.get("transectas").push(transecta);
                           // $("#listaTransectas").append('<li class="widget"><a href="/aplicacion/activarTransecta/'+transecta.get("id")+'">'+transecta.get("ambiente")+'</a></li>');
                           
                        },function(){
                           callback(campania);
                        });
                    
                        

                    };
                });
            });

    };

    Y.Campania.obtenerCampaniaCompleta = function(nombre,fecha,callback){
         var q = "select * from Campania where nombre='"+nombre+"' and fecha="+fecha;
            db.transaction(function (t) {
                t.executeSql(q, null, function (t, data) {
                    for (var i = 0; i < data.rows.length; i++) {
                        var campania = new Y.Campania({nombre:data.rows.item(i).nombre,
                                                   id_servidor:data.rows.item(i).id_servidor,
                                                   fecha:data.rows.item(i).fecha,
                                                   descripcion:data.rows.item(i).descripcion});
                        
                        Y.Transecta.obtenerTransectasCompletas(data.rows.item(i).nombre,data.rows.item(i).fecha,
                                                      function(transectas){
                                                            transectas.map(function(t){t.set("campania",campania);});
                                                            campania.set("transectas",transectas);
                                                            callback(campania);},
                                                               
                                                       function(){
                            callback(campania);
                        });
                    };
                });
            });

    };


     Y.Campania.obtenerCampaniaPorTransecta = function(idTransecta,callback){
        var q = "select * from Transecta where id="+idTransecta+";";
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    Y.Campania.obtenerCampania(data.rows.item(i).nombreCampania,data.rows.item(i).fechaCampania,callback);
                    /*var transecta = new Y.Transecta({"id":data.rows.item(i).id,"id_servidor":data.rows.item(i).id_servidor,"ambiente":data.rows.item(i).ambiente,"sentido":data.rows.item(i).sentido,"cuadro":data.rows.item(i).cuadro,"distanciaEntrePuntos":data.rows.item(i).distanciaEntrePuntos,"nombreCampania":data.rows.item(i).nombreCampania,"fechaCampania":data.rows.item(i).fechaCampania});
                    Y.Visita.obtenerVisitasTransecta(transecta,function(visitas){
                        transecta.set("visitas",visitas);
                        callback(transecta);
                    })*/
                };
            });
        });
     };




}, '0.0.1', { requires: ['model']});
