<template lang="html">

  <section class="torneos">
    <section v-if="this.user.tipo_usuario >= 2">

      <div class="contenedorCarousel">
        <div class="carouselTorneosUser">
          <div class="torneoC">
            <md-button class="md-raised b-0" >boton ejemplo</md-button>
          </div>
          <div class="torneoC"></div>
          <div class="torneoC"></div>
          <div class="torneoC"></div>
          <div class="torneoC"></div>
          <div class="torneoC"></div>
          <div class="torneoC"></div>
        </div>
      </div>
    </section>
  </section>

</template>

<script lang="js">

  export default  {
    name: 'torneos',
    props: ['conexion','user'],
    mounted () {
       $('.carouselTorneosUser').slick({
          arrows: true,
          centerPadding: '60px',
          slidesToShow: 3,
          responsive: [
          {
          breakpoint: 768,
          settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '40px',
              slidesToShow: 1
          }
          },
          {
          breakpoint: 480,
          settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '40px',
              slidesToShow: 1
          }
          }
      ]
      });
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
  .torneos {

  }
</style>
