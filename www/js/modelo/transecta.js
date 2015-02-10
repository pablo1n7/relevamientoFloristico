var Y = Y || YUI();
Y.add('transectaModelo',function(Y){
    Y.Transecta = Y.Base.create('transecta', Y.Model, [],{

        save:function(callback,callbackError){
            var _this = this;
            var q = "INSERT INTO Transecta ('nombreCampania','fechaCampania','sentido','ambiente','cuadro') values('"+this.get("campania").get("nombre")+"',"+this.get("campania").get("fecha")+","+this.get("sentido")+",'"+this.get("ambiente")+"','"+this.get("cuadro")+"');";
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
                }

            },
        
        }
    );
}, '0.0.1', { requires: ['model']});
