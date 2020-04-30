<template lang="html">
  <main>
    <nav class="navbar navbar-expand-sm navbar-dark">
        <a class="navbar-brand" href="#">Logo</a>
        <button class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId" aria-controls="collapsibleNavId"
            aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="collapsibleNavId">
            <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                <li class="nav-item active">
                    <a class="nav-link" href="./index.html">Inicio <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item active">
                  <a class="nav-link" href="#">En Directo</a>
                </li>
                <li class="nav-item active">
                  <a class="nav-link" href="#">Torneos</a>
                </li>
            </ul>
            <div id="navuser" class="d-flex" v-if="this.logged">
              <img v-bind:src="userImage" class="mr-1 imgUser">
              <div class="d-flex flex-column justify-content-between">
                <p id="usernameNav" class="m-0 texto-claro text-center">{{this.nick}}</p>
                <div id="botones">
                  <button class="b-0 btn btn-dark">Perfil</button>
                  <button class="b-0 btn btn-dark" @click='this.logout'>Logout</button>
                </div>
              </div>
            </div>
            <div class="d-flex" v-else>
                <button type="button" data-toggle="modal" data-target=".modal-login" class="b-0 btn btn-dark" id="abrirLogin">Login</button>
                <button type="button" data-toggle="modal" data-target=".modal-registro" class="b-0 btn btn-dark" id="abrirRegistro">Registrarse</button>
            </div>
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
                <p id="errorLogin">{{ errorLogin }}</p>
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
                <p id="registerStatus">{{ registerStatus }}</p>
            </form>
          </div>  
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="js">
  import JQuery from 'jquery'
  let $ = JQuery
  import io from 'socket.io-client';
  export default  {
    name: 'nav1',
    props: ['conexion','nick','logged','img'],
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
          console.log(this.registerStatus)
          console.log(result.error)
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
    data () {
      return {
        registerStatus: "",
        errorLogin: "",
        userImg:this.img
      }
    },
    methods: {
      loguearse: function(){
        let email = $("#emailL")[0].value
        let password = $("#passwL")[0].value
        this.conexion.emit('login',{email:email, password:password})
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
            return "http://localhost:3000/usersIcon/"+this.img
        }
    }
}


</script>

<style scoped lang="css">
  .nav {

  }
</style>
