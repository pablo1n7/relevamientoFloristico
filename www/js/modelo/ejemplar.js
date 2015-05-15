//typeof Y != "undefined" ? Y : Y = YUI();
var Y = Y || YUI();
Y.add('ejemplarModelo',function(Y){
    Y.Ejemplar = Y.Base.create('Ejemplar', Y.Model, [],{

            save:function(visita,idPunto){
                var _this = this;
                var idPunto = idPunto || "NULL";
                var q = "INSERT INTO Ejemplar('idTipoEjemplar','idTransecta','fecha','idPunto','foto') values("+this.get("tipoEjemplar").get("id")+","+visita.get("idTransecta")+","+visita.get("fecha")+","+idPunto+",'"+_this.get("foto")+"');";
                db.transaction(function(t){
                    t.executeSql(q, [],
                    function (t, data) {
                        _this.set('id',data.insertId);
                        _this.get("valores").map(function(valor){
                            valor.save(data.insertId);
                        });
                    },null);
                });
            },

            iconoRepresentacion:function(){
                return "fa-file-text ejemplar"
            },

            representacion: function(){
                var $div = $('<div/>');
                for(var i = 0 ; i<this.get("valores").length;i++){
                    $div.append(this.get("valores")[i].get("propiedad").representacion());
                }
                return $div;

            },

            mostrar:function(){
                var $div = $("<div class='mostrarPlanta'/>");
                $div.append("<div class='imagenFondoAdjunto' style='background-image:url("+this.getFoto()+");height:"+screen.width/2+"px;'/>");
                var $divInfo = $("<div class='infoAdjunto'/>");
                $divInfo.append("<p><b>Tipo de Adjunto: </b>"+this.get("tipoEjemplar").get("nombre")+"</p>");
                for(var i = 0; i<this.get("valores").length; i++){
                    $divInfo.append("<p><b>"+this.get("valores")[i].get("propiedad").get("nombre")+": </b>"+this.get("valores")[i].get("valor")+"</p>");
                }
                $div.append($divInfo);
                return $div;
            },

            getFoto:function(){
                if(this.get("foto")!="")
                    return intel.xdk.camera.getPictureURL(this.get("foto"));
                return "img/imagen_no_disponible.jpg";
            },

            completarCampos: function(campos){
                $.each(this.get("valores"),function(indice,valor){
                    valor.asignarValor($(campos[indice]));

                });
            },

            crearCampos: function(campos){

                for(var i=0;i<=campos.length-1;i++){
                    var valor = new Y.Valor({"propiedad":campos[i]});
                    this.get("valores").push(valor);
                };

                /*var pepe = this;
                $.each(campos,function(indice,propiedad){
                    var valor = new Y.Valor({"propiedad":propiedad});
                    pepe.get("valores").push(valor);
                });*/
            },

            borrar:function(){
                intel.xdk.camera.deletePicture(this.get("foto"));
                var _this = this;
                var q = "delete from Valor where idEjemplar="+this.get("id")+";";
                db.transaction(function (t) {
                    t.executeSql(q, null, function (t, data) {
                        console.log("un Valor Eliminado");

                        var q1 = "delete from Ejemplar where id="+_this.get("id")+";";
                        db.transaction(function (t) {
                            t.executeSql(q1, null, function (t, data) {
                                console.log("un Ejemplar Eliminado");
                            });
                        });

                    });
                });

            },

        obtenerValores:function(){
            var _this = this;
            var  q = "select va.id,va.valor,pr.nombre, pr.id as prId from Valor va, Propiedad pr where va.idEjemplar="+this.get("id")+" and va.idPropiedad = pr.id;";
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    var valor = new Y.Valor({"id":data.rows.item(i).id,"valor":data.rows.item(i).valor,"propiedad":new Y.Propiedad({id:data.rows.item(i).prId,nombre:data.rows.item(i).nombre})});
                    _this.get("valores").push(valor);
                };
                //callback(ejemplares);
            });
        });
    }


    },{
            ATTRS:{
                valores:{
                    value: []
                },
                tipoEjemplar:{
                    value: null
                },
                foto:{
                    value: ""
                },
                id:{
                    value:-1
                }

            }
        }
    );

    Y.Ejemplar.obtenerEjemplaresAsociados = function(idPunto,idTransecta,fecha,callback){
        var q = "";
        if(idPunto == null)
            q = "select ej.id, ej.idTipoEjemplar, ej.foto, te.nombre from Ejemplar ej, TipoEjemplar te where ej.idPunto isnull and ej.idTransecta="+idTransecta+" and ej.fecha="+fecha+" and ej.idTipoEjemplar=te.id;";
        else
            q = "select ej.id, ej.idTipoEjemplar, ej.foto, te.nombre from Ejemplar ej, TipoEjemplar te where ej.idPunto="+idPunto+" and ej.idTransecta="+idTransecta+" and ej.fecha="+fecha+" and ej.idTipoEjemplar=te.id;";
//            q = "select * from Ejemplar where idPunto="+idPunto+" and idTransecta="+idTransecta+" and fecha="+fecha+";";
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                var ejemplares = [];
                for (var i = 0; i < data.rows.length; i++) {
//                    var ejemplar = new Y.Ejemplar({"id":data.rows.item(i).id,"tipoEjemplar":data.rows.item(i).idTipoEjemplar,"foto":data.rows.item(i).foto});
                    var ejemplar = new Y.Ejemplar({"id":data.rows.item(i).id,"tipoEjemplar":new Y.TipoEjemplar({id:data.rows.item(i).idTipoEjemplar,nombre:data.rows.item(i).nombre}),"foto":data.rows.item(i).foto});
                    ejemplar.obtenerValores();
                    ejemplares.push(ejemplar);
                };
                callback(ejemplares);
            },function(e){console.log(e);});
        });
    };
}, '0.0.1', { requires: ['model','propiedadModelo','tipoEjemplarModelo']});
