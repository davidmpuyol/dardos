<template lang="html">
  <md-list-item class="userLista">
    <input v-model="listo" type="checkbox" disabled="disabled" v-bind:id="nick" class="m-1 checkboxUser"></input>
    <label class="check mb-0 mr-2" v-bind:for="nick"></label>
    <md-avatar class="md-large">
      <img v-bind:src="userImage" v-bind:alt="nick">
    </md-avatar>
    <div class="w-100 row m-0 p-0">
      <div class="d-flex align-items-center justify-content-center col-12 col-lg-7">
        <p class="text-center nombreUserLista m-0" :title="nick">{{nick}}</p>
        <md-icon :title="this.badge_label" class="ml-1">{{badge}}</md-icon>
      </div>
      <div class="botonesUser col-12 col-lg-5 d-flex justify-content-lg-end justify-content-between">
        <md-button class="md-icon-button mr-0" @click="this.cambiarRoom">
            <md-icon>chat</md-icon>
        </md-button>
        <div v-if="mensajesNuevos != 0" class="bounce">
          <md-badge  v-bind:md-content="mensajesNuevos" class="md-primary" dense>
          </md-badge>
        </div>
        <md-button class="ml-2 md-icon-button md-list-action" :disabled="disabled" @click="this.invitarJugador">
          <md-icon>videogame_asset</md-icon>
        </md-button>
        <md-button class="ml-2 md-icon-button md-list-action" @click="$router.push({ path: `/perfil/${nick}` })">
          <md-icon>account_circle</md-icon>
        </md-button>
      </div>
    </div>
  </md-list-item>
  
  <!-- <div class="usuarioChat d-flex align-items-center" id="Xoquiitoo">
    <input type="checkbox" v-model="listo" disabled="disabled"><img v-bind:src="userImage" class="mr-1 imgUser">
    <div class="d-flex justify-content-between align-items-center nombreInvitar">
      <p class="m-0 texto-oscuro text-center" @click="this.cambiarRoom">{{nick}}</p>
      <div class="d-flex flex-column">
        <button class="b-0 btn btn-dark" @click="this.invitarJugador" >Invitar</button>
        <button class="b-0 btn btn-dark" @click="$router.push({ path: `/perfil/${nick}` })">Perfil</button>
      </div>
    </div>
  </div> -->

</template>

<script lang="js">

  export default  {
    name: 'user-chat',
    props: ['nick','ready','img','mensajes','tipo_usuario'],
    mounted () {
       switch (this.user.tipo_usuario) {
        case 0:
          this.badge = null
          break;
        case 1:
          this.badge = "camera_alt"
          this.badge_label = "Camara verificada"
          break;
        case 2:
          this.badge = "grade"
          this.badge_label = "Usuario Vip"
          break;
        case 3:
          this.badge = "verified_user"
          this.badge_label = "Usuario verificador"
          break;
        case 4:
          this.badge = "visibility"
          this.badge_label = "Usuario moderador"
          break;
        case 5:
          this.badge = "build"
          this.badge_label = "Usuario administrador"
          break;
        default:
          this.badge = null
          break;
      }
    },
    updated () {
      console.log("hace update")
    },
    data () {
      return {
        nombre : this.nick,
        badge: null,
        badge_label: "",
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
          return "http://localhost:3000/img/usuarios/"+this.img
      },
      mensajesNuevos:function(){
        return this.mensajes
      },
      listo:function(){
        return this.ready
      },
      disabled:function(){
        return !this.ready
      }
    }
}


</script>

<style scoped lang="css">
  .user-chat {

  }
  .botonCambiarRoom{
    height: 45px;
    width: 45px;
  }
  .userLista input {
    opacity: 0;
    visibility: hidden;
    position: absolute;
  }
  .userLista input:checked ~ .check {
    border-color: #00EA90;
    box-shadow: 0px 0px 0px 15px #00EA90 inset;
  }
  .userLista input:checked ~ .check::after {
    opacity: 1;
    transform: scale(1);
  }
  .check {
    min-width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border-radius: 100px;
    background-color: #FFF;
    border: 2px solid #1c23217c;
    box-shadow: 0px 0px 0px 0px #00EA90 inset;
    transition: all 0.15s cubic-bezier(0, 1.05, 0.72, 1.07);
  }
  .check::after {
    content: '';
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 4;
    position: absolute;
    transform: scale(0);
    background-size: 50%;
    background-repeat: no-repeat;
    background-position: center;
    transition-delay: 0.2s !important;
    transition: all 0.25s cubic-bezier(0, 1.05, 0.72, 1.07);
  }
</style>
