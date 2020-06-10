<template lang="html">

  <section class="pagina-login">
    <article class="m-5">
      <h1 class="text-center">_________</h1>
      <p class="text-center">Bienvenidos a ________, la web de competicion de dardos online donde podras jugar y competir con jugadores de todo el mundo y progresar como jugador profesional</p>
    </article>
    <md-divider></md-divider>
    <article class="row m-5">
      <img class="col-12 col-sm-6" src="../assets/imgp2.png"/>
      <div class="col-12 col-sm-6">
        <h2 class="text-center">Haz nuevos amigos... y rivales</h2>
        <p class="text-center">Interactua con los jugadores a traves del chat principal e invitalos a jugar de una forma
          facil e intuitiva. Solo se puede invitar a los jugadores que esten preparados y hayan puesto su boton en verde asi no te molestaran
          cuando no quieras jugar.
        </p>
      </div>
    </article>
    <md-divider></md-divider>
    <article class="row m-5">
      <img class="col-12 col-sm-6 order-sm-2" src="../assets/imgp1.png"/>
      <div class="col-12 col-sm-6 order-sm-1">
        <h2 class="text-center">Participa en torneos</h2>
        <p class="text-center">Juega torneos de la comunidad y torneos oficiales donde podras demostrar tu nivel. <i>Para poder jugar torneos tendras que tener la cuenta verificada
          por un administrador.
        </i>
        </p>
      </div>
    </article>
    <md-divider></md-divider>
    <article class="row m-5">
      <img class="col-12 col-sm-6" src="../assets/imggp2.png"/>
      <div class="col-12 col-sm-6">
        <h2 class="text-center">Controla tus estadisticas</h2>
        <p class="text-center">Vuelve a revisar las estadisticas de tus partidas anteriores para analizar tu evolución como jugador.
        </p>
      </div>
    </article>
  </section>

</template>

<script lang="js">

  export default  {
    name: 'pagina-login',
    props: [],
    mounted () {

    },
    data () {
      return {

      }
    },
    methods: {

    },
    computed: {

    }
}


</script>

<style scoped lang="css">
  .pagina-login {

  }
  img{
    border: 2px solid rgb(124, 124, 124);
  }
</style>
