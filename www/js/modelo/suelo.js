var Y = Y || YUI();
Y.add('sueloModelo',function(Y){
    Y.Suelo = Y.Base.create('suelo', Y.Model, [],{




    },{
                
            ATTRS:{
                nombre: {
                    value: 'nombre propiedad'
                },
                descripcion: {
                    value: 1
                }
            },
        
        }
    );


    Y.Suelo.sincronizar= function(servidor){

        $.ajax({
            type: "GET",
            url: servidor,
            data: {'nombre':'suelo','identidad':'pepe'},
            success: function(dataJson){
                    console.log(dataJson);
                    var q1 = "delete from tipoSuelo;";
                    db.transaction(function(t){
                        t.executeSql(q1, [],function (t, data) {
                            elementos = JSON.parse(dataJson)
                            for(var i =0; i < elementos.length;i++){
                                (function(id,nombre){
                                      db.transaction(function(t){
                                            t.executeSql("INSERT INTO TipoSuelo('id_servidor','nombre') values("+id+",'"+nombre+"');", [],
                                            function (t, data) {
                                                //data.insertId
                                            },null);
                                        });
                                }(elementos[i].id,elementos[i].nombre));
                            }
                        },function(){});
                    });
            },
            fail:function(data){
                mensajeError("Error en sincroniazción de 'Suelo'");
            }
        });
    };


}, '0.0.1', { requires: ['model']});
