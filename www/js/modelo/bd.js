var db = db || window.openDatabase('RFBD', '1.0', 'my db', 2*1024*1024);

function vaciarBD(){
     db.transaction(function (t) {
        t.executeSql('DROP TABLE TipoEjemplarPropiedad',[],null,null);
    });

    db.transaction(function (t) {
        t.executeSql('DROP TABLE TipoEjemplar',[],null,null);
    });


    db.transaction(function (t) {
        t.executeSql('DROP TABLE Valor',[],null,null);
    });


    db.transaction(function (t) {
        t.executeSql('DROP TABLE Propiedad',[],null,null);
    });


    db.transaction(function (t) {
        t.executeSql('DROP TABLE Ejemplar',[],null,null);
    });


    db.transaction(function (t) {
        t.executeSql('DROP TABLE TipoPropiedad',[],null,null);
    });


    db.transaction(function (t) {
        t.executeSql('DROP TABLE Rango',[],null,null);
    });


    db.transaction(function (t) {
        t.executeSql('DROP TABLE Enumerado',[],null,null);
    });

    db.transaction(function (t) {
        t.executeSql('DROP TABLE Especie',[],null,null);
    });

    db.transaction(function (t) {
        t.executeSql('DROP TABLE Familia',[],null,null);
    });


    createTablas();
    createTablasPlantas();
    cargarInstancias();
}

function cargarInstancias(){
        db.transaction(function(t){
            t.executeSql("INSERT INTO TipoPropiedad('nombre','idRango','idEnumerado') values('Alfanumerico',NULL,NULL);", [],
            function (t, data) {
                //data.insertId
            },null);
        });
        db.transaction(function(t){
            t.executeSql("INSERT INTO TipoPropiedad('nombre','idRango','idEnumerado') values('Numerico',NULL,NULL);", [],
            function (t, data) {
                //data.insertId
            },null);
        });

        db.transaction(function(t){
            t.executeSql("INSERT INTO FormaBiologica('nombre') values('Arbusto');", [],
            function (t, data) {
                //data.insertId
            },null);
        });

        db.transaction(function(t){
            t.executeSql("INSERT INTO FormaBiologica('nombre') values('Hierba');", [],
            function (t, data) {
                //data.insertId
            },null);
        });

        db.transaction(function(t){
            t.executeSql("INSERT INTO FormaBiologica('nombre') values('Graminea');", [],
            function (t, data) {
                //data.insertId
            },null);
        });

        db.transaction(function(t){
            t.executeSql("INSERT INTO TipoBiologico('nombre') values('Eudicotiledónea');", [],
            function (t, data) {
                //data.insertId
            },null);
        });

        db.transaction(function(t){
            t.executeSql("INSERT INTO TipoBiologico('nombre') values('Monocotiledónea');", [],
            function (t, data) {
                //data.insertId
            },null);
        });

        db.transaction(function(t){
            t.executeSql("INSERT INTO EstadoDeConservacion('nombre') values('Preocupación Menor (LC)');", [],
            function (t, data) {
                //data.insertId
            },null);
        });

        db.transaction(function(t){
            t.executeSql("INSERT INTO EstadoDeConservacion('nombre') values('Casi Amenazada (NT)');", [],
            function (t, data) {
                //data.insertId
            },null);
        });

        db.transaction(function(t){
            t.executeSql("INSERT INTO EstadoDeConservacion('nombre') values('Vulnerable (VU)');", [],
            function (t, data) {
                //data.insertId
            },null);
        });

        db.transaction(function(t){
            t.executeSql("INSERT INTO EstadoDeConservacion('nombre') values('En Peligro (EN)');", [],
            function (t, data) {
                //data.insertId
            },null);
        });

        db.transaction(function(t){
            t.executeSql("INSERT INTO EstadoDeConservacion('nombre') values('En Peligro Critico (CR)');", [],
            function (t, data) {
                //data.insertId
            },null);
        });

        db.transaction(function(t){
            t.executeSql("INSERT INTO EstadoDeConservacion('nombre') values('Extinta (EW/EX)');", [],
            function (t, data) {
                //data.insertId
            },null);
        });

        db.transaction(function(t){
            t.executeSql("INSERT INTO DistribucionGeografica('nombre') values('Exótica');", [],
            function (t, data) {
                //data.insertId
            },null);
        });

        db.transaction(function(t){
            t.executeSql("INSERT INTO DistribucionGeografica('nombre') values('Nativa');", [],
            function (t, data) {
                //data.insertId
            },null);
        });

        db.transaction(function(t){
            t.executeSql("INSERT INTO DistribucionGeografica('nombre') values('Endémica');", [],
            function (t, data) {
                //data.insertId
            },null);
        });







}



function createTablas(){

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS TipoEjemplar(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,nombre TEXT NOT NULL,descripcion TEXT NOT NULL);', [], null, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Ejemplar(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,idTipoEjemplar INTEGER NOT NULL,FOREIGN KEY (idTipoEjemplar) REFERENCES TipoEjemplar(id));', [], null, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Rango(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, valorMin INTEGER NOT NULL, valorMax INTEGER NOT NULL);', [], null, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Enumerado(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, valores TEXT NOT NULL);', [], null, null);
    });

    db.transaction(function (t) {
            t.executeSql('CREATE TABLE IF NOT EXISTS TipoPropiedad(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, idRango INTEGER,idEnumerado INTEGER, FOREIGN KEY (idRango) REFERENCES Rango(id),FOREIGN KEY (idEnumerado) REFERENCES Enumerado(id));', [], null, null);
        });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Propiedad(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, descripcion TEXT NOT NULL, idTipoPropiedad INTEGER NOT NULL, FOREIGN KEY (idTipoPropiedad) REFERENCES TipoPropiedad(id));', [], null, null);
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
        t.executeSql('CREATE TABLE IF NOT EXISTS Familia(nombre TEXT NOT NULL PRIMARY KEY);', [], null, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS FormaBiologica(nombre TEXT NOT NULL PRIMARY KEY);', [], null, null);
    });


    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS TipoBiologico(nombre TEXT NOT NULL PRIMARY KEY);', [], null, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS DistribucionGeografica(nombre TEXT NOT NULL PRIMARY KEY);', [], null, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS EstadoDeConservacion(nombre TEXT NOT NULL PRIMARY KEY);', [], null, null);
    });

    // Aca haría un TYPE para la  DISTRIBUCION GEOGRAFICA, y otro para el ESTADO DE CONSERVACION
    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Especie(familia TEXT NOT NULL, nombre TEXT NOT NULL PRIMARY KEY,formaBiologica TEXT NOT NULL, tipoBiologico TEXT NOT NULL , distribucionGeografica TEXT NOT NULL, indiceDeCalidad INTEGER NOT NULL, estadoDeConservacion TEXT NOT NULL, FOREIGN KEY (familia) REFERENCES Familia(nombre),FOREIGN KEY (formaBiologica) REFERENCES FormaBiologica(nombre),FOREIGN KEY (tipoBiologico) REFERENCES TipoBiologico(nombre),FOREIGN KEY (distribucionGeografica) REFERENCES DistribucionGeografica(nombre),FOREIGN KEY (estadoDeConservacion) REFERENCES EstadoDeConservacion(nombre));', [], null, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Planta(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, idEspecie INTEGER NOT NULL, toques INTEGER NOT NULL, altura INTEGER NOT NULL, FOREIGN KEY (idEspecie) REFERENCES Especie(id));', [], null, null);
    });
}
