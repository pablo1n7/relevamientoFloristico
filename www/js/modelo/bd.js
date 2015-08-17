var db = db || window.openDatabase('RFBD', '1.0', 'my db', 2*1024*1024);

function vaciarBD(){

    var q = "select name from sqlite_master where type = 'table';"
    db.transaction(function (t) {
        t.executeSql(q, null, function (t, data) {
            for (var i = 0; i < data.rows.length; i++) {
                console.log(data.rows.item(i));
                var eliminar = 'DROP TABLE '+data.rows.item(i).name;
                (function(e){
                    db.transaction(function (t) {
                        t.executeSql(e,[],null,null);
                    });

                }(eliminar));
            };
        });
    });
}

function popularBD(){
    createTablas();
    createTablasMetodoTrabajo();
    createTablasPlantas();
    cargarInstancias();
    configuracion = localStorage.getItem('conf');
    
    if( configuracion == null){
        configuracion = JSON.stringify({"servidor":"192.168.0.",puerto:"8000"});
        localStorage.setItem('conf', configuracion);
    }
    configuracion = JSON.parse(configuracion);
    
}

function cargarInstancias(){

        db.transaction(function(t){
            t.executeSql("INSERT INTO Propiedad('id','id_servidor','nombre','descripcion','idTipoPropiedad') values(1,1,'Nota','Agregue aqui sus ideas',1);", [],
            function (t, data) {
                //data.insertId
            },null);
        });

        db.transaction(function(t){
            t.executeSql("INSERT INTO TipoEjemplar('id','id_servidor','nombre','descripcion') values(1,1,'Nota','una Nota');", [],
            function (t, data) {
                //data.insertId
            },null);
        });

        db.transaction(function(t){
            t.executeSql("INSERT INTO TipoEjemplarPropiedad('idTipoEjemplar','idPropiedad') values(1,1);", [],
            function (t, data) {
                //data.insertId
            },null);
        });



}

function createTablasMetodoTrabajo(){

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Campania(id_servidor INT, nombre TEXT NOT NULL,descripcion TEXT, fecha INT NOT NULL, PRIMARY KEY(nombre,fecha));', [], null, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS CampaniaTipoEjemplar(nombreCampania TEXT NOT NULL,idTipoEjemplar INT NOT NULL, fecha INT NOT NULL, PRIMARY KEY(nombreCampania,fecha,idTipoEjemplar),FOREIGN KEY (nombreCampania) REFERENCES Campania(nombre),FOREIGN KEY (fecha) REFERENCES Campania(fecha),FOREIGN KEY (idTipoEjemplar) REFERENCES TipoEjemplar(id));', [], null, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Transecta(id_servidor INT, id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,nombreCampania TEXT NOT NULL,cuadro TEXT, fechaCampania INT NOT NULL,sentido FLOAT NOT NULL, ambiente TEXT NOT NULL, distanciaEntrePuntos INT NOT NULL, FOREIGN KEY (nombreCampania) REFERENCES Campania(nombre),FOREIGN KEY (fechaCampania) REFERENCES Campania(fecha));', [], null, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS TransectaEspecie(idTransecta INTEGER NOT NULL ,nombreEspecie TEXT NOT NULL,FOREIGN KEY (idTransecta) REFERENCES Transecta(id),FOREIGN KEY (nombreEspecie) REFERENCES Especie(nombre));', [], null, null);
    });
