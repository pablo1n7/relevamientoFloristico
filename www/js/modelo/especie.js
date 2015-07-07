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
        },

        humanizar:function(){
            var id = this.get("estadoDeConservacion");
            this.set("estadoDeConservacion",estadosDeConservacion.filter(function(v){return v.id == id;})[0]);
            id = this.get("formaBiologica");
            this.set("formaBiologica",formasBiologicas.filter(function(v){return v.id == id;})[0]);
            id = this.get("tipoBiologico");
            this.set("tipoBiologico",tiposBiologicos.filter(function(v){return v.id == id;})[0]);
            id = this.get("distribucionGeografica");
            this.set("distribucionGeografica",distribuciones.filter(function(v){return v.id == id;})[0]);
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
                },
                id_servidor:{
                    value: -1
                }

            },
        
        }
    );

    Y.Especie.obtenerEspecies= function(callback){
            var q = "select * from Especie";
            db.transaction(function (t) {
                t.executeSql(q, null, function (t, data) {
                    for (var i = 0; i < data.rows.length; i++) {
                        var familia = familias.filter(function(f){return f.get("id") == data.rows.item(i).familia;})[0];
                        var especie = new Y.Especie({"id":data.rows.item(i).id,"nombre":data.rows.item(i).nombre,"familia":familia,"formaBiologica":data.rows.item(i).formaBiologica,"tipoBiologico":data.rows.item(i).tipoBiologico,"estadoDeConservacion":data.rows.item(i).estadoDeConservacion,"distribucionGeografica":data.rows.item(i).distribucionGeografica,"indiceDeCalidad":data.rows.item(i).indiceDeCalidad,"imagen":data.rows.item(i).imagen,"forrajera":data.rows.item(i).forrajera,"id_servidor":data.rows.item(i).id_servidor});
                        //especies.push(especie);
                        especie.humanizar();
                        callback(especie);
                        //console.log(data.rows.item(i));

                    };
                });
            });
    };

     Y.Especie.sincronizar= function(servidor){
        var familiasDicc = [];
        familias.map(function(f){familiasDicc[f.get("id")] = f.get("id_servidor")});
        var especiesDicc = especies.map(function(e){return {"id":e.get("id"),"id_servidor":e.get("id_servidor"),"nombre":e.get("nombre"),"familiaLocal":e.get("familia").get("id"),"familia":familiasDicc[e.get("familia").get("id")],"formaBiologica":e.get("formaBiologica").id,"tipoBiologico":e.get("tipoBiologico").id,"estadoDeConservacion":e.get("estadoDeConservacion").id,"distribucionGeografica":e.get("distribucionGeografica").id,"indiceDeCalidad":e.get("indiceDeCalidad"),"forrajera":e.get("forrajera")}});   // Y SI TENIA UNA IMAGEN POR QUE SE MURIO???

        $.ajax({
            type: "POST",
            url: servidor,
            data: {'nombre':'especie','identidad':identidad,"datos":JSON.stringify(especiesDicc)},
            success: function(dataJson){
                    console.log(dataJson);
                    var q1 = "delete from Especie;";
                    db.transaction(function(t){
                        t.executeSql(q1, [],function (t, data) {
                            elementos = JSON.parse(dataJson)
                            especies = [];
                            for(var i =0; i < elementos.length;i++){

                                if(!elementos[i].hasOwnProperty("id")){
                                    elementos[i].id = null;
                                    elementos[i].familiaLocal = familias.filter(function(f){return f.get("id_servidor") == elementos[i].familia})[0].get("id");
                                }

                                (function(id,ids,nombre,familia,familiaLocal,formaBiologica,tipoBiologico,estadoDeConservacion,distribucionGeografica,indiceDeCalidad,forrajera,imagen){
                                      db.transaction(function(t){
                                            t.executeSql("INSERT INTO Especie('id','id_servidor','nombre','formaBiologica','tipoBiologico','estadoDeConservacion','distribucionGeografica','indiceDeCalidad','forrajera','imagen','familia') values("+id+","+ids+",'"+nombre+"',"+formaBiologica+","+tipoBiologico+","+estadoDeConservacion+","+distribucionGeografica+","+indiceDeCalidad+","+forrajera+",'"+imagen+"',"+familiaLocal+");", [],
                                            function (t, data) {
                                                //data.insertId
                                                var familia = familias.filter(function(f){return f.get("id") == familiaLocal;})[0];
                                                var especie = new Y.Especie({"id":id,"id_servidor":ids,"nombre":nombre,"familia":familia,"formaBiologica":formaBiologica,"tipoBiologico":tipoBiologico,"estadoDeConservacion":estadoDeConservacion,"distribucionGeografica":distribucionGeografica,"indiceDeCalidad":indiceDeCalidad,"forrajera":forrajera,"imagen":imagen});
                                                especie.humanizar();
                                                especies.push(especie);
                                            },null);
                                        });
                                }(elementos[i].id,elementos[i].id_servidor,elementos[i].nombre,elementos[i].familia,elementos[i].familiaLocal,elementos[i].formaBiologica,elementos[i].tipoBiologico,elementos[i].estadoDeConservacion,elementos[i].distribucionGeografica,elementos[i].indiceDeCalidad,elementos[i].forrajera,elementos[i].imagen));
                            }
                        },function(){});
                    });
            },
            fail:function(data){
                mensajeError("Error en sincroniazción de 'Especie'");
            }
        });
    };

}, '0.0.1', { requires: ['model','familiaModelo']});
