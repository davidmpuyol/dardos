<template lang="html">

  <div class="usuarioChat d-flex align-items-center" id="Xoquiitoo">
    <input type="checkbox" v-model="listo" disabled="disabled"><img v-bind:src="userImage" class="mr-1 imgUser">
    <div class="d-flex justify-content-between align-items-center nombreInvitar">
      <p class="m-0 texto-oscuro text-center" @click="this.cambiarRoom">{{nick}}</p>
      <div class="d-flex flex-column">
        <button class="b-0 btn btn-dark" @click="this.invitarJugador" >Invitar</button>
        <button class="b-0 btn btn-dark">Perfil</button>
      </div>
    </div>
  </div>

</template>

<script lang="js">

  export default  {
    name: 'user-chat',
    props: ['nick','ready','img'],
    mounted () {
      console.log(this.listo)
    },
    updated () {
      console.log("hace update")
    },
    data () {
      return {
        nombre : this.nick
      }
    },
    methods: {
      cambiarRoom: function(){
        console.log("llega a cambiar sala del componente")
        this.$emit('cambiarSala',this.nombre)
      },
      invitarJugador: function(){
        console.log("llega a boton de componente")
        this.$emit('invitar',this.nombre)
      }
    },
    computed: {
      userImage:function(){
          //Crea la url de la imagen del usuario
          return "http://localhost:3000/usersIcon/"+this.img
      },
      listo:function(){
        return this.ready
      }
    }
}


</script>

<style scoped lang="css">
  .user-chat {

  }
</style>
