<template lang="html">

  <main>
      <main class="container-fluid">
        <h1 id="tituloChat" class="mt-1 mb-1 text-center">Chat General</h1>
        <section id="chat" class="d-flex row m-1">
          <div id="mensajes" class="col-12 col-md-7 mb-2 mb-md-0 p-0">
            <div id="mensajesChat" class="overflow-auto">
              <ul id="listaMensajes">
                <li>Bienvenido al chat general</li>
              </ul>
            </div>
            <div id="controlesChat" class="row m-0 botAnim">
              <input type="text" id="textInput" class="col-10">
              <button id="enviar" class="col-2 center m-0 p-0">Enviar</button>
            </div>
          </div>
          <div class="col-12 col-md-5 p-0 overflow-auto">
            <md-list id="usuarios">
              <md-list-item>
                <input id="checkboxLocal" type="checkbox" @click="cambiarEstado">
                <label class="check mb-0 mr-2" for="checkboxLocal"></label>
                <md-avatar class="md-large">
                  <img v-bind:src="userImage" v-bind:alt="user.nick">
                </md-avatar>

                <div class="d-flex w-75 align-items-center justify-content-center">
                  <p class="text-center nombreUserLista m-0">{{user.nick}}</p>
                  <md-icon :title="this.badge_label" class="ml-1">{{badge}}</md-icon>
                </div>
                <md-button class="ml-2 md-icon-button md-list-action" @click="$router.push({ path: `/perfil/${user.nick}` })">
                  <md-icon>account_circle</md-icon>
                </md-button>
              </md-list-item>
              <md-divider class="md-inset"></md-divider>
              <!-- <div id="usuarioLocal" class="usuarioChat d-flex align-items-center">
                <input id="checkboxLocal" type="checkbox">
                <img v-bind:src="userImage" class="mr-1 imgUser">
                  <div class="d-flex justify-content-between align-items-center nombreInvitar">
                    <p id="nombreUserLocal" class="m-0 texto-oscuro text-center"></p>
                    <div id="botones" class="d-flex flex-column">
                      <button class="b-0 btn btn-dark" @click="$router.push({ path: `/perfil/${user.nick}` })">Perfil</button>
                    </div>
                  </div>
              </div> -->
              <md-list-item>
                <md-avatar class="md-large">
                  <img src="../assets/p5.jpg" alt="General">
                </md-avatar>

                <div class="md-list-item-text">
                  <p class="text-center nombreUserLista">Chat General</p>
                </div>
                <md-button class="md-icon-button md-list-action mr-0"  v-on:click="cambiarRoom('general')">
                  <md-icon>chat</md-icon>
                  </md-button>
              <div v-if="montado">
                <div v-if="notificacion['general']" class="bounce">
                  <md-badge  v-bind:md-content="notificacion['general']" class="md-primary" dense>
                  </md-badge>
                </div>
              </div>
              </md-list-item>
              <md-divider class="md-inset"></md-divider>
              <!-- <div id="chatGeneral" class="usuarioChat d-flex align-items-center">
                <img src="../assets/p5.jpg" class="mr-1 imgUser">
                  <div class="d-flex justify-content-between align-items-center nombreInvitar">
                    <p id="usernameNav" class="m-0 texto-oscuro text-center" v-on:click="cambiarRoom('general')">Chat General</p>
                  </div>
              </div> -->
            <userChat v-for="user in this.usuarios" :nick="user.nick" :img="user.img" :ready="user.ready" :tipo_usuario="user.tipo_usuario" :mensajes="notificacion[user.nick]" :key="user.id" v-on:cambiarSala="cambiarRoom" @invitar="prepInvitar">
            </userChat>
            </md-list>
          </div>
        </section>
        <h2 class="text-center mt-2 mb-2">Proximos torneos</h2>
        <section class="contenedorCarousel">
          <div class="carouselTorneos">
            <div class="torneoC" id="torneo1"></div>
            <div class="torneoC" id="torneo2"></div>
            <div class="torneoC" id="torneo3"></div>
            <div class="torneoC" id="torneo4"></div>
          </div>
        </section>
        <div class="modal fade modal-invitar" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content p-2">
              <div class="modal-header mb-2">
                <h1 class="modal-title">{{ jugadorInvitar }}</h1>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">x</button>
              </div>
              <div class="modal-body">
                <h3 class="text-center">{{ textoInvitar }}</h3>
                  <div class="d-flex align-items-center justify-content-center">
                    <button @click="invitar()" class="btn btn-primary" id="botonInvitar">Invitar</button>
                    <button @click="jugar()" class="btn btn-success" id="botonJugar" style="display:none">Jugar</button>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal fade modal-invitado" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content p-2">
              <div class="modal-header mb-2">
                <h1 class="modal-title">{{ jugadorInvitar }}</h1>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">x</button>
              </div>
              <div class="modal-body">
                <h3 class="text-center">{{ textoInvitado }}</h3>
                  <div class="d-flex align-items-center justify-content-center">
                    <button @click="aceptarInvitacion()" class="btn btn-success">Aceptar</button>
                    <button @click="rechazarInvitacion()" class="btn btn-danger">Rechazar</button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  </main>

