var Y = Y || YUI();
Y.add('especieModelo',function(Y){
    Y.Especie = Y.Base.create('especie', Y.Model, [],{

        verImagen:function(){
            if (this.get("imagen")!= null && this.get("imagen")!="")
                return this.get("imagen");
            return "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";
        },

        save:function(callback,callbackError){
            var q = "INSERT INTO Especie ('nombre','tipoBiologico','formaBiologica','distribucionGeografica','indiceDeCalidad','estadoDeConservacion','familia','forrajera') values('"+this.get("nombre")+"','"+this.get("tipoBiologico")+"','"+this.get("formaBiologica")+"','"+this.get("distribucionGeografica")+"',"+this.get("indiceDeCalidad")+",'"+this.get("estadoDeConservacion")+"','"+this.get("familia")+"',"+this.get("forrajera")+");";
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
                },
                imagen:{
                    value: ''
                },
                forrajera:{
                    value: 1
                }

            },
        
        }
    );

    Y.Especie.obtenerEspecies= function(callback){
            var q = "select * from Especie";
            db.transaction(function (t) {
                t.executeSql(q, null, function (t, data) {
                    for (var i = 0; i < data.rows.length; i++) {
                        var especie = new Y.Especie({"nombre":data.rows.item(i).nombre,"familia":data.rows.item(i).familia,"formaBiologica":data.rows.item(i).formaBiologica,"tipoBiologico":data.rows.item(i).tipoBiologico,"estadoDeConservacion":data.rows.item(i).estadoDeConservacion,"distribucionGeografica":data.rows.item(i).distribucionGeografica,"indiceDeCalidad":data.rows.item(i).indiceDeCalidad,"imagen":data.rows.item(i).imagen,"forrajera":data.rows.item(i).forrajera});
                        //especies.push(especie);
                        callback(especie);
                        //console.log(data.rows.item(i));

                    };
                });
            });
    };

}, '0.0.1', { requires: ['model','familiaModelo']});
