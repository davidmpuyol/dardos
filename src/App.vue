<template>
  <directos></directos>
</template>

<script>
//import Game from './components/Game.vue'
import paginaPrincipal from './components/paginaPrincipal.vue'
import directos from './components/directos.vue'
import JQuery from 'jquery'
  let $ = JQuery
export default {
  name: 'App',
  components: {
    paginaPrincipal,
    directos
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
html{
    background-color: #e0fbfc;
}
li p {
    word-break: break-all;
    word-wrap: break-word;
  }
.imgUser{
    height: 64px;
    width: 64px;
}
#usuarios{
    -webkit-box-shadow: inset 0px 11px 37px 0px rgba(0,0,0,0.75);
-moz-box-shadow: inset 0px 11px 37px 0px rgba(0,0,0,0.75);
box-shadow: inset 0px 11px 37px 0px rgba(0,0,0,0.75);
}
#usuarios .btn{
    width: 70px;
}
#mensajesChat{
    height: 90.6%;
}
.nombreInvitar{
    width: 90%;
}
#controlesChat{
    height: 9.4%;
}
nav{
    background-color:  #30323d;
}
h1,h2,h3,h4,h5,h6{
    font-family: 'Anton', sans-serif;
}
nav li a{
    font-size: 20px;
    font-family: 'Anton', sans-serif;
}
.btn-dark{
    background-color: #1c2321 !important;
}
.badge{
    height: 2px;
    width: 2px;
}
.mensaje-derecha{
    margin-left: 30%;
    margin-top: 5px;
    margin-right: 5px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 8px;
}
.mensaje-izquierda{
    margin-right: 30%;
    margin-top: 5px;
    margin-left: 5px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 0;
}
#listaMensajes{
    list-style: none;
    padding: 0;
}
#listaMensajes li{
    background-color:  #8f857d;

}
.texto-oscuro{
    color: black;
}
.texto-claro{
    color: white;
}
#mensajes{
    height: 100%;
    width: 60vw;
    border-right: #1c2321 solid 1px;
    background-color: #decbb7;
}
#usuarios{
    width: 40vw;
    height: 100%;
    border-left: #1c2321 solid 1px;
    margin-left: 1vh;
}
#chat{
    height: 70vh;
    border: #1c2321 solid 1px;
}
.carouselTorneos{
    height: 20vh;
}
.torneoC{
    height: 20vh !important;
    margin: 5px;
    background-color: black;
    transition: 0.5s;
}
.contenedorCarousel{
    width: 98%;
    margin-left: 1%;
}
.tituloDirecto{
    padding-bottom:0.5em ;
    border-bottom: black 1px inset;
}
.carouselDirectos .slick-slide.slick-center{
    height: 30vh !important;
    margin-top: 0em;
    transition: 0.5s;
}
.slick-center .torneoC{
    transition: 0.5s;
    height: 30vh !important;
}
.carouselDirectos .slick-slide{
    transition: 0.5s;
    margin-top: 5em;
}
.slick-slide{
    margin-left: 0.2em;
    margin-right: 0.2em;
}
.slick-next:before,.slick-prev:before{
    color: black !important;
}
.carouselDirectos .slick-track{
    display: flex !important;
    height: 30vh;
    align-items: center;
    justify-content: center;
}
.usuarioChat{
    border-bottom: black solid 2px;
}
#enviar{
    background-color:#e0fbfc ;
}
.botAnim button {
    background: none;
    border: 0;
    box-sizing: border-box;
    margin: 1em;
    padding: 1em 2em;
    box-shadow: inset 0 0 0 1px #30323d;
    color: black;
    font-size: inherit;
    font-weight: 700;
    position: relative;
    vertical-align: middle;
}
.botAnim button::before, .botAnim button::after {
    box-sizing: inherit;
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    transition: transform 0.5s;
    transition: transform 0.5s, -webkit-transform 0.5s;
}

.center:hover {
    color: #6477b9;
}
.center::before, .center::after {
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    -webkit-transform-origin: center;
            transform-origin: center;
}
.center::before {
    border-top: 2px solid #6477b9;
    border-bottom: 2px solid #6477b9;
    -webkit-transform: scale3d(0, 1, 1);
            transform: scale3d(0, 1, 1);
}
.center::after {
    border-left: 2px solid #6477b9;
    border-right: 2px solid #6477b9;
    -webkit-transform: scale3d(1, 0, 1);
            transform: scale3d(1, 0, 1);
}
.center:hover::before, .center:hover::after {
    -webkit-transform: scale3d(1, 1, 1);
            transform: scale3d(1, 1, 1);
    -webkit-transition: -webkit-transform 0.5s;
    transition: -webkit-transform 0.5s;
    transition: transform 0.5s;
    transition: transform 0.5s, -webkit-transform 0.5s;
}
#stream{
    height: 80vh;
    border: solid rgb(160, 160, 160) 0.5px
}
#chatStream{
    min-height: 50vh;
    border: solid rgb(160, 160, 160) 0.5px
}
#listaMensajesStream{
    height: 95%;
}
#controlesChatStream{
    height: 5%;
}

</style>
