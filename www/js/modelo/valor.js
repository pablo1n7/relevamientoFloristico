var Y = Y || YUI();
Y.add('valorModelo',function(Y){
    Y.Valor = Y.Base.create('valor', Y.Model, [],{


        save: function(idEjemplar){
            var _this = this;
            db.transaction(function(t){
                t.executeSql("INSERT INTO Valor('valor','idEjemplar','idPropiedad') values('"+_this.get("valor")+"',"+idEjemplar+","+_this.get("propiedad").get("id")+");", [],
                function (t, data) {
                    _this.set('id',data.insertId);
                },null);
            });

        },

        asignarValor: function(campo){
            var tipo = this.get("propiedad").get("tipo");
            this.set("valor",tipo.obtenerValor(campo));

        }
    },{

            ATTRS:{
                id:{
                    value:-1
                },
                valor: {
                    value:null
                },
                propiedad:{
                    value: null
                }
            },

        }
    );


    /*Y.Valor.obtenerValores = function(idEjemplar){
        q = "select va.id,va.valor,pr.nombre from Valor va, Propiedad pr where va.idEjemplar="+idEjemplar+" and va.idPropiedad = pr.id ;";
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                var ejemplares = [];
                for (var i = 0; i < data.rows.length; i++) {
                    var valor = new Y.Valor({"id":data.rows.item(i).id,"valor":data.rows.item(i).valor,"propiedad":data.rows.item(i).nombre});

                    //ejemplares.push(ejemplar);
                };
                //callback(ejemplares);
            });
        });
    }*/






}, '0.0.1', { requires: ['model','propiedadModelo']});
