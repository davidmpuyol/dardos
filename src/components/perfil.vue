<template lang="html">

  <section class="perfil">
    <div v-if="this.cargado" class="row m-0">
      <section id="datosUser" class="col-12 col-sm-4 sombraInset d-flex align-items-center flex-column p-0">
        <div id="fotoUser" class="borde-animado-perfil sombra mb-2">
          <img :src="this.userImage" class="imgPerfil">
        </div>
        <h3 class="w-100 text-center">{{ nick }}</h3>
        <md-button class="md-raised b-0" @click="this.abrirModal" v-if="user.nick == nick">Editar perfil</md-button>
        <div id="statsResumidas" class="d-flex flex-column w-75">
          <div id="victoriasStats" class="d-flex align-items-center justify-content-around">
            <img src="../assets/victorias.png" class="iconosPerfil" title="Victorias">
            <p class="parrafosStats m-0">{{datosUsuario.nVictorias}}</p>
          </div>
          <div id="derrotasStats" class="d-flex align-items-center justify-content-around">
            <img src="../assets/derrotas.png" class="iconosPerfil" title="Derrotas">
            <p class="parrafosStats m-0">{{datosUsuario.nDerrotas}}</p>
          </div>
          <div id="derrotasStats" class="d-flex align-items-center justify-content-around">
            <p class="parrafosStats porcentaje m-0">%</p>
            <p class="parrafosStats m-0">{{parseFloat(datosUsuario.porcentajeVictorias).toFixed(2)}}%</p>
          </div>
        </div>
      </section>
      <section id="graficosEstadisticas" class="col-12 col-sm-8 overflow-auto sombraInsetComp p-3">
        <h2 class="text-center">Total partidas jugadas</h2>
        <p class="parrafosStats text-center">{{ datosUsuario.nPartidas }}</p>
        <!--
        <h2 class="text-center">Media de puntos</h2>
        <p class="parrafosStats text-center">{{ datosUsuario.media }}</p> -->
        <h2 class="text-center">Ultimas partidas</h2>
        <md-list>
          <md-list-item v-for="(partida,index) in this.partidasOrdenadas">
            <span class="md-list-item-text">{{$moment(partida.fecha).format("YYYY-MM-DD h:mm a")}}</span>
            <md-button class="md-icon-button md-list-action mr-0"  v-on:click="verDetallePartida(index)">
              <md-icon>analytics</md-icon>
            </md-button>
          </md-list-item>
        </md-list>
      </section>
    </div>
    <div v-else>
      <p class="text-center">No se encontro el perfil >:( </p>
    </div>
    <div class="modal fade modal-detalle" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header mb-2">
            <h1 class="modal-title">Detalle</h1>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">x</button>
          </div>
          <div class="modal-body">
            <h2>{{jugadoresPartida[0]}} VS {{jugadoresPartida[1]}}</h2>
            <p><strong>Ganador/a:</strong> {{ganadorDetallePartida}}</p>
            <p><strong>Numero de partidas:</strong> {{numeroPartidasDetalle}}</p>
           <div id="chart">
            <apexchart ref="barchart" type="line" height="350" width="100%" :key="renderGrafico" :options="chartOptions" :series="series"></apexchart>
          </div>
          </div>  
        </div>
      </div>
    </div>
    <div class="modal fade modal-perfil" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" v-if="user.nick == nick">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header mb-2">
            <h1 class="modal-title">Cambiar Datos</h1>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">x</button>
          </div>
          <div class="modal-body">
            <form action="" method="post" v-on:submit.prevent='cambiarDatos()'>
              <div class="form-group">
                  <label for="nick">Nick</label>
                  <input type="text" class="form-control" id="nick" name="text" placeholder="Introduce tu nuevo nick" v-model:value="modalNick" required>
                </div>
                <div class="form-group">
                  <label for="siofu_input">Cambiar imagen perfil</label><br/>
                  <input type="file" class="inputTexto" id="siofu_input" /> <i :class="iconoSubirArchivo"></i>
                </div>
                <div class="form-group">
                  <input type="password" class="form-control" id="nick" name="text" placeholder="Introduce tu contraseña para validar" v-model:value="pass" required>
                </div>
                <div class="alert " role="alert">
                  {{textoAlert}}
                </div>
                <button type="submit" :class="cambioDatosListo">Enviar</button>
            </form>
          </div>  
        </div>
      </div>
    </div>
  </section>

</template>

<script lang="js">
import SocketIOFileUpload from '../../node_modules/socketio-file-upload/client.js';
  export default  {
    name: 'perfil',
    props: ['nick','conexion','user'],
    mounted () {
      //Prepara el sistema para subir la imagen si modifica sus datos
      //Solo se ejecuta cuando el perfil que se esta visitando es el del mismo usuario
      if(this.user.nick == this.nick){
        var uploader = new SocketIOFileUpload(this.conexion);
        uploader.listenOnInput(document.getElementById("siofu_input"));
        //Añade metadatos necesarios en el servidor para colocar la imagen en su sitio y ponerle el nombre correspondiente
        uploader.addEventListener("start", (event) => {
            this.subeImagen = true;
            let extension = "."+event.file.name.split(".")[1]
            event.file.meta.path = "/usuarios/"+this.user.nick+extension;
            event.file.meta.nombre = this.user.nick+extension;
            this.iconoSubirArchivo = "far fa-times-circle text-danger"
            console.log(event)
        });
        this.conexion.on("imagenSubida",(nombre)=>{
          this.nuevaImagen = nombre;
          this.subida = true
          this.iconoSubirArchivo = "fas fa-check-circle text-success"
        })
        this.conexion.on('respuestaCambioDatos',(result) => {
          if(result[1]){
            this.mostrarAlerta(result[1],"alert-success");
            this.pass = "";
            setTimeout(() => {
              $('.modal-perfil').modal("hide");
              this.$router.push("/")
            }, 1000);
          } else {
            this.mostrarAlerta(result[0],"alert-danger")
          }
        })
      }
      this.conexion.on('respDatosPerfil',(respuesta)=>{
        this.datosUsuario = respuesta
        console.log(this.datosUsuario)
        if(respuesta.error){
          this.cargado = false
        } else {
          this.cargado = true
        }
      })
      this.conexion.on('respuestaPartidas',(respuesta)=>{
        console.log("han llegado las partidas")
        console.log(respuesta)
        this.partidas = respuesta
      })
      this.conexion.on('repuestaNicksUsuarios',(respuesta)=>{
        //Una vez han llegado los nick de la partida crea el detalle de esta
        console.log("ha llegado el nick de los jugadores")
        console.log(respuesta)
        if(respuesta[0]._id==this.partidas[this.indexDetalle].jugadores[0]){
          this.$set(this.jugadoresPartida,0,respuesta[0].nick)
          this.$set(this.jugadoresPartida,1,respuesta[1].nick)
        }else{
          this.$set(this.jugadoresPartida,0,respuesta[1].nick)
          this.$set(this.jugadoresPartida,1,respuesta[0].nick)
        }
        this.crearDetallePartida(this.indexDetalle)
      })
      this.conexion.emit('obtenerPartidas',this.nick)
      console.log(this.nick)
      this.conexion.emit('solicitarDatosPerfil',this.nick)
    },
    beforeDestroy(){
      this.conexion.off("respDatosPerfil")
      this.conexion.off("respuestaPartidas")
      this.conexion.off("repuestaNicksUsuarios")
    },
    data () {
      return {
        cargado:false,
        datosUsuario: {img:"null"},
        modalNick: this.nick,
        iconoSubirArchivo: "",
        subeImagen: false,
        subida: false,
        nuevaImagen : "",
        pass:"",
        textoAlert:"",
        renderGrafico:0,
        partidas:[],
        indexDetalle:0,
        ganadorDetallePartida: "",
        numeroPartidasDetalle: 0,
        jugadoresPartida : ['jugador1','jugador2'],
        series: [{
            name: 'Media de puntos',
            type: 'column',
            data: []
          }, {
            name: 'Rondas Ganadas',
            type: 'line',
            data: []
          }],
        chartOptions: {
          chart: {
            type: 'line',
            height: 350,
            width: "100%",
            redrawOnParentResize: true
          },
          plotOptions: {
            bar: {
              horizontal: false,
            }
          },
          dataLabels: {
            enabled: true
          },
          labels: [],
          xaxis: {
            categories: [

            ],
          }
        }
      }
    },
    methods: {
      abrirModal(){
        $('.modal-perfil').modal("show");
      },
      cambiarDatos(){
         let datos = {};
         datos.nick = this.user.nick
         datos.nuevoNick=this.modalNick
         datos.img = this.nuevaImagen
         datos.pass = this.pass
         this.conexion.emit("cambiarDatosPerfil", datos)
      },
       mostrarAlerta(texto,clase){
        $(".alert").addClass(clase)
        this.textoAlert = texto
        $(".alert").show(500)
        setTimeout(() => {
          $(".alert").hide(500)
        }, 3000);
      },
      verDetallePartida(index){
        //Envia el evento para obtener el nombre de los jugadores y pone el index de la partida seleccionada en la variable indexDetalle
        this.conexion.emit("obtenerUsuarios",this.partidas[index].jugadores)
        this.indexDetalle = index
      },
      crearDetallePartida(index){
        console.log(this.partidas[index].puntuacion[0].rondasGanadas)
        $('.modal-detalle').modal("show");
        this.series[0].data = []
        this.series[1].data = []
        this.chartOptions.labels = []
        this.series[0].data.push(this.partidas[index].puntuacion[0].media)
        this.series[0].data.push(this.partidas[index].puntuacion[1].media)
        this.series[1].data.push(this.partidas[index].puntuacion[0].rondasGanadas)
        this.series[1].data.push(this.partidas[index].puntuacion[1].rondasGanadas)
        this.chartOptions.labels.push(this.jugadoresPartida[0])
        this.chartOptions.labels.push(this.jugadoresPartida[1])
        this.partidas[index].jugadores.forEach((id,indexJugador) => {
          if(id == this.partidas[index].ganador)
            this.ganadorDetallePartida = this.jugadoresPartida[indexJugador]
        });
        this.numeroPartidasDetalle = this.partidas[index].numero_partidas
        //this.$refs.barchart.updateOptions(this.chartOptions)
        //this.$refs.barchart.updateSeries(this.series)
        this.renderGrafico++
        //Esto se hace para solventar un bug visual que hace que no se muestre el grafico la segunda vez que se abre
        $('.modal-body').addClass("recargarModal");
        setTimeout(() => {
          $('.modal-body').removeClass("recargarModal");
        }, 200);
      }
    },
    computed: {
      userImage:function(){
          //Crea la url de la imagen del usuario
          //return "http://localhost:3000/img/usuarios/"+this.datosUsuario.img
          return "./img/usuarios/"+this.datosUsuario.img
      },
      cambioDatosListo(){
        if(this.subeImagen)
          if(!this.subida)
            return "btn btn-primary disabled"
        return "btn btn-primary"
      },
      partidasOrdenadas(){
        if(this.partidas.length > 1)
          return this.partidas.sort(function(a,b) {
              var x = a.fecha;
              var y = b.fecha;
              return x < y ? -1 : x > y ? 1 : 0;
          });
        else
          return this.partidas
      }
    }
}


</script>

<style scoped lang="css">
  .perfil {

  }
  .parrafosStats{
    font-size: 4em;
  }
  #datosUser{
    background-color: #BABFD1;
    min-height: 89.5vh;
    border:1px solid rgba(186, 191, 209, 0.507);
  }
  #graficosEstadisticas{
    background-color: #e0fbfc;
    min-height: 89.5vh;
  }
  .iconosPerfil{
    height: 80px;
    width: 80px;
  }
  .imgPerfil{
    width: 200px;
    height: 170px;
  }
  .disabled{
    pointer-events: none;
  }
  .borde-animado-perfil {
    width: 200px;
    height: 200px;
    margin-top: 10%;
    border-width: 15px 15px; /* Ancho de los bordes */
    border-radius: 10px; /* Bordes redondeados */
  }
  .recargarModal{
    width: 90% !important;
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
  .porcentaje{
    font-size: 5em;
    font-weight: 900;
  }
</style>
