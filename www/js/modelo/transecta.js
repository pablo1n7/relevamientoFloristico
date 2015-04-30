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
                    db.transaction(function(t){
                                t.executeSql(q2, [],null,null);
                            });
                    }
                    callback();
                },function(a){callbackError();console.log(a);});
            });
        }


    },{
                
            ATTRS:{
                id:{
                    value: -1
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

    Y.Transecta.obtenerTransectas = function(nombre,fecha,callback){
        var q = "select * from Transecta where nombreCampania='"+nombre+"' and fechaCampania="+fecha+";"
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    callback(new Y.Transecta({"id":data.rows.item(i).id,"ambiente":data.rows.item(i).ambiente,"sentido":data.rows.item(i).sentido,"cuadro":data.rows.item(i).cuadro, "distanciaEntrePuntos":data.rows.item(i).distanciaEntrePuntos}));
                };
            });
        });

    };

    Y.Transecta.obtenerTransecta = function(id,callback){
        var q = "select * from Transecta where id="+id+";";
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    var transecta = new Y.Transecta({"id":data.rows.item(i).id,"ambiente":data.rows.item(i).ambiente,"sentido":data.rows.item(i).sentido,"cuadro":data.rows.item(i).cuadro,"distanciaEntrePuntos":data.rows.item(i).distanciaEntrePuntos,"nombreCampania":data.rows.item(i).nombreCampania,"fechaCampania":data.rows.item(i).fechaCampania});
                    Y.Visita.obtenerVisitasTransecta(transecta,function(visitas){
                        transecta.set("visitas",visitas);
                        callback(transecta);
                    })
                };
            });
        });

    }


}, '0.0.1', { requires: ['model']});
