<template lang="html">
  <main>
      <main class="container-fluid">
        <h2 class="text-center mt-3 tituloDirecto">Destacados</h2>
        <section class="contenedorCarousel">
          <div class="carouselDirectos">
            <div class="torneoC"></div>
            <div class="torneoC"></div>
            <div class="torneoC"></div>
            <div class="torneoC"></div>
            <div class="torneoC"></div>
            <div class="torneoC"></div>
            <div class="torneoC"></div>
          </div>
        </section>
        <h2 class="text-center mt-3 tituloDirecto">Torneos</h2>
        <section class="contenedorCarousel">
          <div class="carouselDirTorneos">
            <div class="torneoC"></div>
            <div class="torneoC"></div>
            <div class="torneoC"></div>
            <div class="torneoC"></div>
            <div class="torneoC"></div>
            <div class="torneoC"></div>
            <div class="torneoC"></div>
          </div>
        </section>
        <div id="botonMasTorneos" class="w-100 d-flex justify-content-center botAnim"><button class="center">Ver más</button></div>
        <h2 class="text-center mt-3 tituloDirecto">Partida Rapida</h2>
        <section class="contenedorCarousel">
          <div class="carouselDirPartRapida">
            <div class="torneoC"></div>
            <div class="torneoC"></div>
            <div class="torneoC"></div>
            <div class="torneoC"></div>
            <div class="torneoC"></div>
            <div class="torneoC"></div>
            <div class="torneoC"></div>
          </div>
        </section>
        <div id="botonMasPartRapidas" class="w-100 d-flex justify-content-center botAnim"><button class="center">Ver más</button></div>
      </main>
  </main>
</template>

<script lang="js">
  import JQuery from 'jquery'
  let $ = JQuery
  export default  {
    name: 'directos',
    props: [],
    mounted () {
      $('.carouselDirectos').slick({
          centerMode: true,
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
      $('.carouselDirTorneos').slick({
          dots: true,
          infinite: false,
          speed: 300,
          slidesToShow: 3,
          slidesToScroll: 3,
          adaptiveHeight: true,
          responsive: [
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
          ]
      });
      $('.carouselDirPartRapida').slick({
          dots: true,
          infinite: false,
          speed: 300,
          slidesToShow: 3,
          slidesToScroll: 3,
          adaptiveHeight: true,
          responsive: [
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
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
  .directos {

  }
</style>
