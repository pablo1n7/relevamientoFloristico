//typeof Y != "undefined" ? Y : Y = YUI();
var Y = Y || YUI();
Y.add('plantaModelo',function(Y){
    Y.Planta = Y.Base.create('Planta', Y.Model, [],{

            save:function(visita,idPunto){
                var _this = this;
                var idPunto = idPunto || "NULL";
                var q = "INSERT INTO Planta('idTransecta','fecha','idPunto','nombreEspecie','toques','foto') values("+visita.get("idTransecta")+","+visita.get("fecha")+","+idPunto+",'"+_this.get("especie")+"',"+_this.get("toques")+",'"+_this.get("foto")+"');";
                db.transaction(function(t){
                    t.executeSql(q, [],
                    function (t, data) {
                        _this.set('id',data.insertId);
                    },null);
                });
            },

    },{
            ATTRS:{
                id:{
                    value:-1
                },
                especie:{
                    value: ""
                },
                toques:{
                    value:""
                },
                estadoFenologico:{
                    value: ""
                },
                foto:{
                    value: ""
                }

            }
        }
    );
}, '0.0.1', { requires: ['model','especieModelo']});