$
    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Visita(id_servidor INT,idTransecta INTEGER NOT NULL ,fecha INT NOT NULL,FOREIGN KEY (idTransecta) REFERENCES Transecta(id), PRIMARY KEY (idTransecta,fecha));', [], null, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS VisitaFoto(id_servidor INT,nombreFoto TEXT NOT NULL,idTransecta INTEGER NOT NULL ,fecha INT NOT NULL,FOREIGN KEY (idTransecta) REFERENCES Visita(idTransecta),FOREIGN KEY (fecha) REFERENCES Visita(fecha), PRIMARY KEY (idTransecta,fecha,nombreFoto));', [], null, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Punto(id_servidor INT,id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, idTransecta INTEGER NOT NULL, fecha INT NOT NULL, coordenada TEXT, estadoPunto TEXT NOT NULL, tipoSuelo INT NOT NULL, FOREIGN KEY (tipoSuelo) REFERENCES TipoSuelo(id_servidor),FOREIGN KEY (idTransecta, fecha) REFERENCES Visita(idTransecta,fecha));', [], null, null);
    });


    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS TipoSuelo(id_servidor INT NOT NULL,nombre TEXT NOT NULL, PRIMARY KEY (id_servidor));', [], function(t,data){

            db.transaction(function(t){
                t.executeSql("INSERT INTO TipoSuelo('id_servidor','nombre') values(1,'No Definido');", [],
                function (t, data) {
                    //data.insertId
                },null);
            });


        }, null);
    });



}


function createTablas(){

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS TipoEjemplar(id_servidor INT,id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,nombre TEXT NOT NULL,descripcion TEXT NOT NULL);', [], function(){


        db.transaction(function(t){
            t.executeSql("INSERT INTO TipoPropiedad('id','id_servidor','nombre','idRango','idEnumerado') values(1,1,'Alfanumerico',NULL,NULL);", [],
            function (t, data) {
                //data.insertId
            },null);
        });

            db.transaction(function(t){
            t.executeSql("INSERT INTO TipoPropiedad('id','id_servidor','nombre','idRango','idEnumerado') values(2,2,'Numerico',NULL,NULL);", [],
            function (t, data) {
                //data.insertId
            },null);
        });



        }, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Ejemplar(id_servidor INT,id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,idTipoEjemplar INTEGER NOT NULL, imgSincronizada INTEGER,idTransecta INTEGER NOT NULL, idPunto INTEGER,fecha INT NOT NULL, foto TEXT,FOREIGN KEY (idTipoEjemplar) REFERENCES TipoEjemplar(id),FOREIGN KEY (idPunto) REFERENCES Punto(id),FOREIGN KEY(idTransecta,fecha) REFERENCES Visita(idTransecta,fecha));', [], null, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Rango(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, valorMin INTEGER NOT NULL, valorMax INTEGER NOT NULL);', [], null, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Enumerado(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, valores TEXT NOT NULL);', [], null, null);
    });

    db.transaction(function (t) {
            t.executeSql('CREATE TABLE IF NOT EXISTS TipoPropiedad(id_servidor INT,id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, idRango INTEGER,idEnumerado INTEGER, FOREIGN KEY (idRango) REFERENCES Rango(id),FOREIGN KEY (idEnumerado) REFERENCES Enumerado(id));', [], null, null);
        });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Propiedad(id_servidor INT,id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, descripcion TEXT NOT NULL, idTipoPropiedad INTEGER NOT NULL, FOREIGN KEY (idTipoPropiedad) REFERENCES TipoPropiedad(id));', [], null, null);
    });


    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS TipoEjemplarPropiedad(idTipoEjemplar INTEGER NOT NULL, idPropiedad INTEGER NOT NULL, FOREIGN KEY (idTipoEjemplar) REFERENCES TipoEjemplar(id),FOREIGN KEY (idPropiedad) REFERENCES Propiedad(id),PRIMARY KEY(idTipoEjemplar,idPropiedad));', [], null, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Valor(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, idPropiedad INTEGER NOT NULL, idEjemplar INTEGER NOT NULL, valor TEXT NOT NULL, FOREIGN KEY (idPropiedad) REFERENCES Propiedad(id),FOREIGN KEY (idEjemplar) REFERENCES Ejemplar(id));', [], null, null);
    });



}


