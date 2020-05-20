<template lang="html">

  <section class="detalle-torneo" :style="cssVars">
    <section id="fondotorneo" class="d-flex align-items-center justify-content-center sombraInsetComp">
      <h2 id="tituloTorneo">{{datosTorneo.nombre}}</h2>
    </section>
    <article id="datos" class="container pt-5">
      <div class="d-flex align-items-center justify-content-between">
        <p><strong>Jugadores:</strong> {{datosTorneo.jugadores.length}} / {{datosTorneo.max_jugadores}}</p>
        <md-button class="md-raised b-0" @click="this.apuntarse">Apuntarse Torneo</md-button>
      </div>
      <p><strong>Tiempo restante antes del cierre: {{tiempo}}</strong></p>
      <div class="alert " role="alert">
        {{textoAlert}}
      </div>
      <md-button class="md-raised b-0" @click="this.abrirLista">Ver Jugadores</md-button>
      <md-list id="listaJugadores" class="md-double-line border">
        <md-list-item v-for="jugador in this.datosTorneo.jugadores">
          <label>{{ jugador }}</label>
          <md-button class="ml-2 md-icon-button md-list-action" @click="$router.push({ path: `/perfil/${jugador}` })">
            <md-icon>account_circle</md-icon>
          </md-button>
        </md-list-item>
      </md-list>
    </article>
  </section>

</template>

<script lang="js">

  export default  {
    name: 'detalle-torneo',
    props: ["id","conexion","user"],
    mounted () {
      console.log(this.relojActivo)
      this.conexion.on("resultadoTorneo",(result) => {
        this.torneo = result
        if(!this.relojActivo)
          this.crearReloj()
        console.log(result)
      })
      this.conexion.on("respuestaApuntarse",(result) => {
        if(result[1]){
          $(".alert").addClass("alert-success")
          this.textoAlert = result[1]
          this.conexion.emit("detalleTorneo",this.id)
        } else {
          $(".alert").addClass("alert-danger")
          this.textoAlert = result[0]
        }
        $(".alert").show(500)
        setTimeout(() => {
          $(".alert").hide(500)
        }, 3000);
      })
      this.conexion.emit("detalleTorneo",this.id)
    },
    data () {
      return {
        torneo: {},
        textoAlert: "Texto ejemplo",
        tiempo: 0,
        relojActivo: false,
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
      crearReloj() {
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
      },
      apuntarse (){
        this.conexion.emit('apuntarseTorneo',{idTorneo:this.id,nickJugador:this.user.nick})
      }
    },
    computed: {
      cssVars() {
        return {
          '--bg-img': "url(http://localhost:3000/imgApp/"+this.torneo.img+")",
        }
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
