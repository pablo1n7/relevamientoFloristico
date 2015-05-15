//typeof Y != "undefined" ? Y : Y = YUI();
var Y = Y || YUI();
Y.add('plantaModelo',function(Y){



    Y.Planta = Y.Base.create('Planta', Y.Model, [],{

            save:function(visita,idPunto){
                var _this = this;
                var idPunto = idPunto || "NULL";

                if(this.get("estadoFenologico")=="")
                    this.set("estadoFenologico","No Definido");

                var q = "INSERT INTO Planta('idTransecta','fecha','idPunto','nombreEspecie','toques','foto','estadoFenologico') values("+visita.get("idTransecta")+","+visita.get("fecha")+","+idPunto+",'"+_this.get("especie")+"',"+_this.get("toques")+",'"+_this.get("foto")+"','"+this.get("estadoFenologico")+"');";
                db.transaction(function(t){
                    t.executeSql(q, [],
                    function (t, data) {
                        _this.set('id',data.insertId);
                    },null);
                });
            },

            iconoRepresentacion:function(){
                return "fa-leaf planta"
            },

            borrar:function(){
                intel.xdk.camera.deletePicture(this.get("foto"));
                var q = "delete from Planta where id="+this.get("id")+";";
                db.transaction(function (t) {
                    t.executeSql(q, null, function (t, data) {
                        console.log("una Planta Eliminada");
                    });
                });
            },


            mostrar:function(){
                var $div = $("<div class='mostrarPlanta'> <div class='imagenFondoAdjunto' style='background-image:url("+this.getFoto()+");height:"+screen.width/2+"px;'/> </div>");
                var $divInfo = $("<div class='infoAdjunto'></div>");
                $divInfo.append("<p><b>Tipo de Adjunto: </b> Planta </p>");
                $divInfo.append("<p><b>Especie: </b>"+this.get('especie')+"</p>");
                if(this.get('toques') != 0)
                    $divInfo.append("<p><b>Toques: </b>"+this.get('toques')+"</p>");
                $divInfo.append("<p><b>Estado Fenológico: </b>"+this.get('estadoFenologico')+"</p>");
                $div.append($divInfo);
                return $div;
            },

        getFoto:function(){
            if(this.get("foto")!="")
                return intel.xdk.camera.getPictureURL(this.get("foto"));
            return "img/imagen_no_disponible.jpg";
        }

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
    Y.Planta.obtenerPlantasAsociadas = function(idPunto,idTransecta,fecha,callback){
        var q = "";
        if(idPunto == null)
            q = "select * from Planta where idPunto isnull and idTransecta="+idTransecta+" and fecha="+fecha+";";
        else
            q = "select * from Planta where idPunto = "+idPunto+" and idTransecta="+idTransecta+" and fecha="+fecha+";";
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                var plantas = [];
                for (var i = 0; i < data.rows.length; i++) {
                    var planta = new Y.Planta({"id":data.rows.item(i).id,"idPunto":data.rows.item(i).idPunto,"especie":data.rows.item(i).nombreEspecie,"estadoFenologico":data.rows.item(i).estadoFenologico,"fecha":data.rows.item(i).fecha,"toques":data.rows.item(i).toques,"foto":data.rows.item(i).foto});
                    plantas.push(planta);
                };
                callback(plantas);
            });
        });
    };


    Y.Planta.obtenerPlantasVisita = function(idTransecta,fecha,callback){
        q = "select * from Planta where idTransecta="+idTransecta+" and fecha="+fecha+";";
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                var plantas = [];
                for (var i = 0; i < data.rows.length; i++) {
                    var planta = new Y.Planta({"id":data.rows.item(i).id,"idPunto":data.rows.item(i).idPunto,"especie":data.rows.item(i).nombreEspecie,"estadoFenologico":data.rows.item(i).estadoFenologico,"fecha":data.rows.item(i).fecha,"toques":data.rows.item(i).toques,"foto":data.rows.item(i).foto});
                    plantas.push(planta);
                };
                callback(plantas);
            });
        });
    };



    Y.Planta.obtenerPlantas = function(callback){   // Hay que pensar como (stream? objeto YUI? JSON?) se las mandamos al servidor!
            var q = "select * from Planta;";
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                var plantas = [];
                for (var i = 0; i < data.rows.length; i++) {
                    var planta = new Y.Planta({"id":data.rows.item(i).id,"idPunto":data.rows.item(i).idPunto,"especie":data.rows.item(i).nombreEspecie,"estadoFenologico":data.rows.item(i).estadoFenologico,"fecha":data.rows.item(i).fecha,"toques":data.rows.item(i).toques,"foto":data.rows.item(i).foto});
                    plantas.push(planta);
                };
                callback(plantas);
            });
        });
    };
}, '0.0.1', { requires: ['model','especieModelo']});
