<template lang="html">

  <section class="stream">
      <main class="container-fluid">
        <section id="contenidoStream" class="row">
          <h1 id="tituloStream" class="col-12">Ejemplo Titulo</h1>
          <section id="stream" class="col-xl-9 col-12"></section>
          <section id="chatStream" class="col-xl-3 col-12 p-0">
            <div id="listaMensajesStream" class="overflow-auto">
              <ul id="listaMensajes">
                <li>Bienvenido al chat general</li>
              </ul>
            </div>
            <div id="controlesChatStream" class="row m-0 botAnim">
              <input type="text" id="textInput" class="col-10">
              <button id="enviar" class="col-2 center m-0 p-0">Enviar</button>
            </div>
          </section>
        </section>
      </main>
  </section>

</template>

<script lang="js">

  export default  {
    name: 'stream',
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

<style scoped lang="scss">
  .stream {

  }
</style>
