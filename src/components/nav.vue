<template lang="html">
  <main>
    <nav class="navbar navbar-expand-md navbar-dark">
        <a class="navbar-brand" href="#"><img src="../assets/logo.png" class="logo"/></a>
        <button class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId" aria-controls="collapsibleNavId"
            aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="collapsibleNavId">
            <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                <li class="nav-item active">
                    <md-button to="/" class="nav-link">Inicio <span class="sr-only">(current)</span></md-button>
                </li>
                <!-- <li class="nav-item active">
                  <md-button to="/directos" class="nav-link" >En Directo</md-button>
                </li> -->
                <li class="nav-item active">
                  <md-button to="/torneos" class="nav-link">Torneos</md-button>
                </li>
            </ul>
            <div>
              <div id="iconoNotificaciones"  @click="this.verNotificaciones">
                <md-icon class="m-0 w-100 mr-4" id="campanaNotificaciones" v-if="this.logged">{{campana}}</md-icon>
              </div>
              <div class="notificaciones overflow-auto">
                    <md-list class="listaNotificaciones">
                      <md-list-item v-for="(alerta,index) in this.alertas" :key="index" @click="eventoItemLista({not:index,ruta:alerta.ruta})" class="w-100">
                        <md-icon class="mr-3">{{alerta.icon}}</md-icon>
                        <p class="textoNotificaciones m-0 w-100">{{alerta.text}}</p>
                      </md-list-item>
                      <md-divider></md-divider>
                    </md-list>
            </div>
            </div>
            <section id="navuser" class="sombraInsetComp" v-if="this.logged">
              <div class="d-flex align-items-center m-2">
                <img v-bind:src="userImage" class="ml-2 mr-1 imgUser">
                <div class="d-flex flex-column justify-content-between">
                  <p id="usernameNav" class="m-0 texto-claro text-center">{{this.nick}}</p>
                  <div id="botones">
                    <md-button class="b-0 md-raised" @click="$router.push({ path: `/perfil/${nick}` })">Perfil</md-button>
                    <md-button class="b-0 md-raised" @click='this.logout'>Logout</md-button>
                  </div>
                </div>
              </div>
            </section>
            <section class="d-flex" v-else>
                <md-button class="md-raised b-0" data-toggle="modal" data-target=".modal-login"  id="abrirLogin">Login</md-button>
                <md-button class="md-raised b-0" data-toggle="modal" data-target=".modal-registro" id="abrirRegistro">Registrarse</md-button>
            </section>
        </div>
    </nav>
    <div class="modal fade modal-login" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content p-2">
          <div class="modal-header mb-2">
            <h1 class="modal-title">Login</h1>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">x</button>
          </div>
          <div class="modal-body">
            <form action="" method="post" v-on:submit.prevent='loguearse()'>
              <div class="form-group">
                <label for="emailL">Email</label>
                <input type="email" class="form-control" id="emailL" aria-describedby="emailHelp" name="email" placeholder="Introduce tu email" required>
                <small id="emailHelp" class="form-text text-muted">No compartiremos tu Email con nadie.</small>
              </div>
              <div class="form-group">
                <label for="passwL">Contraseña</label>
                <input type="password" class="form-control" id="passwL" name="passw" placeholder="Contraseña" required>
              </div>
              <div class="form-check">
                <input type="checkbox" class="form-check-input" id="terminosL" required>
                <label class="form-check-label" for="terminosL">Terminos y condiciones</label>
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <button type="submit" class="btn btn-primary">Enviar</button>
                <p id="errorLogin" class="text-danger">{{ errorLogin }}</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade modal-registro" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header mb-2">
            <h1 class="modal-title">Registro</h1>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">x</button>
          </div>
          <div class="modal-body">
            <form action="" method="post" v-on:submit.prevent='registrarse()'>
              <div class="form-group">
                  <label for="nick">Nick</label>
                  <input type="text" class="form-control" id="nick" name="text" placeholder="Introduce tu Nick" required>
                </div>
                <div class="form-group">
                  <label for="nombre">Nombre</label>
                  <input type="text" class="form-control" id="nombre" name="text" placeholder="Introduce tu nombre" required>
                </div>
                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" class="form-control" id="email" aria-describedby="emailHelp" name="email" placeholder="Introduce tu email" required>
                  <small id="emailHelp" class="form-text text-muted">No compartiremos tu Email con nadie.</small>
                </div>
                <div class="form-group">
                  <label for="passw">Contraseña</label>
                  <input type="password" class="form-control" id="passw" name="passw" placeholder="Contraseña" required>
                </div>
                <div class="form-check">
                  <input type="checkbox" class="form-check-input" id="terminos" required>
                  <label class="form-check-label" for="terminos">Terminos y condiciones</label>
                </div>
                <button type="submit" class="btn btn-primary">Enviar</button>
                <p id="registerStatus" class="text-danger">{{ registerStatus }}</p>
            </form>
          </div>  
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="js">
  import io from 'socket.io-client';
  export default  {
    name: 'nav1',
    props: ['conexion','nick','logged','img','notificaciones'],
    mounted () {
      this.conexion.on('errorLogin',(error)=>{
        this.errorLogin = error
        setTimeout(() => {
          this.errorLogin = ''
        }, 2000);
      })
      this.conexion.on('resultadoRegistro',(result)=>{
        if(result.error){
          this.registerStatus = result.error
        }else{
          this.registerStatus = result.registrado
          let nick = $("#nick")[0].value = ''
          let nombre = $("#nombre")[0].value = ''
          let email = $("#email")[0].value = ''
          let password = $("#passw")[0].value = ''
          setTimeout(() => {
            $('.modal-registro').modal('hide')
            this.registerStatus = ' '
          }, 2000);
        }
      })
    },
    beforeDestroy(){
      this.conexion.off("errorLogin")
      this.conexion.off("resultadoRegistro")
    },
    updated(){
      if(!this.notificaciones.nada && !this.notificaciones.visto){
        $("#campanaNotificaciones").addClass("campana")
        this.campana="notifications_active"
      }
    },
    data () {
      return {
        registerStatus: "",
        errorLogin: "",
        userImg:this.img,
        campana:"notifications",
      }
    },
    methods: {
      loguearse: function(){
        let email = $("#emailL")[0].value
        let password = $("#passwL")[0].value
        this.conexion.emit('login',{email:email, password:password})
      },
      eventoItemLista:function(obj){
        //hace el evento enlazado con la notificacion
        this.$emit("delNotificacion",obj.not)
        this.$router.push({ path: obj.ruta })
      },
      verNotificaciones: function(){
        //muestrea la lista de notificaciones
        this.notificaciones.visto = true
        $("#campanaNotificaciones").removeClass("campana");
        this.campana="notifications";
        if ($('.notificaciones').is(':visible')) {
            $('.notificaciones').hide();
        } else {
          $('.notificaciones').show();
        }
      },
      registrarse:function(){
        let nick = $("#nick")[0].value
        let nombre = $("#nombre")[0].value
        let email = $("#email")[0].value
        let password = $("#passw")[0].value
        this.conexion.emit('register',{nick:nick,nombre:nombre,email:email,password:password})
      },
      logout: function(){
        this.$emit('logout')
      }
    },
    computed: {
      userImage:function(){
            //Crea la url de la imagen del usuario
            //return "http://localhost:3000/img/usuarios/"+this.img
            return "./img/usuarios/"+this.img
        },
      alertas:function(){
        let alertas={}
        Object.keys(this.notificaciones).filter((clave)=>{
          if(clave != "visto")
            alertas[clave] = this.notificaciones[clave]
        })
        return alertas
      }, 
    }
}


