var db = db || window.openDatabase('RFBD', '1.0', 'my db', 2*1024*1024);

function borrarBD(){
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
        t.executeSql('DROP TABLE ObjetoDeInteres',[],null,null);
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

}


function createTablas(){

    //borrarBD();

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS TipoEjemplar(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,nombre TEXT NOT NULL,descripcion TEXT NOT NULL);', [], null, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS ObjetoDeInteres(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,idTipoEjemplar INTEGER NOT NULL,FOREIGN KEY (idTipoEjemplar) REFERENCES TipoEjemplar(id));', [], null, null);
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


    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Propiedad(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, descripcion TEXT NOT NULL, idTipoPropiedad INTEGER NOT NULL, FOREIGN KEY (idTipoPropiedad) REFERENCES TipoPropiedad(id));', [], null, null);
    });

    /*db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Propiedad(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, descripcion TEXT NOT NULL, idTipoEjemplar INTEGER NOT NULL, idTipoPropiedad INTEGER NOT NULL, FOREIGN KEY (idTipoEjemplar) REFERENCES TipoEjemplar(id),FOREIGN KEY (idTipoPropiedad) REFERENCES TipoPropiedad(id));', [], null, null);
    });*/

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS TipoEjemplarPropiedad(idTipoEjemplar INTEGER NOT NULL, idPropiedad INTEGER NOT NULL, FOREIGN KEY (idTipoEjemplar) REFERENCES TipoEjemplar(id),FOREIGN KEY (idPropiedad) REFERENCES Propiedad(id),PRIMARY KEY(idTipoEjemplar,idPropiedad));', [], null, null);
    });

    db.transaction(function (t) {
        t.executeSql('CREATE TABLE IF NOT EXISTS Valor(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, idPropiedad INTEGER NOT NULL, idObjetoDeInteres INTEGER NOT NULL, valor TEXT NOT NULL, FOREIGN KEY (idPropiedad) REFERENCES Propiedad(id),FOREIGN KEY (idObjetoDeInteres) REFERENCES ObjetoDeInteres(id));', [], null, null);
    });
}
