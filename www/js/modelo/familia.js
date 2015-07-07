var Y = Y || YUI();
Y.add('familiaModelo',function(Y){
    Y.Familia = Y.Base.create('familia', Y.Model, [],{

        save: function(callback,callbackError){
            var q = "INSERT INTO Familia('nombre') values('"+this.get("nombre")+"');";
            var _this = this;
            db.transaction(function(t){
                t.executeSql(q, [],
                function (t, data) {
                    _this.set('id',data.insertId)
                    callback();
                },function(){callbackError();});
            });

        }



    },{
                
            ATTRS:{
                nombre: {
                    value: 'nombre'
                },
                id:{
                    value: '-1'
                },
                id_servidor:{
                    value: '-1'
                }
            },
        
        }
    );

     Y.Familia.obtenerFamilias= function(callback){
            var q = "select * from Familia";
            db.transaction(function (t) {
                t.executeSql(q, null, function (t, data) {
                    for (var i = 0; i < data.rows.length; i++) {
                        var familia = new Y.Familia({"id":data.rows.item(i).id,"nombre":data.rows.item(i).nombre,"id_servidor":data.rows.item(i).id_servidor});
                        callback(familia);
                        //console.log(data.rows.item(i));

                    };
                });
            });
    };

     Y.Familia.sincronizar= function(servidor){
        var familiasDicc = familias.map(function(f){return {"id":f.get("id"),"id_servidor":f.get("id_servidor"),"nombre":f.get("nombre")}});
        $.ajax({
            type: "POST",
            url: servidor,
            data: {'nombre':'familia','identidad':identidad,"datos":JSON.stringify(familiasDicc)},
            success: function(dataJson){
                    console.log(dataJson);
                    var q1 = "delete from Familia;";
                    db.transaction(function(t){
                        t.executeSql(q1, [],function (t, data) {
                            elementos = JSON.parse(dataJson)
                            familias = [];
                            for(var i =0; i < elementos.length;i++){

                                if(!elementos[i].hasOwnProperty("id")){
                                    elementos[i].id = null;
                                }

                                (function(id,ids,nombre){
                                      db.transaction(function(t){
                                            t.executeSql("INSERT INTO Familia('id','id_servidor','nombre') values("+id+","+ids+",'"+nombre+"');", [],
                                            function (t, data) {
                                                //data.insertId
                                                var familia = new Y.Familia({"id":id,"nombre":nombre,"id_servidor":ids});
                                                familias.push(familia);
                                            },null);
                                        });
                                }(elementos[i].id,elementos[i].id_servidor,elementos[i].nombre));
                            }
                        },function(){});
                    });
            },
            fail:function(data){
                mensajeError("Error en sincroniazción de 'Familia'");
            }
        });
    };




}, '0.0.1', { requires: []});
