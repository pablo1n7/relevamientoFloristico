var db = db || window.openDatabase('RFBD', '1.0', 'my db', 2*1024*1024);

var Y = Y || YUI();
Y.add('perfilModelo',function(Y){
    Y.Perfil = Y.Base.create('perfil', Y.Model, [],{
        agregarPropiedad:function(propiedad){
            this.get('campos').push(propiedad);
        },
        save:function(){
            var nombre = this.get("nombre");
            var descripcion = this.get("descripcion");
            var _this = this;
            db.transaction(function(t){
                t.executeSql("INSERT INTO Perfil('nombre','descripcion') values('"+nombre+"','"+descripcion+"');", [],
                function (t, data) {
                    _this.set('id',data.insertId);
                    for(var i=0;i<=_this.get("campos").length-1;i++){
                        _this.get("campos")[i].save(function(idPropiedad){
                            db.transaction(function(t){
                                console.log("GUARDANDO PROPIEDAD: "+idPropiedad);
                                t.executeSql("INSERT INTO PerfilPropiedad('idPerfil','idPropiedad') values("+_this.get("id")+","+idPropiedad+");", [],null,null);
                            });
                        });
                    }
            },
            null);
        });

        }
    },{
            ATTRS:{
                id:{
                    value:"-1"
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

    Y.Perfil.obtenerPropiedades= function(perfil){
        var q = "select * from PerfilPropiedad where idPerfil="+perfil.get("id");
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    (function(idPropiedad){
                        Y.Propiedad.obtenerPropiedad(idPropiedad,function(propiedad){perfil.get("campos").push(propiedad);})
                    }(data.rows.item(i).idPropiedad));

                }
            });
        });

    };

    Y.Perfil.obtenerPerfiles= function(){
        var q = "select * from Perfil";
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    var perfil = new Y.Perfil({"id":data.rows.item(i).id,"nombre":data.rows.item(i).nombre,"descripcion":data.rows.item(i).descripcion});
                    Y.Perfil.obtenerPropiedades(perfil);
                    perfiles.push(perfil)
                    //console.log(data.rows.item(i));

                };
            });
        });
    };

}, '0.0.1', { requires: ['model','propiedadModelo']});
