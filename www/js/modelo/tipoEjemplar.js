var db = db || window.openDatabase('RFBD', '1.0', 'my db', 2*1024*1024);

var Y = Y || YUI();
Y.add('tipoEjemplarModelo',function(Y){
    Y.TipoEjemplar = Y.Base.create('tipoEjemplar', Y.Model, [],{
        agregarPropiedad:function(propiedad){
            this.get('campos').push(propiedad);
        },
        save:function(){
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

    Y.TipoEjemplar.obtenerTipoEjemplares= function(){
        var q = "select * from TipoEjemplar";
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    var tipoEjemplar = new Y.TipoEjemplar({"id":data.rows.item(i).id,"nombre":data.rows.item(i).nombre,"descripcion":data.rows.item(i).descripcion});
                    Y.TipoEjemplar.obtenerPropiedades(tipoEjemplar);
                    tipoEjemplares.push(tipoEjemplar)
                    //console.log(data.rows.item(i));

                };
            });
        });
    };

}, '0.0.1', { requires: ['model','propiedadModelo']});
