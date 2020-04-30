<template lang="html">

  <main>
      <main class="container-fluid">
        <h1 id="tituloChat">Chat General</h1>
        <section id="chat" class="d-flex">
          <div id="mensajes">
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
          <div id="usuarios" class="p-3 overflow-auto">
            <div id="usuarioLocal" class="usuarioChat d-flex align-items-center">
              <input id="checkboxLocal" type="checkbox">
              <img v-bind:src="userImage" class="mr-1 imgUser">
                <div class="d-flex justify-content-between align-items-center nombreInvitar">
                  <p id="nombreUserLocal" class="m-0 texto-oscuro text-center">{{user.nick}}</p>
                  <div id="botones" class="d-flex flex-column">
                    <button class="b-0 btn btn-dark">Perfil</button>
                  </div>
                </div>
            </div>
            <div id="chatGeneral" class="usuarioChat d-flex align-items-center">
              <img src="../assets/p5.jpg" class="mr-1 imgUser">
                <div class="d-flex justify-content-between align-items-center nombreInvitar">
                  <p id="usernameNav" class="m-0 texto-oscuro text-center" v-on:click="cambiarRoom('general')">Chat General</p>
                </div>
            </div>
            <userChat v-for="user in this.usuarios" :nick="user.nick" :img="user.img" :ready="user.ready" :key="user.id" v-on:cambiarSala="cambiarRoom" @invitar="prepInvitar">
            </userChat>
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
        this.usr=this.user.nick
        //Indica al servidor que se acaba de conectar el usuario con el nombre de este como parametro
        this.socket.emit('userConected',this.user)
        this.socket.on('user',(msg)=>{
            console.log(msg)
        });
      this.socket.on('reenvio',(msg)=>{
            //si el mensaje que recibe va a la misma room a la que se esta observando, lo añade a la lista y despues lo añade al registro de mensajes
            //del usuario que lo ha enviado
            console.log('llegan los mensajes'+msg)
            console.log(msg.userDest+'------'+this.roomActual)
            //Si el usuario que manda el mensaje esta puesto en el foco del chat y la room a la que va no es la general se mostrara en el chat privado
            if(msg.dest == this.roomActual && msg.usr != this.usr)
                  this.mostrarMensaje(msg,false)
            else
              if(msg.usr == this.roomActual && msg.userDest == this.usr && msg.dest != 'general')
                this.mostrarMensaje(msg,false)
            //Si el mensaje no va a la room general lo introduce en el array del usuario emisor
            if(msg.usr != this.usr){
              if(msg.dest != 'general'){
                  if(!this.chat[msg.usr])
                      this.chat[msg.usr] = []
                  this.chat[msg.usr].push(msg)
              }else{
                  if(!this.chat['general'])
                      this.chat['general'] = []
                  this.chat['general'].push(msg)
              }
            }
        })
        this.socket.on('listaUsuarios',(listaUsuarios)=>{
            //Si la lista de usuarios del cliente esta vacia, la llena y crea un elemento en la lista por cada uno de ellos
            if(!this.usuarios){
              delete(listaUsuarios[this.user.nick])
              this.usuarios = listaUsuarios
            }
            //Por cada elemento que falte en la lista lo añade.
            Object.keys(listaUsuarios).forEach(clave => {
                if(!Object.keys(this.usuarios).includes(clave)){
                    if(clave != this.usr){
                        this.usuarios[clave] = listaUsuarios[clave]
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
        this.inicializarUsuario(this.usr,this.socket)
      },
    data () {
      return {
        chat: Object(),
        usr: '',
        roomActual: 'general',
        usuarios: null,
        socket : this.conexion,
        jugadorInvitar: null,
        textoInvitar: null,
        textoInvitado: null,
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
      inicializarUsuario: function(nombre,socket){
          //inicializa el primer usuario de la lista con el usuario logeado
          $('#checkboxLocal').click(()=>{
              socket.emit('checked',nombre);
          })
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
        let routeData = this.$router.resolve({path: '/game', query: {contrincante: this.jugadorInvitar}});
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
        let routeData = this.$router.resolve({path: '/game', query: {contrincante: this.jugadorInvitar}});
        window.open(routeData.href, '_blank');
      }
    },
    computed: {
      userImage:function(){
            //Crea la url de la imagen del usuario
            return "http://localhost:3000/usersIcon/"+this.user.img
        }
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
</style>