</template>

<script lang="js">
  import JQuery from 'jquery'
  let $ = JQuery
  import io from 'socket.io-client';
  import userChat from './userChat.vue'
  export default  {
    name: 'pagina-principal',
    props: ['conexion','user'],
    components:{
      userChat
    },    
    mounted () {
      console.log('se monta')
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
          this.badge_label = "Usuario premium"
          break;
        case 3:
          this.badge = "verified_user"
          this.badge_label = "Usuario verificador"
          break;
        case 4:
          this.badge = "build"
          this.badge_label = "Usuario administrador"
          break;
        default:
          this.badge = null
          break;
      }
      this.usr=this.user.nick
      //Indica al servidor que se acaba de conectar el usuario con el nombre de este como parametro
      this.socket.emit('userConected',this.user)
      this.socket.on('user',(msg)=>{
          console.log(msg)
      });
      this.socket.on('reenvio',(msg)=>{
            let foco = false
            //si el mensaje que recibe va a la misma room a la que se esta observando, lo añade a la lista y despues lo añade al registro de mensajes
            //del usuario que lo ha enviado
            console.log('llegan los mensajes'+msg)
            console.log(msg.userDest+'------'+this.roomActual)
            //Si el usuario que manda el mensaje esta puesto en el foco del chat y la room a la que va no es la general se mostrara en el chat privado
            if(msg.dest == this.roomActual && msg.usr != this.usr){
                  this.mostrarMensaje(msg,false)
                  foco = true
            }else
              if(msg.usr == this.roomActual && msg.userDest == this.usr && msg.dest != 'general'){
                this.mostrarMensaje(msg,false)
                foco = true
              }
            //Si el mensaje no va a la room general lo introduce en el array del usuario emisor
            if(msg.usr != this.usr){
              if(msg.dest != 'general'){
                  if(!this.chat[msg.usr])
                      this.chat[msg.usr] = []
                  this.chat[msg.usr].push(msg)
                  if(!foco)
                    this.notificacion[msg.usr]++
              }else{
                  if(!this.chat['general'])
                      this.chat['general'] = []
                  this.chat['general'].push(msg)
                  if(!foco)
                    this.notificacion['general']++
              }
            }
            console.log(foco)
            console.log(this.notificacion)
            if (this.$route.path != '/'){
              console.log("emite evento")
              this.$emit('notificacion',{men:{icon:'chat',text:"Tienes mensajes nuevos",ruta:"/"}})
            }
            this.$forceUpdate()
        })
        this.socket.on('listaUsuarios',(listaUsuarios)=>{
            //Si la lista de usuarios del cliente esta vacia, la llena y crea un elemento en la lista por cada uno de ellos
            if(!this.usuarios){
              delete(listaUsuarios[this.user.nick])
              this.usuarios = listaUsuarios
             Object.keys(listaUsuarios).forEach(element => {
                this.notificacion[element] = 0
              });
              this.notificacion['general'] = 0
            }
            //Por cada elemento que falte en la lista lo añade. Si no habia nada antes, añade un elemento "visto" que contendra un boolean que sera el que decidira
            //si se va a ver la notificacion visual
            Object.keys(listaUsuarios).forEach(clave => {
                if(!Object.keys(this.usuarios).includes(clave)){
                    if(clave != this.usr){
                        this.usuarios[clave] = listaUsuarios[clave]
                        this.notificacion[clave] = 0
                    }
                }
            })
            this.$forceUpdate()
            console.log(this.usuarios)
        })
        //socket.on('checked',clave){}
        //Por cada usuario que se ha desconectado, lo elimina de la lista.
        this.socket.on('usuarioDesc',(usuarioDesc) => {
            usuarioDesc.forEach((usuario) => {
                delete this.usuarios[usuario]
            })
            this.$forceUpdate()
        })
        this.socket.on('menPriv',(msg)=>{
            console.log(msg)
        })
        //Cada vez que un usuario le da click a su chequed, manda un evento para que se cambie en los otros clientes
        this.socket.on('cambEstado',(clave) => {
        if(clave != this.user.nick)
          if(this.usuarios[clave]){
            console.log("recibe cambiar")
            let estado = !this.usuarios[clave].ready
            delete this.usuarios[clave].ready
            this.$set(this.usuarios[clave],"ready",estado)
            console.log(this.usuarios)
          }
          this.$forceUpdate()
        })
        this.socket.on('invitacion',(usuario)=>{
          this.invitado(usuario);
        })
        this.socket.on('invitacionAceptada', (usuario)=>{
          this.invitacionAceptada(usuario);
        })
        $('#enviar').click(()=>{this.enviarMensaje(this.socket)})
        $('#textInput').keypress((event) => {
            if(event.keyCode == '13')
              this.enviarMensaje(this.socket)
        })
        $('.carouselTorneos').slick({
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
        this.montado = true
      },
    beforeDestroy(){
      this.conexion.off("userConected")
      this.conexion.off("reenvio")
      this.conexion.off("listaUsuarios")
      this.conexion.off("usuarioDesc")
      this.conexion.off("menPriv")
      this.conexion.off("cambEstado")
      this.conexion.off("invitacion")
      this.conexion.off("invitacionAceptada")
    },
    data () {
      return {
        chat: Object(),
        usr: '',
        ready: false,
        roomActual: 'general',
        usuarios: null,
        socket : this.conexion,
        jugadorInvitar: null,
        textoInvitar: null,
        textoInvitado: null,
        notificacion: Object(),
        montado: false,
        badge: null,
        badge_label:""
      }
    },
    updated() {
      console.log(this.conexion);
    },
    methods: {
      mostrarMensaje: function(msg,mensajePropio){
          let mensaje = $('<li>');
          let texto = $('<p>');
          $(texto).text(msg.usr+": "+msg.msg);
          $(texto).addClass('m-0 p-2');
          $(mensaje).append(texto);
          if(mensajePropio)
              $(mensaje).addClass("mensaje-derecha");
          else
              $(mensaje).addClass("mensaje-izquierda");
          $('#listaMensajes').append(mensaje);
      },
      cambiarEstado: function(){
          //inicializa el primer usuario de la lista con el usuario logeado
          console.log("hace cambiar estado")
          this.conexion.emit('checked',this.user.nick);
      },
      enviarMensaje: function(socket){
          if ($('#textInput').val() != ''){
              let mensaje = $('#textInput').val()
              $('#textInput').val('')
              //Si esta en la room general pone como destino el nombre de la room, si no el id del user al que va dirigido
              let destino = ''
              if(this.roomActual == 'general'){
                  destino = 'general'
              } else {
                  destino = this.usuarios[this.roomActual].id
              }
              let msgChat = {'usr':this.usr,'id':this.socket.id,'msg':mensaje,'dest':destino,'userDest':this.roomActual,}
              socket.emit("mensaje",msgChat)
              if(!this.chat[msgChat.userDest])
                  this.chat[msgChat.userDest] = []
              this.chat[msgChat.userDest].push(msgChat)
              this.mostrarMensaje(msgChat,true)
          }
      },
      cambiarRoom: function(clave){
          //cambia la room actual por la correspondiente y carga los mensajes guardados.
          console.log(clave)
          this.notificacion[clave] = 0
          if(clave == 'general')
              $('#tituloChat').text('Chat General')
          else
              $('#tituloChat').text(clave)
          $('#listaMensajes').empty()
          this.roomActual = clave
          if(this.chat[clave])
              this.chat[clave].forEach((msg) => {
                  if(msg.usr == this.usr)
                    this.mostrarMensaje(msg,true)
                  else
                    this.mostrarMensaje(msg,false)
              })
          this.$forceUpdate()
      },
      /*anadirUsuarios: function(clave,socket){
          //Crea el elemento de la lista que hace referencia a ese usuario
          let contenedorUsuario = $('<div>')
          $(contenedorUsuario).addClass('usuarioChat d-flex align-items-center')
          $(contenedorUsuario).attr('id',clave)
          let checkbox = $('<input>')
          $(checkbox).attr('type','checkbox')
          $(checkbox).attr('disabled','disabled')
          if (this.usuarios[clave].ready)
              $(checkbox).attr('checked')
          $(contenedorUsuario).append(checkbox)
          let image = $('<img>')
          $(image).attr('src','../assets/p5.jpg')
          $(image).addClass('mr-1 imgUser')
          let contenedorBotones = $('<div>')
          $(contenedorBotones).addClass('d-flex justify-content-between align-items-center nombreInvitar')
          let nombre = $('<p>')
          $(nombre).addClass('m-0 texto-oscuro text-center')
          $(nombre).text(clave)
          $(nombre).click(()=>{
              this.cambiarRoom(clave)
          })
          let botones = $('<div>')
          $(botones).addClass('d-flex flex-column')
          let botonInv = $('<button>')
          $(botonInv).addClass('b-0 btn btn-dark')
          $(botonInv).text('Invitar')
          $(botonInv).attr('data-toggle', "modal");
          $(botonInv).attr('data-target', ".modal-invitar")
          $(botonInv).click(()=>{
            this.jugadorInvitar = clave;
            this.textoInvitar = "¿Quieres invitar a "+clave+"?";
          })
          let botonPerf = $('<button>')
          $(botonPerf).addClass('b-0 btn btn-dark')
          $(botonPerf).text('Perfil')
          $(botones).append(botonInv)
          $(botones).append(botonPerf)
          $(contenedorBotones).append(nombre)
          $(contenedorBotones).append(botones)
          $(contenedorUsuario).append(checkbox)
          $(contenedorUsuario).append(image)
          $(contenedorUsuario).append(contenedorBotones)
          $('#usuarios').append(contenedorUsuario)
      },*/
      prepInvitar(clave){
        console.log("llega a metodo prep")
        this.jugadorInvitar = clave;
        this.textoInvitar = "¿Quieres invitar a "+clave+"?";
        $(".modal-invitar").modal("show")
      },
      invitar: function(){
        console.log(this.jugadorInvitar);
        console.log(this.usr);
        this.socket.emit('invitar',this.jugadorInvitar,this.usr);
        this.textoInvitar = "Invitado, esperando respuesta";
        $('#botonInvitar').hide();
      },
      invitado: function(usuario){
        this.jugadorInvitar = usuario;
        this.textoInvitado = usuario + " quiere jugar contigo";
        $('.modal-invitado').modal('show');
      },
      aceptarInvitacion: function(){
        this.socket.emit('aceptarInvitacion',this.jugadorInvitar, this.usr);
        $('.modal-invitado').modal('hide');
        console.log(this.jugadorInvitar)
        let routeData = this.$router.resolve({path: '/', query: {contrincante: this.jugadorInvitar, id: this.usr}});
        window.open(routeData.href, '_blank');
      },
      rechazarInvitacion: function(){
        this.socket.emit('rechazarInvitacion',this.jugadorInvitar, this.usr);
        $('.modal-invitado').modal('hide');
      },
      invitacionAceptada: function(usuario){
        $('.modal-invitar').modal('show');
        this.jugadorInvitar = usuario;
        this.textoInvitado = usuario+" ha aceptado la partida!";
        $('#botonJugar').show();
      },
      jugar: function(){
        $('.modal-invitar').modal('hide');
        console.log(this.jugadorInvitar);
        let routeData = this.$router.resolve({path: '/', query: {contrincante: this.jugadorInvitar, id: this.usr}});
        window.open(routeData.href, '_blank');
      }
    },
    computed: {
      userImage:function(){
            //Crea la url de la imagen del usuario
            return "http://localhost:3000/usersIcon/"+this.user.img
        },
    }
}


</script>

<style scoped lang="css">
  .pagina-principal {

  }
  #torneo1{
    background: url("../assets/bg1.jpg");
    background-size: cover;
  }
  #torneo2{
      background: url("../assets/bg2.jpg");
      background-size: cover;
  }
  #torneo3{
      background: url("../assets/bg3.jpg");
      background-size: cover;
  }
  #torneo4{
      background: url("../assets/bg4.jpg");
      background-size: cover;
  }
#checkboxLocal {
  opacity: 0;
  visibility: hidden;
  position: absolute;
}
#checkboxLocal:checked ~ .check {
  border-color: #00EA90;
  box-shadow: 0px 0px 0px 15px #00EA90 inset;
}
#checkboxLocal:checked ~ .check::after {
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
