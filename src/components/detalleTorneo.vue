<template lang="html">

  <section class="detalle-torneo">
    <h1>detalle-torneo Component</h1>
  </section>

</template>

<script lang="js">

  export default  {
    name: 'detalle-torneo',
    props: ["id"],
    mounted () {
      console.log(this.id)
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
  .detalle-torneo {

  }
</style>
