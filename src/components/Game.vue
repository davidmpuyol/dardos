<template>
  <md-app>
      <md-app-content>
        <div class="md-layout d-flex flex-column flex-nowrap justify-content-between" id="aplicacion">
          <div class="md-layout-item md-size-100 h-15">
            <div class="md-layout h-100">
              <div v-bind:class="{ sombreado: turno }" class="md-layout-item md-size-40 md-layout">
                <div class="md-layout md-layout-item md-size-30 d-flex flex-column justify-content-around centrado flex-nowrap">
                  <span><b>Media: {{miMedia}}</b></span>
                </div>
                <div class="md-layout-item md-size-70 d-flex flex-column align-items-center justify-content-around">
                  <span class="md-size-100 centrado">{{ usuario }}</span>
                  <span class="md-display-3 puntuacion" id="marcador">{{misPuntos}}</span>
                </div><!--
                <md-list class="lista">
                  <md-list-item v-for="tirada in partida.local.tiradas" :key="tirada">
                    <div class="md-list-item-text puntuacion md-subheading">
                      {{tirada}}
                    </div>
                  </md-list-item>
                </md-list>-->
              </div>
              <div class="md-layout-item md-size-20 md-layout">
                <span class="md-layout-item md-size-100 md-display-1 centrado">{{ miMarcador }} - {{ marcadorContrincante }}</span>
                <div class="md-layout-item md-size-100 md-layout">
                    <div class="md-layout-item md-size-60 md-small-size-100 divInput">
                        <input type="text" :disabled="!turno" v-on:keyup.enter="enter" v-model="input" id="inputPuntos" placeholder="Introduce tu puntuación" autofocus>
                    </div>
                    <div class="md-layout-item md-size-40 md-small-size-100 divInput">
                      <md-button @click="enviarPuntuacion" :disabled="validar" class="md-raised md-primary" id="botonPuntos">Enviar</md-button>
                    </div>
                  </div>
              </div>
              <div v-bind:class="{ sombreado: !turno }" class="md-layout-item md-size-40 md-layout">
                <div class="md-layout md-layout-item md-size-70 d-flex flex-column align-items-center justify-content-around">
                  <span class="md-size-100 centrado">{{contrincante}}</span>
                  <span class="md-display-3 puntuacion" id="marcador">{{puntosContrincante}}</span>
                </div>
                <div class="md-layout md-layout-item md-size-30 d-flex flex-column justify-content-around centrado flex-nowrap">
                  <span class="centrado"><b>Media: {{mediaContrincante}}</b></span>
                </div>
                <!--
                <md-list class="lista">                 
                  <md-list-item v-for="tirada in partida.visitante.tiradas" :key="tirada">
                    <div class="md-list-item-text puntuacion md-subheading">
                      {{tirada}}
                    </div>
                  </md-list-item>
                </md-list>
                -->
              </div>
            </div>
          </div>
          <div class="md-layout-item md-size-100 flex-fill h-85 md-elevation-5" id="divCamaras">
            <video id="remote"  autoplay>
            </video>
            <video id="local" class="md-elevation-5" autoplay muted></video>
          </div>
          <!--Modal para elegir las partidas -->
          <div class="modal fade modal-datos" id="modalDatosPartida" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content p-2">
                  <div class="modal-header mb-2">
                    <h1 class="modal-title">Ajustes de juego</h1>
                  </div>
                  <div class="modal-body">
                    <form action="" method="post" v-on:submit.prevent='enviarDatosPartida()'>
                      <div class="form-group">
                        <label for="nPartidas">Nº de partidas</label>
                        <select class="form-control" name="nPartidas" id="nPartidas">
                          <option>1</option>
                          <option>3</option>
                          <option>5</option>
                          <option>7</option>
                          <option>9</option>
                        </select>
                        <div class="form-group">
                          <label for="jugadorSalida">¿Qué Jugador sale?</label>
                          <select class="form-control" name="jugadorSalida" id="jugadorSalida">
                            <option id="selectSalida1"></option>
                            <option id="selectSalida2"></option>
                          </select>
                        </div>
                      </div>
                      <div class="d-flex align-items-center justify-content-between">
                        <button type="submit" class="btn btn-primary">Enviar</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <!-- Modal fin del juego -->
              <div class="modal fade modal-datos" id="modalFinDelJuego" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content p-2">
                  <div class="modal-header mb-2">
                    <h1 class="modal-title">Fin del Juego!</h1>
                  </div>
                  <div class="modal-body">
                      <div class="row">
                        <div class="col-12 d-flex align-items-center justify-content-center">
                          <span class="md-layout-item md-size-100 md-display-1 centrado">{{ miMarcador }} - {{ marcadorContrincante }}</span>
                        </div>
                        <div class="col-6 d-flex justify-content-center">
                          <div class="row">
                              <div class="col-12">
                                <h3 class="centrado">{{ usuario }}</h3>
                                <span class="centrado"><b>Media: {{ miMedia }}</b></span>
                              </div>
                          </div>
                        </div>
                        <div class="col-6 d-flex justify-content-center">
                           <div class="row">
                              <div class="col-12">
                                <h3 class="centrado">{{ contrincante }}</h3>
                                <span class="centrado"><b>Media: {{ mediaContrincante }}</b></span>
                              </div>
                          </div>
                        </div>
                      </div>
                      <div class="d-flex align-items-center justify-content-between">
                        <button @click="salir()" type="submit" class="btn btn-primary">Salir</button>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </md-app-content>
  </md-app>