</script>

<style scoped lang="css">
  .nav {
    
  }
  nav{
    background-color:  #30323d;
  }
  .logo{
    height: 32px;
    width: 32px;
  }
  #navuser{
    background-color:rgb(76, 79, 95) ;
    border-radius: 7px 7px 7px 7px;
    -moz-border-radius: 7px 7px 7px 7px;
    -webkit-border-radius: 7px 7px 7px 7px;
    border: 0px solid #2a2b35;
  }
  .md-list-item{
    padding: 0px !important;
  }
  #campanaNotificaciones{
    font-size: 2.2em !important;
    color: white !important;
  }
  .notificaciones{
    position: absolute;
    z-index: 10;
    display: none;
    max-height: 14em;
    max-width: 18em;
    top:67px;
    right: 20.1em;
    border: #1c23217c solid 2px;
    /* -webkit-box-shadow: inset 0px 2px 16px 0px rgba(0,0,0,0.75);
    -moz-box-shadow: inset 0px 2px 16px 0px rgba(0,0,0,0.75);
    box-shadow: inset 0px 2px 16px 0px rgba(0,0,0,0.75);  */
  }
  @media (max-width: 768px) {
    .notificaciones{
      position: relative;
      display: none;
      right: 0;
      max-width: 100%;
      width: 100%;
      top:4px;
      max-height: 14em;
      border: #1c23217c solid 1px;
    }
  }
  .campana{
    animation-name: campana;
    -webkit-animation-name: campana;	

    animation-duration: 2.0s;	
    -webkit-animation-duration: 2.0s;

    animation-iteration-count: infinite;
    -webkit-animation-iteration-count: infinite;
  }

  @keyframes campana {
    0% {
      transform: rotate(-4deg);	
      color: rgba(175, 167, 49, 0.384);
    }
    25% {
      transform: rotate(4deg);
      color: rgba(212, 202, 61, 0.726);
    }
    50% {
      transform: rotate(-4deg);
      color: rgb(219, 209, 59);
    }
    100% {
      transform: rotate(0deg);
      color: rgba(212, 202, 61, 0.726);
    }								
  }

  @-webkit-keyframes campana {
    0% {
      -webkit-transform: rotate(-4deg);	
    }
    25% {
      -webkit-transform: rotate(4deg);
    }
    50% {
      -webkit-transform: rotate(-4deg);	
    }
    100% {
      -webkit-transform: rotate(0deg);	
    }				
  }
</style>
