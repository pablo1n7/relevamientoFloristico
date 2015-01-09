var Y = Y || YUI();
Y.add('especieModelo',function(Y){
    Y.Especie = Y.Base.create('especie', Y.Model, [],{

        save:function(callback,callbackError){
            var q = "INSERT INTO Especie ('nombre','tipoBiologico','formaBiologica','distribucionGeografica','indiceDeCalidad','estadoDeConservacion','familia') values('"+this.get("nombre")+"','"+this.get("tipoBiologico")+"','"+this.get("formaBiologica")+"','"+this.get("distribucionGeografica")+"',"+this.get("indiceDeCalidad")+",'"+this.get("estadoDeConservacion")+"','"+this.get("familia")+"');";
            db.transaction(function(t){
                t.executeSql(q, [],
                function (t, data) {
                    callback();
                },function(a){callbackError();console.log(a);});
            });
        }


    },{
                
            ATTRS:{
                nombre: {
                    value: 'nombre'
                },
                tipoBiologico: {
                    value: 'unTipo'
                },
                formaBiologica: {
                    value: 'unaForma'
                },
                distribucionGeografica:{
                    value: 'unaDistribucion'
                },
                indiceDeCalidad:{
                    value: -1
                },
                estadoDeConservacion:{
                    value: 'unEstado'
                },
                familia:{
                    value: 'unaFamilia'
                }

            },
        
        }
    );

    Y.Especie.obtenerEspecies= function(){
            var q = "select * from Especie";
            db.transaction(function (t) {
                t.executeSql(q, null, function (t, data) {
                    for (var i = 0; i < data.rows.length; i++) {
                        var especie = new Y.Especie({"nombre":data.rows.item(i).nombre,"familia":data.rows.item(i).familia,"formaBiologica":data.rows.item(i).formaBiologica,"tipoBiologico":data.rows.item(i).tipoBiologico,"estadoDeConservacion":data.rows.item(i).estadoDeConservacion,"distribucionGeografica":data.rows.item(i).distribucionGeografica,"indiceDeCalidad":data.rows.item(i).indiceDeCalidad});
                        especies.push(especie);
                        //console.log(data.rows.item(i));

                    };
                });
            });
    };

}, '0.0.1', { requires: ['model','familiaModelo']});
