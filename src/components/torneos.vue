<template lang="html">

  <section class="torneos">
    <section v-if="this.user.tipo_usuario >= 2">
      <md-button v-on:click="this.modalCrearTorneo" class="md-raised md-primary" id="botonCrearTorneo">Crear torneo</md-button>
      <!-- <md-button @click="this.misTorneos" class="md-raised md-primary" id="botonMisTorneos">Mis torneos</md-button> -->
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
    <section class="row m-0">
      <cardTorneo class="cardTorneo col-lg-2 col-sm-4 col-12 p-0" v-for="torneo in this.listaTorneos" :torneo="torneo"></cardTorneo>
    </section>
    <div class="modal fade modal-crearTorneo" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" v-if="this.user.tipo_usuario >= 2">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header mb-2">
            <h1 class="modal-title">Crear Torneo</h1>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">x</button>
          </div>
          <div class="modal-body">
            <form action="" method="post" v-on:submit.prevent='crearTorneo()'>
              <div class="form-group">
                <label for="nick">Nombre del torneo</label>
                <input type="text" class="form-control" id="nombreTorneo" placeholder="Introduce el nombre del torneo" v-model:value="nombreTorneo" required>
              </div>
              <div class="form-group">
                <label for="nick">Numero de jugadores</label>
                <input type="number" class="form-control" id="numeroDeParticipantes" max="32" placeholder="Introduce el numero de participantes" v-model:value="nParticipantes" required>
              </div>
              <div class="form-group">
                <label for="nick">Fecha de cierre de inscripción</label>
                <date-picker v-model="date" :config="options"></date-picker>
              </div>
              <div class="form-group">
                <input type="file" :class="habilitarSubirFoto" id="siofu_input"/><i :class="iconoSubirArchivo"></i>
              </div>
              <div class="alert " role="alert">
                {{textoAlert}}
              </div>
              <md-button type="submit" :class="habilitarEnviar">Enviar</md-button>
            </form>
          </div>  
        </div>
      </div>
    </div>
    <div class="modal fade modal-misTorneos" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" v-if="this.user.tipo_usuario >= 2">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header mb-2">
            <h1 class="modal-title">Registro</h1>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">x</button>
          </div>
          <div class="modal-body">
            
          </div>  
        </div>
      </div>
    </div>
  </section>

</template>

<script lang="js">
  import cardTorneo from "./cardTorneo.vue";
  import SocketIOFileUpload from '../../node_modules/socketio-file-upload/client.js';

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
      this.conexion.emit("getTorneos");
      var uploader = new SocketIOFileUpload(this.conexion);
      uploader.listenOnInput(document.getElementById("siofu_input"));
      //Añade metadatos necesarios en el servidor para colocar la imagen en su sitio y ponerle el nombre correspondiente
      uploader.addEventListener("start", (event) => {
          this.subeImagen = true;
          let numeroRandom = Math.round(Math.random()*100)
          let extension = "."+event.file.name.split(".")[1]
          event.file.meta.path = "/torneos/"+this.user.nick+numeroRandom+this.nombreTorneo.replace(/ /g,"")+extension;
          event.file.meta.nombre = this.user.nick+numeroRandom+this.nombreTorneo.replace(/ /g,"")+extension;
          this.iconoSubirArchivo = "far fa-times-circle text-danger"
          console.log(event)
      });
      this.conexion.on("imagenSubida",(nombre)=>{
        this.nuevaImagen = nombre;
        this.subida = true
        this.iconoSubirArchivo = "fas fa-check-circle text-success"
      })
      this.conexion.on("respuestaRegistrarseTorneo",(result)=>{
        if(result[1]){
          this.mostrarAlerta(result[1],"alert-success")
          this.conexion.emit("getTorneos")
        } else {
          this.mostrarAlerta(result[0],"alert-danger")
        }
      })
    },
    data () {
      return {
        torneos: [],
        fNombre: "",
        iconoSubirArchivo: "",
        fTipo:"",
        subeImagen: false,
        subida: false,
        nuevaImagen: "",
        nombreTorneo:"",
        nParticipantes: 0,
        textoAlert:"",
        date: new Date(),
        options: {
          format: 'YYYY-MM-DD h:mm a',
          useCurrent: false,
        }    
      }
    },
    beforeDestroy(){
      this.conexion.off("resultadoTorneos")
    },
    methods: {
      crearTorneo(){
        let datos = {};
        datos.user = this.user.nick
        datos.nombre= this.nombreTorneo
        datos.img = this.nuevaImagen
        datos.fecha = Date.parse(this.date)
        datos.tipoUsuario = this.user.tipo_usuario
        datos.maxJugadores = this.nParticipantes
        console.log(datos)
        console.log(typeof this.date)
        this.conexion.emit("crearTorneo", datos)
      },
      modalCrearTorneo(){
        $('.modal-crearTorneo').modal("show");
      },
      misTorneos(){

      },
      mostrarAlerta(texto,clase){
        $(".alert").addClass(clase)
        this.textoAlert = texto
        $(".alert").show(500)
        setTimeout(() => {
          $(".alert").hide(500)
        }, 3000);
      },
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
      },
      habilitarSubirFoto(){
        if(this.nombreTorneo.length == 0)
          return "inputTexto disabled"
        else
          return "inputTexto"
      },
      habilitarEnviar(){
        if(!this.subida)
          return "md-raised md-primary disabled"
        else
          return "md-raised md-primary"
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
  .disabled{
    pointer-events: none;
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
