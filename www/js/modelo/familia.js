var Y = Y || YUI();
Y.add('familiaModelo',function(Y){
    Y.Familia = Y.Base.create('familia', Y.Model, [],{

        save: function(callback,callbackError){
            var q = "INSERT INTO Familia('nombre') values('"+this.get("nombre")+"');";
            db.transaction(function(t){
                t.executeSql(q, [],
                function (t, data) {
                    callback();
                },function(){callbackError();});
            });

        }



    },{
                
            ATTRS:{
                nombre: {
                    value: 'nombre'
                }
            },
        
        }
    );

     Y.Familia.obtenerFamilias= function(){
            var q = "select * from Familia";
            db.transaction(function (t) {
                t.executeSql(q, null, function (t, data) {
                    for (var i = 0; i < data.rows.length; i++) {
                        var familia = new Y.Familia({"nombre":data.rows.item(i).nombre});
                        familias.push(familia);
                        //console.log(data.rows.item(i));

                    };
                });
            });
    };




}, '0.0.1', { requires: []});
