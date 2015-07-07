var Y = Y || YUI();
Y.add('enumeradoModelo',function(Y){
    Y.Enumerado = Y.Base.create('enumerado', Y.TipoPropiedad, [],{



            obtenerValor: function(campo){
                return this.get("valores")[campo.find("select")[0].selectedIndex];
            },

            delete: function(){
                var q = "delete from Enumerado where id="+this.get("id");
                this.deletePadre(function(){
                        db.transaction(function (t) {
                            t.executeSql(q, null, function (t, data){

                            });
                        });
                    }
                );
            },


            representacion:function(){
                var $list = $("<select/>");
                $.each(this.get("valores"), function(indice, tipo){
                    $list.append(new Option(tipo,indice));
                });
                return $list;
            },
            save:function(callback){
                var _this = this;
                if(_this.get("id")== -1){
                    db.transaction(function(t){
                        t.executeSql("INSERT INTO Enumerado('valores') values('"+(_this.get("valores").join(","))+"');", [],
                        function (t, data) {
                            _this.set('id',data.insertId);
                            _this.savePadre("NULL",data.insertId,callback);
                        },null);
                    });



                };

            },
            normalizar:function(){
                var tipo = {idPadre:this.get("idPadre"),id:this.get("id"),valores:this.get("valores"),tipo:"enumerado"}
                return tipo;
            }
    },{
                
            ATTRS:{
                id:{
                    value:-1
                },
                valores: {
                    value:[]
                }
            }
        }
    );

    Y.Enumerado.representacionComoCrear = function(){
        $div = $("<div/>");
        $input = $('<input type="text" name="valores" placeholder="Rojo,Verde,Amarillo" patron="^([a-zñáéíóú0-9]+)([a-zñáéíóú0-9, ]+)([a-zñáéíóú0-9]+)$" mensaje=""/>');
        $label = $("<label>Conjunto</label>");
        $div.append($label);
        $div.append($input);
        return $div;
    };

    Y.Enumerado.enumerados = [];

    Y.Enumerado.obtenerEnumerado= function(idEnumerado,idPadre,callback){
        var enumerados = Y.Enumerado.enumerados.filter(function(x){return x.get("id")==idEnumerado});
        if(enumerados.length != 0){
            callback(enumerados[0]);
            return;
        }

        var q = "select * from Enumerado where id="+idEnumerado;
        var enumerado = {};
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    enumerado = new Y.Enumerado({"idPadre":idPadre,"id":data.rows.item(i).id,"valores":data.rows.item(i).valores.split(",")});
                    Y.Enumerado.enumerados.push(enumerado);
                    callback(enumerado);
                }
            });
        });
    };
}, '0.0.1', { requires: ['model','tipoPropiedadModelo']});
