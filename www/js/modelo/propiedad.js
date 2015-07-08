var Y = Y || YUI();
Y.add('propiedadModelo',function(Y){
    Y.Propiedad = Y.Base.create('propiedad', Y.Model, [],{


        /*previsualizar:function(){},*/
        representacion:function(){
            var $div = $('<div/>');
            $div.attr({"class":"input-group propiedadEjemplar"});
            var $label = $(this.get("nombre")+' <br>');
            $div.append($label);
            $div.append(this.get("tipo").representacion());
            return $div;
        },

        delete:function(){
            var id = this.get("id");
            var tipoPropiedad = this.get("tipo");
            var q = "select * from TipoEjemplarPropiedad where idPropiedad="+id;
            db.transaction(function (t) {
                t.executeSql(q, null, function (t, data) {
                    if(data.rows.length != 0){
                        return;
                    }else{
                        q = "select * from Valor where idPropiedad="+id;
                        db.transaction(function (t) {
                            t.executeSql(q, null, function (t, data) {
                                if(data.rows.length != 0){
                                    return;
                                }else{
                                    q = "delete from Propiedad where id="+id;
                                    db.transaction(function (t) {
                                        t.executeSql(q, null, function (t, data) {
                                            tipoPropiedad.delete();
                                        });
                                    });
                                }
                            });
                        });
                    }
                });
            });
        },

        save:function(callback){
            var _this = this;
            if(_this.get("id")!=-1){
                callback(_this.get("id"));
                return;
            }
            this.get("tipo").save(function(){
                var idTipoPropiedad = _this.get("tipo").get("idPadre");
                var nombre = _this.get("nombre");
                var descripcion = _this.get("descripcion");
                db.transaction(function(t){
                    t.executeSql("INSERT INTO Propiedad('nombre','descripcion','idTipoPropiedad') values('"+nombre+"','"+descripcion+"',"+idTipoPropiedad+");", [],
                    function (t, data) {
                        _this.set('id',data.insertId);
                        callback(data.insertId);
                },
                null);
                });
            });
        },
        sincronizar:function(servidor,callback){

            if(this.get("id_servidor")!=null){
                callback(servidor);
                return;
            }

            var datosPropiedad = {id:this.get("id"), nombre: this.get("nombre"),descripcion:this.get("descripcion"),tiposPropiedad:{}};
            _this = this;
            datosPropiedad.tiposPropiedad = this.get("tipo").normalizar();
            //this.get("tipo").sincronizar(servidor,function(servidor){
                $.ajax({
                type: "POST",
                url: servidor,
                data: {'nombre':'propiedad','identidad':identidad,"datos":JSON.stringify(datosPropiedad)},
                success: function(dataJson){
                        console.log(dataJson);
                        var elementoPropiedad = JSON.parse(dataJson);
                        (function(elemento){
                                  db.transaction(function(t){
                                      //t.executeSql("UPDATE HistoriaUsuario SET 'ultimaActivacion'="+Date.now()+"  where id="+historiaUsuario.id+";",[],function(t,data){

                                        t.executeSql("UPDATE Propiedad SET 'id_servidor'="+elemento.id_servidor+" where id="+elemento.id+";", [],
                                        function (t, data) {
                                            _this.set("id_servidor",elemento.id_servidor);
                                            (function(tipoPropiedad){
                                                  db.transaction(function(t){
                                                        t.executeSql("UPDATE TipoPropiedad SET 'id_servidor'= "+tipoPropiedad.id_servidor+" where id="+tipoPropiedad.idPadre+";", [],
                                                        function (t, data) {
                                                            _this.set("id_servidor",elemento.id_servidor);
                                                            callback(servidor);
                                                        },null);
                                                    });
                                            }(elemento.tiposPropiedad));
                                        },null);
                                    });
                            }(elementoPropiedad));
                    },
                    fail:function(data){
                        mensajeError("Error en sincroniazción de 'Especie'");
                    }
                });
            //});
        }

    },{
                
            ATTRS:{
                id:{
                    value:-1
                },
                nombre: {
                    value: 'nombre propiedad'
                },
                descripcion: {
                    value: 'No se cuenta con una descripción'
                },
                tipo:{
                    value: null
                },
                id_servidor:{
                    value: null
                }
            },
        
        }
    );

    Y.Propiedad.propiedades = [];

    Y.Propiedad.obtenerPropiedades= function(callback){
        var q = "select id from Propiedad";
        var propiedad = {};
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    Y.Propiedad.obtenerPropiedad(data.rows.item(i).id,callback);
                }
            });
        });
    };

    Y.Propiedad.obtenerPropiedad= function(id,callback){
        var propiedades = Y.Propiedad.propiedades.filter(function(x){return x.get("id")==id});
        if(propiedades.length != 0){
            callback(propiedades[0]);
            return;
        }

        var q = "select * from Propiedad where id="+id;
        var propiedad = {};
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    (function(i){
                        Y.TipoPropiedad.obtenerTipoPropiedad(data.rows.item(i).idTipoPropiedad,function(tipo){
                            propiedad = new Y.Propiedad({"id":data.rows.item(i).id,"id_servidor":data.rows.item(i).id_servidor,"nombre":data.rows.item(i).nombre,"descripcion":data.rows.item(i).descripcion,"tipo":tipo});
                            Y.Propiedad.propiedades.push(propiedad);
                            callback(propiedad);
                        });
                    }(i));
                }
            });
        });
    };

}, '0.0.1', { requires: ['model','tipoPropiedadModelo']});
