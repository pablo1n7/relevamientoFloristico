<div class="divBoton botoneraPrincipal">
    <div name="agregarPunto" class="divBotonIndividual" onclick='$.mvc.route("aplicacion/crearPunto");'>
        <i class="fa fa-dot-circle-o"></i><i class="fa fa-plus plusModificado"></i>
    </div>
    <div name="agregarFotoTransecta" class="divBotonIndividual" onclick='$.mvc.route("/aplicacion/tomarFotoVisita")';>
        <i class="fa fa-camera-retro"></i>
    </div>
    <div name="agregarRecolectable" class="divBotonIndividual" onclick='$.mvc.route("/aplicacion/relevarRecolectableVisita")'>
        <i class="fa fa-paperclip"></i><i class="fa fa-plus plusModificado"></i>
    </div>
</div>
<div id="indicadorSeguimiento" name="indicadorSeguimiento" class="indicadorSeguimiento">
    <div id="flechaSeguimiento" class="flecha">
    </div>
</div>
<div id="justgageTransecta" class="justgagePersonalizado"  > </div>
<div id="indicadorDistancia" class="justgagePersonalizado tabulado">
    <div>
        Fin Transecta en
    </div>
    <div id="metrosRestantes" class="metrosRestantes">
        2205
    </div>
    <div>mts</div>
</div>
