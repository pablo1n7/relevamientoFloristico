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
                        //salvar la tabla intermedia

                        for(var i = 0; i < tipos.length; i++){
                            (function(query){
                               db.transaction(function(t){
                                    t.executeSql(query, [],
                                    function (t, data) {},null);
                                });
                            }("INSERT INTO CampaniaTipoEjemplar('nombreCampania','idTipoEjemplar',fecha) values('"+nombre+"',"+tipos[i].get("id")+","+fecha+");"));

                        }
                        callback();
                    },null);
                });
            },

            borrar: function(){
                console.log("pepe");
                this.get("transectas").map(function(transecta){
                    transecta.borrar();
                });
                var _this = this;
                var q = "delete from CampaniaTipoEjemplar where nombreCampania='"+this.get("nombre")+"' and fecha="+this.get("fecha")+" ;";
                    db.transaction(function (t){
                        t.executeSql(q, null, function (t, data) {

                            var q1 = "delete from Campania where nombre='"+_this.get("nombre")+"' and fecha="+_this.get("fecha")+" ;";
                                db.transaction(function (t){
                                    t.executeSql(q1, null, function (t, data) {
                                        console.log("Campania Eliminada");
                                        //mensajeExitoso("Campaña Eliminada.");
                                    });
                            });
                        });
                });

            },

            obtenerTiposAsociados: function(callback){
                var q = "select idTipoEjemplar from CampaniaTipoEjemplar where nombreCampania='"+this.get('nombre')+"' and fecha="+this.get('fecha');
                var _this = this;
                db.transaction(function (t) {
                    t.executeSql(q, null, function (t, data) {
                        for (var i = 0; i < data.rows.length; i++) {
                            var tipoEjemplar = tipoEjemplares.filter(function(elem){return elem.get("id") == data.rows.item(i).idTipoEjemplar})[0];
                            _this.get("tipoEjemplares").push(tipoEjemplar);
                        };
                        callback(_this);
                    });
                });

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
                tipoEjemplares:{
                    value: []
                },
                transectas:{
                    value: []
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
                        campania = new Y.Campania({nombre:data.rows.item(i).nombre,fecha:data.rows.item(i).fecha,descripcion:data.rows.item(i).descripcion});
                        campania.obtenerTiposAsociados(callback);
                        Y.Transecta.obtenerTransectas(data.rows.item(i).nombre,data.rows.item(i).fecha,function(transecta){
                            transecta.set("campania",campania);
                            campania.get("transectas").push(transecta);
                            $("#listaTransectas").append('<li class="widget"><a href="/aplicacion/activarTransecta/'+transecta.get("id")+'">'+transecta.get("ambiente")+'</a></li>');
                        });
                    };
                });
            });

    };

}, '0.0.1', { requires: ['model']});
