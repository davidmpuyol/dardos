<template lang="html">

  <div class="card">
    <img class="card-img-top" src="../assets/bg1.jpg" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">{{torneo.nombre}}</h5>
      <md-button class="md-raised b-0" @click="this.detalle">Ver detalles</md-button>
    </div>
  </div>

</template>

<script lang="js">

  export default  {
    name: 'card-torneo',
    props: ["torneo"],
    mounted () {
      console.log(this.torneo._id)
    },
    data () {
      return {

      }
    },
    methods: {
      detalle (){
        this.$router.push({ path: 'torneos/'+this.torneo._id})
      }
    },
    computed: {

    }
}


</script>

<style scoped lang="css">
</style>
