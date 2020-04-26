<template lang="html">

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
              <img src="img/p3.jpg" class="mr-1 imgUser">
              <div class="d-flex flex-column justify-content-between">
                <p id="usernameNav" class="m-0 texto-claro text-center">Ejemplo User</p>
                <div id="botones">
                  <button class="b-0 btn btn-dark">Perfil</button>
                  <button class="b-0 btn btn-dark">Logout</button>
                </div>
              </div>
            </div>
            <div class="d-flex" v-else>
                <!-- <button type="button" data-toggle="modal" data-target=".modal-login" class="b-0 btn btn-dark" id="abrirLogin">Login</button>
                <button type="button" data-toggle="modal" data-target=".modal-registro" class="b-0 btn btn-dark" id="abrirRegistro">Registrarse</button> -->
                <button type="button" class="b-0 btn btn-dark" id="abrirLogin" @click="this.loggearse">Login</button>
                <button type="button" class="b-0 btn btn-dark" id="abrirRegistro">Registrarse</button>
            </div>
        </div>
    </nav>
</template>

<script lang="js">

  export default  {
    name: 'nav1',
    props: [],
    mounted () {

    },
    data () {
      return {
        logged: false,
      }
    },
    methods: {
      loggearse: function(){
        this.logged = true
        this.$emit('loggeado', this.logged)
      }
    },
    computed: {

    }
}


</script>

<style scoped lang="css">
  .nav {

  }
</style>
