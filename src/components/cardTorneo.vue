<template lang="html">

  <div class="card">
    <img class="card-img-top" src="../assets/bg1.jpg" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">{{torneo.nombre}}</h5>
      <md-button class="md-raised b-0" >Ver detalles</md-button>
    </div>
  </div>

</template>

<script lang="js">

  export default  {
    name: 'card-torneo',
    props: ["torneo"],
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
</style>
