var Y = Y || YUI();
Y.add('visitaModelo',function(Y){
    Y.Visita = Y.Base.create('visita', Y.Model, [],{

        save:function(idTransecta){
            var q = "INSERT INTO Visita ('idTransecta','fecha') values("+idTransecta+","+this.get("fecha")+");";
            db.transaction(function(t){
                t.executeSql(q, [],null,null);
            });
        }

    },{
                
            ATTRS:{
                fecha: {
                    value: '15/02/2015'
                },
                puntos: {
                    value:[]
                },
                items:{
                    value:[]
                }
            },
        
        }
    );
}, '0.0.1', { requires: ['model']});