function createTablasPlantas(){
    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Familia(id_servidor INT,id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL UNIQUE);', [], function(t,data){

            db.transaction(function(t){
                t.executeSql("INSERT INTO Familia('id_servidor','id','nombre') values(1,1,'No Definido');", [],
                function (t, data) {
                    Y.Familia.obtenerFamilias(function(familia){familias.push(familia);});

                },null);
            });

        }, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS FormaBiologica(nombre TEXT NOT NULL, id_servidor INT NOT NULL PRIMARY KEY);', [], function(t,data){

             db.transaction(function(t){
                t.executeSql("INSERT INTO FormaBiologica('id_servidor','nombre') values(1,'No Definido');", [],
                function (t, data) {
                    //data.insertId
                },null);
             });

        }, null);
    });


    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS TipoBiologico(nombre TEXT NOT NULL, id_servidor INT NOT NULL PRIMARY KEY);', [], function(t,data){

            db.transaction(function(t){
                t.executeSql("INSERT INTO TipoBiologico('id_servidor','nombre') values(1,'No Definido');", [],
                function (t, data) {
                    //data.insertId
                },null);
            });

        }, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS DistribucionGeografica(nombre TEXT NOT NULL, id_servidor INT NOT NULL PRIMARY KEY);', [], function(t,data){
            db.transaction(function(t){
                t.executeSql("INSERT INTO DistribucionGeografica('id_servidor','nombre') values(1,'No Definido');", [],
                function (t, data) {
                    //data.insertId
                },null);
            });
        }, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS EstadoDeConservacion(nombre TEXT NOT NULL, id_servidor INT NOT NULL PRIMARY KEY);', [], function(t,data){

            db.transaction(function(t){
                t.executeSql("INSERT INTO EstadoDeConservacion('id_servidor','nombre') values(1,'No Definido');", [],
                function (t, data) {
                    //data.insertId
                },null);
            });


        }, null);
    });

    // Aca haría un TYPE para la  DISTRIBUCION GEOGRAFICA, y otro para el ESTADO DE CONSERVACION
    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Especie(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,id_servidor INT, nombre TEXT NOT NULL UNIQUE, familia INT NOT NULL,formaBiologica INT NOT NULL, tipoBiologico INT NOT NULL , distribucionGeografica INT NOT NULL, indiceDeCalidad INT NOT NULL, forrajera INT NOT NULL ,estadoDeConservacion INT NOT NULL,imagen TEXT, FOREIGN KEY (familia) REFERENCES Familia(id),FOREIGN KEY (formaBiologica) REFERENCES FormaBiologica(id_servidor),FOREIGN KEY (tipoBiologico) REFERENCES TipoBiologico(id_servidor),FOREIGN KEY (distribucionGeografica) REFERENCES DistribucionGeografica(id_servidor),FOREIGN KEY (estadoDeConservacion) REFERENCES EstadoDeConservacion(id_servidor));', [], function(t,data){

            db.transaction(function(t){
                t.executeSql("INSERT INTO Especie('id','id_servidor','nombre','familia','formaBiologica','tipoBiologico','distribucionGeografica','indiceDeCalidad','forrajera','estadoDeConservacion') values(1,1,'No Definido',1,1,1,1,0,0,1);", [],
                function (t, data) {
                    //data.insertId
                    Y.Especie.obtenerEspecies(function(especie){especies.push(especie);});
                },null);
            });

        }, null);
    });

        db.transaction(function (t) {
            t.executeSql('CREATE TABLE IF NOT EXISTS Planta(id_servidor INT,id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, imgSincronizada INTEGER, idTransecta INTEGER NOT NULL, fecha INT NOT NULL,idPunto INTEGER, especie INT NOT NULL, estadoFenologico TEXT, toques INTEGER NOT NULL, foto TEXT, FOREIGN KEY (especie) REFERENCES Especie(id),FOREIGN KEY(idTransecta,fecha) REFERENCES Visita(idTransecta,fecha),FOREIGN KEY (idPunto) REFERENCES Punto(id));', [], null, null);
        });
    


}


/*var q = "select name from sqlite_master where type = 'table';"
                db.transaction(function (t) {
                    t.executeSql(q, null, function (t, data) {
                        for (var i = 0; i < data.rows.length; i++) {
                            console.log(data.rows.item(i));
                        };
                    });
                });*/
