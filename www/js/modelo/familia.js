var Y = Y || YUI();
Y.add('familiaModelo',function(Y){
    Y.Familia = Y.Base.create('familia', Y.Model, [],{

        save: function(callback,callbackError){
            var q = "INSERT INTO Familia('id_servidor','nombre') values("+this.get("id_servidor")+",'"+this.get("nombre")+"');";
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
                    value: null
                }
            },
        
        }
    );

     Y.Familia.obtenerFamilias= function(callback){
            var q = "select * from Familia";
            familias = [];
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

     Y.Familia.sincronizar= function(servidor,callback){
        var familiasDicc = familias.map(function(f){return {"id":f.get("id"),"id_servidor":f.get("id_servidor"),"nombre":f.get("nombre")}});
        $.ajax({
            type: "POST",
            url: servidor,
            data: {'nombre':'familia','identidad':identidad,"datos":JSON.stringify(familiasDicc)},
            success: function(dataJson){
                console.log(dataJson);
                elementos = JSON.parse(dataJson);
                        //familias = [];
                for(var i =0; i < elementos.length;i++){
                    if(elementos[i].hasOwnProperty("id")){
                        var fam = familias.filter(function(f){return f.get("id") == elementos[i].id;})[0];
                        fam.set("nombre",elementos[i].nombre);
                        fam.set("id_servidor",elementos[i].id_servidor);
                    }else{
                        var familia = new Y.Familia({"nombre":elementos[i].nombre,"id_servidor":elementos[i].id_servidor});
                        familias.push(familia);
                    }
                }
                for(var i =0; i < elementos.length;i++){
                    if(!elementos[i].hasOwnProperty("id")){
                        (function(ids,nombre){
                            // var familia = new Y.Familia({"nombre":nombre,"id_servidor":ids});
                            var familia = familias.filter(function(f){return f.get("id_servidor") == ids;})[0];
                            familia.save(function() {
                                auditor.actualizarProgreso("Familia");
                            },function(){});
                        }(elementos[i].id_servidor,elementos[i].nombre));
                    }else{
                        (function(id,ids,nombre){
                              db.transaction(function(t){
                                    t.executeSql("UPDATE Familia SET nombre='"+ nombre +"', id_servidor="+ids+" WHERE id="+id+";", [],
                                    function (t, data) {
                                        auditor.actualizarProgreso("Familia");
                                    },null);
                                });
                        }(elementos[i].id,elementos[i].id_servidor,elementos[i].nombre));
                    }
                }
                callback();
            },
            fail:function(data){
                console.log("Error en sincroniazción de 'Familia'");
                mensajeError("Error en sincroniazción de 'Familia'");
                auditor.cantidadFamilias = 0;
                auditor.actualizar();
            }
        });
    };




}, '0.0.1', { requires: []});
