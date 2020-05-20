<template lang="html">

  <section class="torneos">
    <section v-if="this.user.tipo_usuario >= 2">

    </section>
    <section id="buscador" class="m-3 m-md-4 m-lg-5">
      <div class="input-group">
        <select id="selectTipo" v-model="fTipo" class="">
          <option value="">Todos</option>
          <option value=1>Comunidad</option>
          <option value=2>Oficial</option>
        </select>
        <div class="input-group-append" id="inputBuscador">
          <input class="input-group-text w-100" v-model="fNombre" type="text"/>
        </div>
      </div>
    </section>
    <section class="row">
      <cardTorneo class="cardTorneo col-lg-2 col-sm-4 col-12 p-0" v-for="torneo in this.listaTorneos" :torneo="torneo"></cardTorneo>
    </section>
  </section>

</template>

<script lang="js">
  import cardTorneo from "./cardTorneo.vue"
  export default  {
    name: 'torneos',
    props: ['conexion','user'],
    components: {
      cardTorneo
    }, 
    mounted () {
      //Los torneos tipo 2 son los torneos oficiales y los torneo tipo 1 son los de la comunidad
      this.conexion.on('resultadoTorneos',(resultado)=>{
        this.torneos = resultado
        console.log(this.torneos)
      })
      this.conexion.emit("getTorneos")
    },
    data () {
      return {
        torneos: [],
        fNombre: "",
        fTipo:"",
      }
    },
    beforeDestroy(){
      this.conexion.off("resultadoTorneos")
    },
    methods: {
    },
    computed: {
      listaTorneos:function(){
        return this.torneos.filter((torneo)=>{
          if(this.fTipo != ""){
            if(torneo.tipo==this.fTipo&&torneo.nombre.includes(this.fNombre))
              return torneo
          }else{
            if(torneo.nombre.includes(this.fNombre))
              return torneo
          }
        })
      }
    }
}


</script>

<style scoped lang="css">
  .torneos {

  }
  .cardTorneo{
    box-shadow: 0 0.5em 1em -0.125em rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.02);
  }
  #inputBuscador{
    width: 80%;
  }
  #inputBuscador input{
    border-top-right-radius: 0.7em;
    border-bottom-right-radius: 0.7em;
  }
  #selectTipo{
    width: 20%;
    border-top-left-radius: 0.7em;
    border-bottom-left-radius: 0.7em;;
  }
</style>
