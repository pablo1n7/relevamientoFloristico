// lat: -43.260182
// lng: -65.297605

var Gps = (function(){

    var mediciones = [];
    var watchID = -1;
    var callback = function(){};

    var rad = function(x) {return x*Math.PI/180;};

    var dist = function(lon1, lat1, lon2, lat2){
      var R     = 6378.137;                          //Radio de la tierra en km
      var dLat  = rad( lat2 - lat1 );
      var dLong = rad( lon2 - lon1 );

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;
    //      alert("vieja pos: "+lat1+" y: "+lon1+" nueva Pos:"+lat2+" y: "+lon2);
      return (d.toFixed(4)*1000);                      //Retorna tres decimales
    };

    var angulo = function(lon1,lat1, lon2, lat2){
        var divisor = lon2-lon1;
        var dividendo = lat2-lat1;


        if(divisor == 0){
            if(dividendo >=0)
                return Math.PI/2;
            return Math.PI*1.5;
        }
        if(dividendo == 0){
            if(divisor>0)
                return 0;
            return Math.PI;
        }

        var angulo = Math.atan(dividendo / divisor);
        if(divisor>0){
            if(dividendo > 0){
                //console.log("cuadrante 1");
                return angulo;
            }else{
                //console.log("cuadrante 4");
                return (2*Math.PI)+angulo;
            }
        }else{
            if(dividendo > 0){
                //console.log("cuadrante 2");
                return (Math.PI)+angulo;

            }else{
                //console.log("cuadrante 3");
                return (Math.PI)+angulo;

            }
        }

    };

    var terminarMediciones = function(){
        var x0=0;
        var y0=0;

        /*for(var i = 0; i<mediciones.length;i++){
            x0+=mediciones[i].longitude;
            y0+=mediciones[i].latitude;
        }*/

        /*x0 = x0/mediciones.length;
        y0 = y0/mediciones.length;*/

        x0 = mediciones[mediciones.length-1].longitude;
        y0 = mediciones[mediciones.length-1].latitude;
        //alert("X0: "+x0+" Y0:"+y0);
        callback(x0,y0);
        mediciones = [];
    };

    var pararGps = function(){
        navigator.geolocation.clearWatch(watchID);
        watchID = -1;
    }

    var callbackExitoGps= function(position){
        mediciones.push(position.coords);
        //mensajeExitoso(mediciones.length+"-->"+position.coords.latitude+"-->"+position.coords.longitude);
        if (mediciones.length>3)
            terminarMediciones();

    };

    var callbackErrorGps= function(error){
        mensajeError('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');

    };


    var posicion= function(callbackSeguimiento){
        callback = callbackSeguimiento;
        var options = {timeout: 15000, frecuency:3000 ,enableHighAccuracy: true };
        //var options = {timeout: 30000, frecuency:3000 ,enableHighAccuracy: true };
        watchID = navigator.geolocation.watchPosition(callbackExitoGps,callbackErrorGps,options);
        //watchID = intel.xdk.geolocation.watchPosition(callbackExitoGps,callbackErrorGps,{maximumAge: 3000, timeout: 5000, enableHighAccuracy: true});
    };

    return {
        obtenerPosicion: posicion,
        watchID: watchID,
        mediciones: mediciones,
        distanciaEntrePuntos: dist,
        calcularAngulo:angulo,
        pararGps: pararGps
    }


}());
