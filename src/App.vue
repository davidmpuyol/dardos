<template>
    <main>
        <nav1 v-if="this.fueraJuego" v-on:logueado="this.logueado" v-on:logout='this.logout' :conexion='this.socket' :nick='this.user.nick' :img='this.user.img' :logged='this.logged'></nav1>
        <section v-if="this.logged">
            <keep-alive include="pagina-principal">
            <router-view :conexion='this.socket' :user='this.user'></router-view>
            </keep-alive>
        </section>
        <section v-else>
            <h2 class="text-center">{{this.mensajeError}}</h2>
        </section>
    </main>
</template>

<script>
//import Game from './components/Game.vue'
import paginaPrincipal from './components/paginaPrincipal.vue'
import nav1 from './components/nav.vue'
import JQuery from 'jquery'
let $ = JQuery
import io from 'socket.io-client';
export default {
  name: 'App',
  components: {
    paginaPrincipal,
    nav1
  }, 
    mounted () {
    if(this.$route.query.contrincante){
        this.$router.push({ path: '/game', query: this.$route.query })
    }
    this.socket.on('respLogin',(respuesta)=>{
        //cuando recibe respuesta del login guarda la session en el sessionStorage para poder loguearse de vuelta si recarga la pagina
        console.log(respuesta)
            if(respuesta){
                sessionStorage.id = respuesta.idSession
                this.user = respuesta
                this.logged = true;
                $(".modal-login").modal('hide')
            }
    })
    if(sessionStorage.id){
        //Si existe un id guardado comprueba que la sesion con ese id este iniciada
        this.socket.emit('comprobarSesion',sessionStorage.id)
    }
    if(!this.logged)
       this.mensajeError = 'Tienes que estar loggeado'
    },
    updated() {
        
    },
    data () {
        return {
            logged : false,
            socket : io("localhost:3000"),
            mensajeError: '',
            user: {nick:'Ejemplo Nick'},
        }
    },
    methods: {
        logueado: function(resp){
            this.logged = resp.logged
            this.user = resp.user
        },
        logout: function(){
            //Envia al servidor la orden de desloguear al usuario de la bd y borra el id de la session y pone el boolean de logged a false
            this.socket.emit('logout',sessionStorage.id)
            this.logged = false,
            sessionStorage.removeItem('id')
        }
    },
    computed: {
        fueraJuego: function(){
            return this.$route.path != "/game"
        }
    }
}
</script>

<style>
*{
    box-sizing: border-box;
}
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
    height: 64px !important;
    width: 64px !important;
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
    height: 70vh;
}
.nombreInvitar{
    width: 90%;
}
#controlesChat{
    height: 9.4%;
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
    background-color:  #8f857d71;

}
.texto-oscuro{
    color: black;
}
.texto-claro{
    color: white;
}
#mensajes{
    height: 100%;
    border-right: #1c23217c solid 1px;
    background-color: #BABFD1;
}
#usuarios{
    height: 73.2vh;
    border-left: #1c23217c solid 1px;
}
.sombra{
    -webkit-box-shadow: 10px 10px 24px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: 10px 10px 24px 0px rgba(0,0,0,0.75);
    box-shadow: 10px 10px 24px 0px rgba(0,0,0,0.75);
  }
  .sombraInsetComp{
      -webkit-box-shadow: inset 0px 0px 13px 5px rgba(0,0,0,0.75);
    -moz-box-shadow: inset 0px 0px 13px 5px rgba(0,0,0,0.75);
    box-shadow: inset 0px 0px 13px 5px rgba(0,0,0,0.75);
  }
  .sombraInsetDif{
    -webkit-box-shadow: inset -2px 1px 73px -17px rgba(0,0,0,0.75);
    -moz-box-shadow: inset -2px 1px 73px -17px rgba(0,0,0,0.75);
    box-shadow: inset -2px 1px 73px -17px rgba(0,0,0,0.75);
  }
#chat{
    border: #1c23217c solid 1px;
}
.carouselTorneos{
    height: 20vh;
}
.nombreUserLista{
    font-size: 1.5em;
    font-weight: bold;
  }
.torneoC{
    height: 20vh !important;
    margin: 5px;
    background-color: black;
    transition: 0.5s;
}
.contenedorCarousel{
    width: 96%;
    margin-left: 2%;
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
#enviar{
    background-color:#e0fbfc ;
}
.botAnim button {
    background: none;
    border: 0;
    box-sizing: border-box;
    margin: 1em;
    padding: 1em 2em;
    box-shadow: inset 0 0 0 1px #30323d59;
    color: #30323d;
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
.bounce{
	animation-name: bounce;
	-webkit-animation-name: bounce;	

	animation-duration: 0.6s;	
	-webkit-animation-duration: 0.6s;

	animation-timing-function: ease;	
	-webkit-animation-timing-function: ease;	
	
	transform-origin: 50% 100%;
	-ms-transform-origin: 50% 100%;
	-webkit-transform-origin: 50% 100%; 	
}

@keyframes bounce {
	0% {
		transform: translateY(0%) scaleY(0.6);
	}
	60%{
		transform: translateY(-100%) scaleY(1.1);
	}
	70%{
		transform: translateY(0%) scaleY(0.95) scaleX(1.05);
	}
	80%{
		transform: translateY(0%) scaleY(1.05) scaleX(1);
	}	
	90%{
		transform: translateY(0%) scaleY(0.95) scaleX(1);
	}				
	100%{
		transform: translateY(0%) scaleY(1) scaleX(1);
	}	
}

@-webkit-keyframes bounce {
	0% {
		-webkit-transform: translateY(0%) scaleY(0.6);
	}
	60%{
		-webkit-transform: translateY(-100%) scaleY(1.1);
	}
	70%{
		-webkit-transform: translateY(0%) scaleY(0.95) scaleX(1.05);
	}
	80%{
		-webkit-transform: translateY(0%) scaleY(1.05) scaleX(1);
	}	
	90%{
		-webkit-transform: translateY(0%) scaleY(0.95) scaleX(1);
	}				
	100%{
		-webkit-transform: translateY(0%) scaleY(1) scaleX(1);
	}		
}



</style>
