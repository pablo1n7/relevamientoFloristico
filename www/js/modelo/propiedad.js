var Y = Y || YUI();
Y.add('propiedadModelo',function(Y){
    Y.Propiedad = Y.Base.create('propiedad', Y.Model, [],{
        clonar:function(){
            var clon = new Y.Propiedad({'nombre':this.get('nombre'),'descripcion':this.get('descripcion'),'tipo':this.get('tipo')});
            return clon;
        },

        representacion:function(){
            var $div = $('<div/>');
            $div.attr({"class":"input-group"});
            var $label = $('<label>'+this.get("nombre")+'</label>');
            $div.append($label);
            $div.append(this.get("tipo").representacion());
            return $div;
        },

        asignarValor: function(campo){
            var tipo = this.get("tipo");
            this.set("valor",tipo.obtenerValor(campo));
            console.log(this);

        }

    },{
                
            ATTRS:{
                nombre: {
                    value: 'nombre propiedad'
                },
                descripcion: {
                    value: 1
                },
                valor: {
                    value:null
                },
                tipo:{
                    value: null
                }
            },
        
        }
    );
}, '0.0.1', { requires: ['model','tipoPropiedadModelo']});
