<template>
  <md-app>
      <md-app-content>
        <div class="md-layout d-flex flex-column flex-nowrap justify-content-between" id="aplicacion">
          <div class="md-layout-item md-size-100 h-15">
            <div class="md-layout h-100">
              <div v-bind:class="{ sombreado: turno }" class="md-layout-item md-size-40 md-layout">
                <div class="md-layout md-layout-item md-size-30 d-flex flex-column justify-content-around centrado flex-nowrap">
                  <span><b>Media: {{partida.local.media}}</b></span>
                </div>
                <div class="md-layout-item md-size-70 d-flex flex-column align-items-center justify-content-around">
                  <span class="md-size-100 centrado">{{ usuario }}</span>
                  <span class="md-display-3 puntuacion" id="marcador">{{partida.local.puntos}}</span>
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
                <span class="md-layout-item md-size-100 md-display-1 centrado">{{marcador.local}} - {{marcador.visitante}}</span>
                <div class="md-layout-item md-size-100 md-layout">
                    <div class="md-layout-item md-size-60 md-small-size-100 divInput">
                        <input type="text" :disabled="turno" v-on:keyup.enter="enter" v-model="input" id="inputPuntos" placeholder="Introduce tu puntuación" autofocus>
                    </div>
                    <div class="md-layout-item md-size-40 md-small-size-100 divInput">
                      <md-button @click="enviarPuntuacion" :disabled="validar" class="md-raised md-primary" id="botonPuntos">Enviar</md-button>
                    </div>
                  </div>
              </div>
              <div v-bind:class="{ sombreado: !turno }" class="md-layout-item md-size-40 md-layout">
                <div class="md-layout md-layout-item md-size-70 d-flex flex-column align-items-center justify-content-around">
                  <span class="md-size-100 centrado">{{contrincante}}</span>
                  <span class="md-display-3 puntuacion" id="marcador">{{partida.visitante.puntos}}</span>
                </div>
                <div class="md-layout md-layout-item md-size-30 d-flex flex-column justify-content-around centrado flex-nowrap">
                  <span class="centrado"><b>Media: {{partida.visitante.media}}</b></span>
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
          </div>
      </md-app-content>
  </md-app>
</template>

<script>
import io from 'socket.io-client';
import adapter from 'webrtc-adapter';
export default {
  name: 'Game',
  props: ['conexion','user'],
  mounted () {
    this.usuario = this.$route.query.id || "Jugador 1";
    console.log(navigator.mediaDevices.enumerateDevices());
    this.socket.emit('paginaJuego', this.$route.query.id);
    this.contrincante = this.$route.query.contrincante || "Jugador 2";
    console.log(this.usuario, this.contrincante);
    var localVideo = document.getElementById('local');
    //SOCKETS PARA INICIAR LA VIDEOLLAMADA
    this.socket.on('preparado',()=>{
      console.log('preparado recibido');
      this.pc = new RTCPeerConnection(this.pcConf);
      this.pc.addStream(localVideo.srcObject);
      this.pc.createOffer()
      .then(offer => this.pc.setLocalDescription(offer))
      .then(()=>{
        console.log('offer');
        this.socket.emit('offer',this.pc.localDescription,this.contrincante);
      })
      this.pc.ontrack = (event) => {
        document.getElementById('remote').srcObject = event.streams[0];
      }
      this.id="local";
    })
    this.socket.on('offer',(description)=>{
      this.pc = new RTCPeerConnection(this.pcConf);
      this.pc.addStream(localVideo.srcObject);
      this.pc.setRemoteDescription(description)
      .then(() => this.pc.createAnswer())
      .then(sdp => this.pc.setLocalDescription(sdp))
      .then(()=>{
        this.socket.emit('answer', this.pc.localDescription,this.contrincante);
      });
      this.pc.ontrack = (event) => {
        document.getElementById('remote').srcObject = event.streams[0];
      }
      this.pc.onicecandidate = (event) =>{
        if (event.candidate) {
          this.socket.emit('candidate', event.candidate,this.contrincante);
        }
      };
      this.id="visitante";
    })
    this.socket.on('candidate', (candidate)=>{
      this.pc.addIceCandidate(new RTCIceCandidate(candidate))
      .catch(e => console.error(e));
    });
    this.socket.on('answer', (description)=>{
      this.pc.setRemoteDescription(description);
      this.socket.emit('comenzarPartida',this.usuario, this.contrincante);
    });
    //SOCKETS PARA JUGAR
    this.socket.on('comenzarPartida',(datos)=>{
      console.log('comenzar partida', this.usuario, this.contrincante);
      this.partida = datos;
      if(this.partida.turno == this.id){
        document.getElementById("inputPuntos").focus();
      }
    })
    this.socket.on('ganador',(ganador)=>{
      this.marcador[ganador]++;
    })
    this.socket.on('tirada',(datos)=>{
      this.partida = datos;
      if(this.partida.turno == this.id){
        document.getElementById("inputPuntos").focus();
      }
    })
    this.getUserMediaDevices();
    //this.socket.emit('preparado',this.contrincante);
  },
  data () {
    return {
      socket: this.conexion,
      usuario: "Jugador 1",
      //socket: io('http://localhost:3000'),
      pc: null,
      contrincante: "Jugador 2",
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
          urls: "stun:168.63.17.113:3478"
        },
        {
          urls: "turn:168.63.17.113:3478",
          username: "davidmpuyol",
          credential: "davidmpuyol"
        }]
      },
      gettingUserMedia: false
    }
  },
  methods: {
    enviarPuntuacion(){
      let datos = {
        puntos: parseInt(this.input),
        dardos: 3,
        idPartida: this.partida.idPartida,
      }
      console.log(datos);
      this.socket.emit('tirada',datos);
      this.input = null;
    },
    getUserMediaDevices(){
      let localVideo = document.getElementById('local');
      if (localVideo instanceof HTMLVideoElement) {
        if (localVideo.srcObject) {
          this.getUserMediaSuccess(localVideo.srcObject);
          this.gettingUserMedia = false;
        } else if (!this.gettingUserMedia && !localVideo.srcObject) {
          this.gettingUserMedia = true;
          navigator.mediaDevices.getUserMedia(this.constraints)
          .then(this.getUserMediaSuccess)
          .catch(this.getUserMediaError);
        }
      }
    },
    getUserMediaSuccess(stream){
      let localVideo = document.getElementById('local');
      this.gettingUserMedia = false;
      //adapter.attachMediaStream(localVideo, stream);
      if (localVideo instanceof HTMLVideoElement) {
        !localVideo.srcObject && (localVideo.srcObject = stream);
      }
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
      }/*
      if(!this.miturno){
        return true;
      }*/
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
      return (this.partida.turno) ? this.id==this.partida.turno ? false : true : true;
    },
    textoTurno(){
      return (this.partida.turno) ? this.id==this.partida.turno ? "Es tu turno, introduce tu puntuación" : "Espera a que el oponente tire" : "cargando";
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
