<template>
  <md-app>
      <md-app-content id="aplicacion">
        <div class="md-layout">
          <div class="md-layout-item md-size-40">
            <div class="md-layout" id="divPuntos">
              <div class="md-layout-item md-size-50 h-80">
                <span class="md-display-4 puntuacion marcador" id="marcador1">{{partida.local.puntos}}</span>
                <h2 class="md-display-3 marcadorlocal">{{marcador.local}}</h2>
                <md-list class="lista">
                  <md-list-item v-for="tirada in partida.local.tiradas" :key="tirada">
                    <div class="md-list-item-text puntuacion md-subheading">
                      {{tirada}}
                    </div>
                  </md-list-item>
                </md-list>
              </div>
              <div class="md-layout-item md-size-50 h-80">
                <span class="md-display-4 puntuacion marcador">{{partida.visitante.puntos}}</span>
                <h2 class="md-display-3 marcadorvisitante">{{marcador.visitante}}</h2>
                <md-list class="lista">
                  <md-list-item v-for="tirada in partida.visitante.tiradas" :key="tirada">
                    <div class="md-list-item-text puntuacion md-subheading">
                      {{tirada}}
                    </div>
                  </md-list-item>
                </md-list>
              </div>
              <div class="md-layout-item md-size-100" id="estadisticas">
                <h2 class="centrado">Estadísticas</h2>
                <div class="md-layout">
                  <br>
                  <div class="md-layout-item md-size-50">
                    <h4 class="centrado"><b>Media: {{partida.local.media}}</b></h4>
                  </div>
                  <div class="md-layout-item md-size-50">
                    <h4 class="centrado"><b>Media: {{partida.visitante.media}}</b></h4>
                  </div>
                </div>
              </div>
              <div class="md-layout-item md-size-100 h-20" id="inputPuntos">
                <div class="md-layout-item md-size-100 centrado">{{textoTurno}}</div>
                <hr>
                <div class="md-layout" >
                  <div class="md-layout-item md-size-70">
                      <input type="text" :disabled="turno" v-on:keyup.enter="enter" v-model="input" id="puntuacion" class="input" placeholder="Introduce tu puntuación" autofocus>
                  </div>
                  <div class="md-layout-item md-size-30">
                    <md-button @click="enviarPuntuacion" :disabled="validar" class="md-raised md-primary enviarPuntuacion">Enviar</md-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="md-layout-item md-size-60" id="divCamaras">
            <video id="remote" class="md-elevation-5" autoplay>
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
  props: [],
  mounted () {
    var localVideo = document.getElementById('local');
    //SOCKETS PARA INICIAR LA VIDEOLLAMADA
    this.socket.on('preparado',()=>{
      this.pc = new RTCPeerConnection(this.pcConf);
      this.pc.addStream(localVideo.srcObject);
      this.pc.createOffer()
      .then(offer => this.pc.setLocalDescription(offer))
      .then(()=>{
        this.socket.emit('offer',this.pc.localDescription);
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
        this.socket.emit('answer', this.pc.localDescription);
      });
      this.pc.ontrack = (event) => {
        document.getElementById('remote').srcObject = event.streams[0];
      }
      this.pc.onicecandidate = (event) =>{
        if (event.candidate) {
          this.socket.emit('candidate', event.candidate);
        }
      };
      this.id="visitante";
    })
    this.socket.on('candidate', (candidate)=>{
      this.pc.addIceCandidate(new RTCIceCandidate(candidate))
      .catch(e => console.error(e));
      this.socket.emit('comenzarPartida');
    });
    this.socket.on('answer', (description)=>{
      this.pc.setRemoteDescription(description);
    });
    //SOCKETS PARA JUGAR
    this.socket.on('comenzarPartida',(datos)=>{
      console.log('comenzar partida');
      this.partida = datos;
      if(this.partida.turno == this.id){
        document.getElementById("puntuacion").focus();
      }
    })
    this.socket.on('ganador',(ganador)=>{
      this.marcador[ganador]++;
    })
    this.socket.on('tirada',(datos)=>{
      this.partida = datos;
      if(this.partida.turno == this.id){
        document.getElementById("puntuacion").focus();
      }
    })
    this.getUserMediaDevices();
  },
  data () {
    return {
      socket: io(),
      //socket: io('http://localhost:3000'),
      pc: null,
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
        video: { facingMode: "user" }
      },
      pcConf: {
        'iceServers': [{
          'urls': ['stun:stun.l.google.com:19302']
        }]
      },
      gettingUserMedia: false
    }
  },
  methods: {
    enviarPuntuacion(){
      let datos = {
        puntos: parseInt(this.input),
        dardos: 3
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
      if (localVideo instanceof HTMLVideoElement) {
        !localVideo.srcObject && (localVideo.srcObject = stream);
      }
      this.socket.emit('preparado');
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
  .puntuacion{
    display: flex;
    align-items: center;
    justify-content:center;
  }
  .lista{
    max-height:200px;
    overflow-y: auto;
  }
  #divCamaras{
    height: 100vh;
    padding-left: 13px;
  }
  #divPuntos{
    height: 100vh;
  }
  #aplicacion{
    padding-top:0;
    padding-bottom: 0;
  }
  .input{
    font-size: 30px!important;
    text-align: center;
    width:100%;
    overflow:hidden;
  }
  #inputPuntos{
    position: relative;
    bottom: 0;
  }
  #marcador1{
    border-right: 2px solid black;
  }
  .enviarPuntuacion{
    height: 100%;
    width: 100%;
    margin-top:0;
  }
  .marcador{
    margin-top: 20px;
  }
  #remote{
    height:100%;
    width:100%;
  }
  #local{
    height:25%;
    position: absolute;
    right:0;
    bottom:0;
  }
  .h-80{
    height: 60%;
  }
  .h-20{
    height: 10%;
  }
  .centrado{
    text-align:center;
    font-size: 20px;
    font-weight: bold;
  }
  .rojo{
    color:red;
  }
  #estadisticas{
    height: 26%;
    color: black!important;
  }
  .marcadorlocal{
    text-align: right;
    margin: 0;
    margin-right: 10px;
  }
  .marcadorvisitante{
    text-align: left;
    margin: 0;
    margin-left: 10px;
  }
  .lista::-webkit-scrollbar { width: 0 !important }
  .lista { overflow: -moz-scrollbars-none; }
</style>
