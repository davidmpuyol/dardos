<template lang="html">

  <section class="detalle-torneo" :style="cssVars">
    <section id="fondotorneo" class="d-flex align-items-center justify-content-center sombraInsetComp">
      <h2 id="tituloTorneo">{{datosTorneo.nombre}}</h2>
    </section>
    <article id="datos" class="container pt-5">
      <div class="d-flex align-items-center justify-content-between">
        <p><strong>Jugadores:</strong> {{datosTorneo.jugadores.length}} / {{datosTorneo.max_jugadores}}</p>
        <md-button class="md-raised b-0" @click="this.apuntarse"  v-if="this.user.tipo_usuario >= 1">Apuntarse Torneo</md-button>
      </div>
      <p><strong>Fecha de cierre: </strong>{{tiempo}}</p>
      <div class="alert " role="alert">
        {{textoAlert}}
      </div>
      <!--<div class="my_bracket"></div>-->
      <bracket v-if="rounds != []" :rounds="rounds">
          <template slot="player" slot-scope="player">
            {{ player.player.name }}
          </template>
     </bracket>
      <md-button class="md-raised b-0" @click="this.abrirLista">Ver Jugadores</md-button>
      <md-list id="listaJugadores" class="md-double-line border">
        <md-list-item v-for="jugador in this.datosTorneo.jugadores">
          <label>{{ jugador.nick }}</label>
          <md-button class="ml-2 md-icon-button md-list-action" @click="$router.replace({ path: `/perfil/${jugador.nick}` })">
            <md-icon>account_circle</md-icon>
          </md-button>
        </md-list-item>
      </md-list>
    </article>
  </section>

</template>

<script lang="js">
  import Bracket from "vue-tournament-bracket";
  //let $ = JQuery;
  //import '../assets/brackets.js';
  export default  {
    name: 'detalle-torneo',
    props: ["id","conexion","user"],
    components: { Bracket },
    mounted () {
      this.rounds = [
        //Semi finals
        {
           games: [
                {

                    player1: { id: "1", name: "Xoquiitoo", winner: true },
                    player2: { id: "2", name: "Alberto", winner: false },
                },
                {

                    player1: { id: "3", name: "Pedrito", winner: false },
                    player2: { id: "4", name: "LauraM", winner: true },
                },
                {

                    player1: { id: "5", name: "Monica"},
                    player2: { id: "6", name: "Eduardo"},
                },
            ]
        },
        {
            games: [
                {

                    player1: { id: "1", name: "Xoquiitoo", winner: false },
                    player2: { id: "4", name: "LauraM", winner: true },
                },
                {

                    player1: { id: "5", name: "Monica", winner: true },
                    player2: { id: "6", name: "Eduardo", winner: false },
                }
            ]
        },
        {
            games: [
                {

                    player1: { id: "1", name: "Xoquiitoo", winner: false },
                    player2: { id: "5", name: "Monica", winner: true },
                },
            ]
        },
    ];
      this.conexion.on("resultadoTorneo",(result) => {
        this.torneo = result
        this.dibujarTorneo(result);
        if(result.fecha > Date.now()){
          let fecha = new Date(result.fecha)
          this.tiempo = fecha.getDate()+"-"+(fecha.getMonth()+1)+"-"+fecha.getFullYear()+" "+fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds()
        }else{
          this.tiempo = "Cerrado";
          this.desabilitado = true;
          this.rounds = result.bracket
        }
      })
      this.conexion.on("respuestaApuntarse",(result) => {
        if(result[1]){
          this.mostrarAlerta(result[1],"alert-success")
          this.conexion.emit("detalleTorneo",this.id)
        } else {
          this.mostrarAlerta(result[0],"alert-danger")
        }
      })
      this.conexion.emit("detalleTorneo",this.id)
    },
    beforeDestroy(){
      this.conexion.off("resultadoTorneo")
      this.conexion.off("respuestaApuntarse")
    },
    data () {
      return {
        torneo: {},
        textoAlert: "Texto ejemplo",
        tiempo: 0,
        relojActivo: false,
        desabilitado: false,
        rounds: []
      }
    },
    updated () {
      
    },
    methods: {
      abrirLista() {
        if ($('#listaJugadores').is(':visible')) {
            $('#listaJugadores').hide(600);
        } else {
          $('#listaJugadores').show(600);
        }
      },
      /*crearReloj() {
        if((this.torneo.fecha-Date.now())>0){
          console.log("entra en el if")
          let timestamp=this.torneo.fecha-Date.now()
          let horas = new Date(timestamp)
          setInterval(() => {
            this.tiempo = horas.getHours()+":"+horas.getMinutes()+":"+horas.getSeconds()
            horas.setSeconds( horas.getSeconds()-1)
          }, 1000);
          this.relojActivo = true
        }
      },*/
      apuntarse (){
        if(!this.desabilitado)
          this.conexion.emit('apuntarseTorneo',{idTorneo:this.id,nickJugador:this.user.nick})
        else{
          this.mostrarAlerta("La fase de ingreso esta cerrada","alert-danger")
        }
      },
      mostrarAlerta(texto,clase){
        $(".alert").removeClass("alert-success")
        $(".alert").removeClass("alert-danger")
        $(".alert").addClass(clase)
        this.textoAlert = texto
        $(".alert").show(500)
        setTimeout(() => {
          $(".alert").hide(500)
        }, 3000);
      },
    },
    computed: {
      cssVars() {
        return {
          '--bg-img': "url(http://localhost:3000/img/torneos/"+this.torneo.img+")",
        }
      },
      dibujarTorneo(datos){
        let jugadores = datos.torneo.jugadores;
        let nJugadores = jugadores.length;
        let nRondas = Math.round(nJugadores/2.0);
        for(let i = 0; i<nRondas; i++){
          let jugador = jugadores.pop();
        }
        $(jugadores).each(function(indice, jugador){
        })


      },
      datosTorneo() {
        return this.torneo
      }
    },
}


</script>

<style scoped lang="css">
  .detalle-torneo {

  }
  canvas {  }
  .g_gracket { width: 9999px; background-color: #fafafa; padding: 55px 15px 5px; line-height: 100%; position: relative; overflow: hidden;}
  .g_round { float: left; margin-right: 70px; }
  .g_game { position: relative; margin-bottom: 15px; }
  .g_gracket h3 { margin: 0; padding: 10px 8px 8px; font-size: 18px; font-weight: normal; color: #fff}
  .g_team { background: #3597AE; }
  .g_team:last-child {  background: #FCB821; }
  .g_round:last-child { margin-right: 20px; }
  .g_winner { background: #444; }
  .g_winner .g_team { background: none; }
  .g_current { cursor: pointer; background: #A0B43C!important; }
  .g_round_label { top: -5px; font-weight: normal; color: #CCC; text-align: center; font-size: 18px; }
  .alert{
    display: none;
  }
  #fondotorneo{
    width: 100%;
    height: 50vh;
    background-image: var(--bg-img);
    background-attachment: fixed;
  }
  #tituloTorneo{
    width: 100%;
    background-color: rgba(0, 0, 0, 0.699);
    color: white;
    text-align: center;
  }
  #listaJugadores{
    display: none;
  }
</style>
