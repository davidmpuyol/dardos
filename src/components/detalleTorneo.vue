<template lang="html">

  <section class="detalle-torneo" :style="cssVars">
    <section id="fondotorneo" class="d-flex align-items-center justify-content-center sombraInsetComp">
      <h2 id="tituloTorneo">{{datosTorneo.nombre}}</h2>
    </section>
    <article id="datos" class="container pt-5">
      <div class="d-flex align-items-center justify-content-between">
        <p><strong>Jugadores:</strong> {{ nJugadores }} / {{datosTorneo.max_jugadores}}</p>
        <md-button class="md-raised b-0" @click="this.borrar"  v-if="this.user.tipo_usuario >= 2">Borrar Torneo</md-button>
        <md-button class="md-raised b-0" @click="this.apuntarse"  v-if="this.user.tipo_usuario >= 1">Apuntarse Torneo</md-button>
      </div>
      <p><strong>Fecha de cierre: </strong>{{tiempo}}</p>
      <div class="alert " role="alert">
        {{textoAlert}}
      </div>
      <!--<div class="my_bracket"></div>-->
      <bracket v-if="rounds != []" :rounds="rounds">
          <template style="min-width:150px" slot="player" slot-scope="player">
            {{ player.player.name }} <button @click="ganador(player)" v-if="player.player.mostrarBoton && user.tipo_usuario >= 4">Win</button>
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
      console.log(this.relojActivo);
      this.conexion.on("resultadoTorneo",(result) => {
        this.torneo = result
        //this.torneo.jugadores = [{nick: "David"},{nick: "Pepe"},{nick: "Manuel"}]
        console.log(result)
        if(result.fecha > Date.now()){
          let fecha = new Date(result.fecha)
          this.tiempo = fecha.getDate()+"-"+(fecha.getMonth()+1)+"-"+fecha.getFullYear()+" "+fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds()
        }else{
          this.tiempo = "Cerrado";
          this.desabilitado = true;
          this.rounds = result.bracket
          if(result.bracket.length <= 1 && result.abierto && this.user.tipo_usuario >= 4)
            this.dibujarTorneo(result);
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
        textoAlert: "",
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
      borrar(){
        this.conexion.emit("borrarTorneo", this.torneo._id)
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
      dibujarTorneo(datos){
          let jugadores = datos.jugadores.slice();
          //let jugadores = [{nick: "1"},{nick: "2"},{nick: "3"},{nick: "4"},{nick: "5"},{nick: "6"},{nick: "7"}];
          let posibilidades = [4,8,16,32];
          if(!posibilidades.includes(jugadores.length)){
              $(posibilidades).each(function(indice, jugadoresCuadrante){
                if(jugadores.length < jugadoresCuadrante ){
                  while(jugadores.length != jugadoresCuadrante){
                    jugadores.push({nick: "Bye"});
                  }
                  return false;
                }
            });
          }
          let nJugadores = jugadores.length;
          let nRondas = nJugadores / 2.0;
          let nCols = nRondas / 2;
          let rondas = [];
          for(let columna = 0; columna <= nCols; columna++){
            let filas = parseInt(nRondas / (columna+1));
            let juegosRonda = [];
            for(let i = 0; i<filas; i++){
              let partida = {fila: i};
              if(jugadores.length > 0){
                let jugador = jugadores.shift();
                partida.player1 = { id: jugador.nick, name: jugador.nick, fila: i, columna: columna, player: 1, mostrarBoton: true };
                jugador = jugadores.shift();
                partida.player2 = { id: jugador.nick, name: jugador.nick, fila: i, columna: columna, player: 2, mostrarBoton: true };
              }
              else{
                partida.player1 = { id: parseInt(Math.random()*100), name: " ", fila: i, columna: columna, player: 1, mostrarBoton: false };
                partida.player2 = { id: parseInt(Math.random()*100), name: " ", fila: i, columna: columna, player: 2, mostrarBoton: false };
              }
              juegosRonda.push(partida);
            }
            rondas.push({ columna: columna, games: juegosRonda });
          }
          this.rounds = rondas;
          this.conexion.emit("actualizarTorneo", {id:this.torneo._id,bracket:this.rounds});
        },
        ganador(player){
          console.log(player.player.fila, player.player.columna)
          let fila = player.player.fila;
          let columna = player.player.columna;
          let nuevaFila = Math.trunc(fila/2);
          let jugador = fila%2 == 0 ? 1 : 2;
          let nuevaColumna = columna+1;
          console.log(nuevaFila, nuevaColumna);
          if(jugador == 1){
            this.rounds[nuevaColumna].games[nuevaFila].player1.name = player.player.name;
            this.rounds[nuevaColumna].games[nuevaFila].player1.id = player.player.name;
          }
          else{
            this.rounds[nuevaColumna].games[nuevaFila].player2.name = player.player.name;
            this.rounds[nuevaColumna].games[nuevaFila].player2.id = player.player.name;
          }
          this.rounds[columna].games[fila].player1.mostrarBoton = false;
          this.rounds[columna].games[fila].player2.mostrarBoton = false;
          if(jugador != 1){
            this.rounds[columna].games[fila].player1.winner = true;
            this.rounds[columna].games[fila].player2.winner = false;
          }
          else{
            this.rounds[columna].games[fila].player1.winner = false;
            this.rounds[columna].games[fila].player2.winner = true;
          }


          if((this.rounds[nuevaColumna].games[nuevaFila].player1.name != " ") && (this.rounds[nuevaColumna].games[nuevaFila].player2.name != " ") && this.rounds.length != nuevaColumna+1){
            this.rounds[nuevaColumna].games[nuevaFila].player2.mostrarBoton = true;
            this.rounds[nuevaColumna].games[nuevaFila].player1.mostrarBoton = true;
          }
          this.conexion.emit("actualizarTorneo", {id:this.torneo._id,bracket:this.rounds});
        }
    },
    computed: {
      cssVars() {
        return {
          '--bg-img': "url(http://localhost:3000/img/torneos/"+this.torneo.img+")",
        }
      },
      datosTorneo() {
        return this.torneo;
      },
      nJugadores(){
        if(this.torneo.jugadores){
          return this.torneo.jugadores.length;
        }
        else{
          return 0;
        }
      }
    },
}


</script>

<style scoped lang="css">
  .vtb-item-players{
    min-width:100px!important;
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
