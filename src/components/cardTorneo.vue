<template lang="html">

  <div class="card">
    <img class="card-img-top" :src="imagenTorneo" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">{{torneo.nombre}}</h5>
      <md-button class="md-raised b-0" @click="this.detalle">Ver detalles</md-button>
      <md-button class="md-raised b-0" @click="this.apuntarse">Apuntarse Torneo</md-button>
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
      },
      apuntarse (){
        this.$emit('apuntarse',this.torneo._id)
      }
    },
    computed: {
      imagenTorneo() {
        return "http://localhost:3000/imgApp/"+this.torneo.img
      }
    }
}


</script>

<style scoped lang="css">
</style>
