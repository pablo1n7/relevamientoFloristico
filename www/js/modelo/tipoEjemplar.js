var db = db || window.openDatabase('RFBD', '1.0', 'my db', 2*1024*1024);

var Y = Y || YUI();
Y.add('tipoEjemplarModelo',function(Y){
    Y.TipoEjemplar = Y.Base.create('tipoEjemplar', Y.Model, [],{
        agregarPropiedad:function(propiedad){
            this.get('campos').push(propiedad);
        },

        delete:function(callback,callbackError){
            var id = this.get("id");
            var campos = this.get("campos");
            var q = "select * from Ejemplar where idTipoEjemplar="+id;
            db.transaction(function (t) {
                t.executeSql(q, null, function (t, data) {
                    if(data.rows.length != 0){
                        callbackError();
                        return;
                    }
                    q = "delete from TipoEjemplarPropiedad where idTipoEjemplar="+id;
                    db.transaction(function (t) {
                        t.executeSql(q, null, function (t, data) {
                            console.log("Tipo Eliminado de TipoEjemplarPropiedad");
                            q = "delete from TipoEjemplar where id="+id;
                            db.transaction(function (t) {
                                t.executeSql(q, null, function (t, data){
                                    console.log("Tipo Ejemplar Eliminado");
                                    campos.map(function(propiedad){propiedad.delete();});

                                    callback();
                                });
                            });
                        });
                    });

                });
            });
        },

        save:function(callback){
            var nombre = this.get("nombre");
            var descripcion = this.get("descripcion");
            var _this = this;
            db.transaction(function(t){
                t.executeSql("INSERT INTO TipoEjemplar('nombre','descripcion') values('"+nombre+"','"+descripcion+"');", [],
                function (t, data) {
                    _this.set('id',data.insertId);
                    for(var i=0;i<=_this.get("campos").length-1;i++){
                        _this.get("campos")[i].save(function(idPropiedad){
                            db.transaction(function(t){
                                console.log("GUARDANDO PROPIEDAD: "+idPropiedad);
                                t.executeSql("INSERT INTO TipoEjemplarPropiedad('idTipoEjemplar','idPropiedad') values("+_this.get("id")+","+idPropiedad+");", [],null,null);
                            });
                        });
                    }
                    callback();
            },
            null);
        });

        },

        sincronizar:function(servidor,callback){

            if(this.get("id_servidor")!=null){
                callback(servidor);
                return;
            }
            var _this = this;
            var propiedades = this.get("campos");
            for(var i=0; i< propiedades.length;i++){
                if(propiedades[i].get("id_servidor")==null)
                    return propiedades[i].sincronizar(servidor,function(servidor){_this.sincronizar(servidor,callback);});
            }
            var idPropiedades = propiedades.map(function(propiedad){return propiedad.get("id_servidor")});
            var datosTipoEjemplar = {id:this.get("id"), nombre: this.get("nombre"),descripcion:this.get("descripcion"),campos:idPropiedades};
                $.ajax({
                type: "POST",
                url: servidor,
                data: {'nombre':'tipoEjemplar','identidad':identidad,"datos":JSON.stringify(datosTipoEjemplar)},
                success: function(dataJson){
                        console.log(dataJson);
                        var elementoTipoEjemplar = JSON.parse(dataJson);
                        (function(elemento){
                                  db.transaction(function(t){
                                        t.executeSql("UPDATE TipoEjemplar SET 'id_servidor'="+elemento.id_servidor+" where id="+elemento.id+";", [],
                                        function (t, data) {
                                            _this.set("id_servidor",elemento.id_servidor);
                                            callback(servidor);
                                        },null);
                                    });
                            }(elementoTipoEjemplar));
                    },
                    fail:function(data){
                        mensajeError("Error en sincroniazción de 'Tipo Ejemplar'");
                    }
                });
        }
    },{
            ATTRS:{
                id:{
                    value:"-1"
                },
                id_servidor:{
                    value:null
                },
                nombre:{
                    value: "por defecto"
                },
                descripcion:{
                    value: "una Descripcion"
                },
                campos:{
                    value: []
                }
            }
        }
    );

    Y.TipoEjemplar.obtenerPropiedades= function(tipoEjemplar){
        var q = "select * from TipoEjemplarPropiedad where idTipoEjemplar="+tipoEjemplar.get("id");
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    (function(idPropiedad){
                        Y.Propiedad.obtenerPropiedad(idPropiedad,function(propiedad){tipoEjemplar.get("campos").push(propiedad);})
                    }(data.rows.item(i).idPropiedad));

                }
            });
        });

    };

    Y.TipoEjemplar.obtenerTipoEjemplares= function(callback){
        var q = "select * from TipoEjemplar";
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    var tipoEjemplar = new Y.TipoEjemplar({"id":data.rows.item(i).id,"id_servidor":data.rows.item(i).id_servidor,"nombre":data.rows.item(i).nombre,"descripcion":data.rows.item(i).descripcion});
                    Y.TipoEjemplar.obtenerPropiedades(tipoEjemplar);
                    callback(tipoEjemplar);
                    //console.log(data.rows.item(i));

                };
            });
        });
    };

}, '0.0.1', { requires: ['model','propiedadModelo']});
