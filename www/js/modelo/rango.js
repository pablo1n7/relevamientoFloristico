var Y = Y || YUI();
Y.add('rangoModelo',function(Y){
    Y.Rango = Y.Base.create('rango', Y.TipoPropiedad, [],{

            representacion:function(){
                var numeroAleatorio = parseInt(Math.random()*10000000000000000);
                var $inputRango = $('<input id="rango'+numeroAleatorio+'" class="slider" onchange="'+"$('#label"+numeroAleatorio+"').text(this.value);"+'" type="range" min="'+this.get("valorMin")+'" max="'+this.get("valorMax")+'" value="'+this.get("valorMin")+'">');
                var $labelRango = $('<span id="label'+numeroAleatorio+'" class="range-value"></span>');
                var $div = $("<div/>");
                $div.append($inputRango);
                $div.append($labelRango);
                $labelRango.text(this.get("valorMin"));
                return $div;
            },

            delete: function(){
                var q = "delete from Rango where id="+this.get("id");
                this.deletePadre(function(){
                    db.transaction(function (t){
                        t.executeSql(q, null, function (t, data){
                        },function(a){
                            console.log(a);
                        });
                    });
                });
            },

            save:function(callback){
                var _this = this;
                if(_this.get("id")== -1){
                    db.transaction(function(t){
                        t.executeSql("INSERT INTO Rango('valorMin','valorMax') values("+_this.get("valorMin")+","+_this.get("valorMax")+");", [],
                        function (t, data) {
                            _this.set('id',data.insertId);
                            _this.savePadre(data.insertId,"NULL",callback);
                        },null);
                    });



                };

            },

            normalizar:function(){
                var tipo = {idPadre:this.get("idPadre"),id:this.get("id"),valorMax:this.get("valorMax"),valorMin:this.get("valorMin"),tipo:"rango"}
                return tipo;
            }


    },{
            ATTRS:{
                id:{
                    value: -1
                },
                valorMax: {
                    value: 1
                },
                valorMin: {
                    value: 0
                }
            }
        }
    );

     Y.Rango.representacionComoCrear = function(){
        var $div = $("<div/>");
        var $inputMax = $('<input type="number" name="valorMax" placeholder="Valor Maximo" patron="^(-?[0-9]+)$" mensaje=""/>');
        var $inputMin = $('<input type="number" name="valorMin" placeholder="Valor Minimo" patron="^(-?[0-9]+)$" mensaje=""/>');
        $div.append($inputMin);
        $div.append($inputMax);
        return $div;
    };
    Y.Rango.rangos = [];

    Y.Rango.obtenerRango= function(idRango,idPadre,callback){
        var rangos = Y.Rango.rangos.filter(function(x){return x.get("id")==idRango});
        if(rangos.length != 0){
            callback(rangos[0]);
            return;
        }

        var q = "select * from Rango where id="+idRango;
        var rango = {};
        db.transaction(function (t) {
            t.executeSql(q, null, function (t, data) {
                for (var i = 0; i < data.rows.length; i++) {
                    console.log(data.rows.item(i));
                    rango = new Y.Rango({"idPadre":idPadre,"id":data.rows.item(i).id,"valorMin":data.rows.item(i).valorMin,"valorMax":data.rows.item(i).valorMax});
                    Y.Rango.rangos.push(rango);
                    callback(rango);
                }
            });
        });
    };
}, '0.0.1', { requires: ['model','tipoPropiedadModelo']});