</template>

<script>
import io from 'socket.io-client';
import adapter from 'webrtc-adapter';
import JQuery from 'jquery';
let $ = JQuery;
export default {
  name: 'Game',
  props: ['conexion','user'],
  mounted () {
    this.usuario = this.$route.query.id || "Jugador 1";
    this.contrincante = this.$route.query.contrincante || "Jugador 2";

    this.socket.emit('paginaJuego', this.$route.query.id);

    this.localVideo = document.getElementById('local');
    this.remoteVideo = document.getElementById('remote');

    this.remoteStream = new MediaStream();

    this.remoteVideo.srcObject = this.remoteStream;
    this.pc = new RTCPeerConnection(this.pcConf);

    this.pc.iceTransportPolicy = "relay";

    this.pc.ontrack = async (event) =>{
      this.remoteStream.addTrack(event.track, this.remoteStream);
    }
    
    this.pc.onicecandidate = (event) =>{
      if(event.candidate){
        this.socket.emit('candidate', event.candidate,this.contrincante);
      }
    };
    $('#selectSalida1').html(this.usuario);
    $('#selectSalida2').html(this.contrincante);
    /*
    this.pc.ontrack = (event) => {
      //if (remoteVideo.srcObject) return;
      console.log('tracks recibidos');
      console.log(event);
      remoteVideo.srcObject = event.streams[0];
    }
    */
    //SOCKETS PARA INICIAR LA VIDEOLLAMADA
    this.socket.on('preparado',async ()=>{
      try{
        await this.pc.setLocalDescription(await this.pc.createOffer())
        this.socket.emit('offer',this.pc.localDescription,this.contrincante);
      }
      catch(err){
        console.log('Error: '+err)
      }
    })

    this.socket.on('AjustarPartida', ()=>{
      this.modalOpcionesPartida();
    })

    this.socket.on('offer',async (description)=>{
      await this.pc.setRemoteDescription(description)
      .then(() => this.pc.createAnswer())
      .then(sdp => this.pc.setLocalDescription(sdp))
      .then(()=>{
        this.socket.emit('answer', this.pc.localDescription,this.contrincante);
      });
    })
    this.socket.on('candidate', (candidate)=>{
      this.pc.addIceCandidate(new RTCIceCandidate(candidate))
      .catch(e => console.error(e));
    });
    this.socket.on('answer', (description)=>{
      this.pc.setRemoteDescription(description);
      this.modalOpcionesPartida();
      //this.socket.emit('comenzarPartida',this.usuario, this.contrincante);
    });
    //SOCKETS PARA JUGAR
    this.socket.on('comenzarPartida',(datos)=>{
      console.log(datos);
      this.partida = datos;
      if(this.partida.turno == this.id){
        document.getElementById("inputPuntos").focus();
      }
    })

    this.socket.on('ganador',(ganador)=>{
      console.log('ganador');
      this.marcador[ganador]++;
    })

    this.socket.on('tirada',(datos)=>{
      this.partida = datos;
      if(this.partida.turno == this.id){
        document.getElementById("inputPuntos").focus();
      }
    })
    this.socket.on('findeljuego', (datos)=>{
      this.partida = datos;
      console.log('Fin del juego');
      $('#modalFinDelJuego').appendTo('body').modal('show');
    })
    this.getUserMediaDevices();
    //this.socket.emit('preparado',this.contrincante);
  },
  data () {
    return {
      socket: this.conexion,
      usuario: null,
      pc: null,
      localVideo: null,
      remoteVideo: null,
      localStream: null,
      remoteStream: null,
      contrincante: null,
      partida: {
        local: {
          puntos: 501,
          nDardos: 0,
          media: 0
        },
        visitante: {
          puntos: 501,
          nDardos: 0,
          media: 0
        },
        turno: null,
      },
      marcador:{
        local: 0,
        visitante: 0
      },
      input: null,
      id: null,
      constraints: {
        audio: true,
        video: true
      },
      pcConf: {
        'iceServers': [{
          urls: "stun:stun.l.google.com:19302"
        },
        {
          urls: "turn:168.63.17.113:3478",
          username: "davidmpuyol",
          credential: "davidmpuyol"
        }
        ],
      },
      gettingUserMedia: false
    }
  },
  methods: {
    salir(){
      window.close();
    },
    enviarPuntuacion(){
      let datos = {
        puntos: parseInt(this.input),
        dardos: 3,
        idPartida: this.partida.idPartida,
      }
      console.log(datos);
      this.socket.emit('tirada',datos, this.usuario, this.contrincante);
      this.input = null;
    },
    async getUserMediaDevices(){
      //if (this.localVideo instanceof HTMLVideoElement) {
        /*if (this.localVideo.srcObject) {
          this.getUserMediaSuccess(this.localVideo.srcObject);
          this.gettingUserMedia = false;
        } else if (!this.gettingUserMedia && !localVideo.srcObject) {*/
          this.gettingUserMedia = true;
          await navigator.mediaDevices.getUserMedia(this.constraints)
          .then(this.getUserMediaSuccess)
          .catch(this.getUserMediaError);
        //}
      //}
    },
    modalOpcionesPartida(){
      $('#modalDatosPartida').appendTo('body').modal('show');
    },
    enviarDatosPartida(){
      let usuarioSalida = document.getElementById('jugadorSalida').value;
      let nPartidas = document.getElementById('nPartidas').value;
      $('#modalDatosPartida').modal('hide');
      this.socket.emit('comenzarPartida',this.usuario, this.contrincante, {nPartidas: nPartidas, salida: usuarioSalida});
    },
    getUserMediaSuccess(stream){
      this.localStream = stream;
      this.gettingUserMedia = false;
      stream.getTracks().forEach(track => {
          this.pc.addTrack(track, stream);
      });
      this.localVideo.srcObject = stream;
      /*
      if (this.localVideo instanceof HTMLVideoElement) {
        !this.localVideo.srcObject && (localVideo.srcObject = stream);
      }*/
      this.socket.emit('preparado',this.contrincante);
    },
    getUserMediaError(error){
      console.error(error);
      this.gettingUserMedia = false;
    },
    enter(){
      if(!this.validar){
        this.enviarPuntuacion();
      }
    }
  },
  computed: {
    validar(){
      if(!this.input){
        return true;
      }
      if(!this.input.match(/^[0-9]*$/)){
        return true;
      }
      let puntos = parseInt(this.input);
      if(puntos < 0 || puntos > 180 || puntos > this.partida[this.partida.turno].puntos){
        return true;
      }
      return false;
    },
    turno(){
      return (this.partida.turno) ? this.usuario != this.partida.turno ? false : true : true;
    },
    textoTurno(){
      return (this.partida.turno) ? this.usuario==this.partida.turno ? "Es tu turno, introduce tu puntuación" : "Espera a que el oponente tire" : "cargando";
    },
    miMedia(){
      if(this.partida[this.usuario]){
        return this.partida[this.usuario].media
      }
      else{
        return 0;
      }
    },
    mediaContrincante(){
      if(this.partida[this.contrincante]){
        return this.partida[this.contrincante].media
      }
      else{
        return 0;
      }
    },
    misPuntos(){
      if(this.partida[this.usuario]){
        return this.partida[this.usuario].puntos
      }
      else{
        return 501;
      }
    },
    puntosContrincante(){
      if(this.partida[this.contrincante]){
        return this.partida[this.contrincante].puntos
      }
      else{
        return 501;
      }
    },
    miMarcador(){
      if(this.partida[this.usuario]){
        return this.partida[this.usuario].marcador
      }
      else{
        return 0;
      }
    },
    marcadorContrincante(){
      if(this.partida[this.contrincante]){
        return this.partida[this.contrincante].marcador
      }
      else{
        return 0;
      }
    }

    
  }
}
</script>

<style scoped>
  .md-app-content{
    padding:0;
  }
  .puntuacion{
    display: flex;
    justify-content:center;
    border:0;
    margin:0;
  }/*
  .lista{
    max-height:200px;
    overflow-y: auto;
  }
  */
  #aplicacion{
    height:100vh;
    padding-top:0;
    padding-bottom: 0;
  }
  .sombreado{
    background-color: gray;
  }
  .divInput{
    margin-top: 1px;
  }
  #inputPuntos{
    padding:0;
    width:100%;
    height:100%;
  }
  #botonPuntos{
    height:100%;
    width: 100%;
    margin:0;
  }
  .h-85{
    height: 85%;
  }
  .h-15{
    height: 15%;
    max-height:150px;
  }
  .centrado{
    text-align:center;
  }
/*
  #estadisticas{
    height: 26%;
    color: black!important;
  }*/
  #remote{
    width:100%;
    height:100%;
  }
  #local{
    position:fixed;
    right:0;
    bottom:0;
    width: 25%;
    height:25%;
    max-height:300px;
  }
  .lista::-webkit-scrollbar { width: 0 !important }
  .lista { overflow: -moz-scrollbars-none; }
</style>