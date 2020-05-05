<template lang="html">

  <section class="perfil">
    <div v-if="this.cargado" class="row">
      <section id="datosUser" class="col-4 sombraInset">
        <div id="fotoUser" class="borde-animado-perfil sombra mb-2">
          <img :src="this.userImage" class="imgPerfil">
        </div>
        <h3 class="w-100 text-center">{{ nick }}</h3>
        <div id="statsResumidas" class="d-flex flex-column">
          <div id="victoriasStats" class="d-flex align-items-center justify-content-around">
            <img src="http://localhost:3000/imgApp/victorias.png" class="iconosPerfil" title="Victorias">
            <p class="parrafosStats m-0">{{datosUsuario.nVictorias}}</p>
          </div>
          <div id="derrotasStats" class="d-flex align-items-center justify-content-around">
            <img src="http://localhost:3000/imgApp/derrotas.png" class="iconosPerfil" title="Derrotas">
            <p class="parrafosStats m-0">{{datosUsuario.nDerrotas}}</p>
          </div>
        </div>
      </section>
      <section id="graficosEstadisticas" class="col-8 overflow-auto">
        <h2 class="text-center">Total partidas jugadas</h2>
        <p class="parrafosStats text-center">{{ datosUsuario.nPartidas }}</p>
        <h2 class="text-center">Ultimas partidas</h2>

      </section>
    </div>
    <div v-else>

    </div>
  </section>

</template>

<script lang="js">

  export default  {
    name: 'perfil',
    props: ['nick','conexion'],
    mounted () {
      this.conexion.on('respDatosPerfil',(respuesta)=>{
        this.datosUsuario = respuesta
        console.log(this.datosUsuario)
        if(respuesta.error){
          this.cargado = false
        } else {
          this.cargado=true
        }
      })
      console.log(this.nick)
      this.conexion.emit('solicitarDatosPerfil',this.nick)
    },
    data () {
      return {
        cargado:false,
        datosUsuario: {img:"null"}
      }
    },
    methods: {

    },
    computed: {
      userImage:function(){
          //Crea la url de la imagen del usuario
          return "http://localhost:3000/usersIcon/"+this.datosUsuario.img
      }
    }
}


</script>

<style scoped lang="css">
  .perfil {

  }
  .parrafosStats{
    font-size: 2em;
  }
  #datosUser{
    background-color: #decbb7;
    min-height: 89.5vh;
    border-right: 10px solid #1c2321;
  }
  #graficosEstadisticas{
    background-color: #8f857d;
    min-height: 89.5vh;
  }
  .iconosPerfil{
    height: auto;
    width: 25%;
  }
  .imgPerfil{
    height: 100%;
    width: 100%;
  }
  .borde-animado-perfil {
    width: 80%;
    height: auto;
    margin: 10%;
    border-width: 15px 15px; /* Ancho de los bordes */
    border-radius: 10px; /* Bordes redondeados */
  }
  @keyframes borde-animado-perfil-an{
    0% {
      border-color: #e0fbfc;
      border-left-color: #a1fcff;
      border-top-color: #80fbff;
    }

    25% {
      border-color: #e0fbfc;
      border-top-color: #a1fcff;
      border-right-color: #80fbff;
    }

    50% {
      border-color: #e0fbfc;
      border-right-color: #a1fcff;
      border-bottom-color: #80fbff;
    }

    75% {
      border-color: #e0fbfc;
      border-bottom-color: #a1fcff;
      border-left-color: #80fbff;
    }

    100% {
      border-color: #e0fbfc;
      border-left-color: #a1fcff;
      border-top-color: #80fbff;
    }
  }

  .borde-animado-perfil {
    border: 15px solid #e0fbfc;
  }
  .borde-animado-perfil {
  animation: borde-animado-perfil-an 750ms linear infinite;
  }
</style>
