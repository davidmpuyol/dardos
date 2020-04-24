<template lang="html">

  <main>
      <!-- Nav tabs -->
      <nav class="navbar navbar-expand-sm navbar-dark">
          <a class="navbar-brand" href="#">Logo</a>
          <button class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId" aria-controls="collapsibleNavId"
              aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="collapsibleNavId">
              <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
                  <li class="nav-item active">
                      <a class="nav-link" href="#">Inicio <span class="sr-only">(current)</span></a>
                  </li>
                  <li class="nav-item active">
                    <a class="nav-link" href="./directos.html">En Directo</a>
                  </li>
                  <li class="nav-item active">
                    <a class="nav-link" href="#">Torneos</a>
                  </li>
              </ul>
              <div id="navuser" class="d-flex">
                <!-- <img src="img/p3.jpg" class="mr-1 imgUser">
                <div class="d-flex flex-column justify-content-between">
                  <p id="usernameNav" class="m-0 texto-claro text-center">Ejemplo User</p>
                  <div id="botones">
                    <button class="b-0 btn btn-dark">Perfil</button>
                    <button class="b-0 btn btn-dark">Logout</button>
                  </div>
                </div> -->
                <button type="button" data-toggle="modal" data-target=".modal-login" class="b-0 btn btn-dark" id="abrirLogin">Login</button>
                <button type="button" data-toggle="modal" data-target=".modal-registro" class="b-0 btn btn-dark" id="abrirRegistro">Registrarse</button>
              </div>
          </div>
      </nav>
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
              <img src="../assets/p5.jpg" class="mr-1 imgUser">
                <div class="d-flex justify-content-between align-items-center nombreInvitar">
                  <p id="nombreUserLocal" class="m-0 texto-oscuro text-center">Ejemplo User</p>
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
        <div class="modal fade modal-login" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content p-2">
              <div class="modal-header mb-2">
                <h1 class="modal-title">Login</h1>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">x</button>
              </div>
              <div class="modal-body">
                <form action="" method="post" onSubmit="login(); return false">
                  <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" id="email" aria-describedby="emailHelp" name="email" placeholder="Introduce tu email">
                    <small id="emailHelp" class="form-text text-muted">No compartiremos tu Email con nadie.</small>
                  </div>
                  <div class="form-group">
                    <label for="passw">Contraseña</label>
                    <input type="password" class="form-control" id="passw" name="passw" placeholder="Contraseña">
                  </div>
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="terminos">
                    <label class="form-check-label" for="terminos">Terminos y condiciones</label>
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <button type="submit" class="btn btn-primary">Enviar</button>
                    <div class="spinner-border text-primary" style="display: none;" role="status" id="botonCarga">
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="modal fade modal-registro" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
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
  export default  {
    name: 'pagina-principal',
    props: [],
    mounted () {
      this.usr=prompt("Introduce tu nombre")
      var socket = io('localhost:3000');
      //Indica al servidor que se acaba de conectar el usuario con el nombre de este como parametro
      socket.emit('userConected',this.usr)
      socket.on('user',(msg)=>{
          console.log(msg)
      });
      socket.on('reenvio',(msg)=>{
          //si el mensaje que recibe va a la misma room a la que se esta observando, lo añade a la lista y despues lo añade al registro de mensajes
          //del usuario que lo ha enviado
          console.log('llegan los mensajes'+msg)
          console.log(msg.userDest+'------'+this.roomActual)
          //Si el usuario que manda el mensaje esta puesto en el foco del chat y la room a la que va no es la general se mostrara en el chat privado
          if((msg.userDest == this.roomActual || msg.usr == this.roomActual) && msg.usr != this.usr)
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
      socket.on('listaUsuarios',(listaUsuarios)=>{
          //Si la lista de usuarios del cliente esta vacia, la llena y crea un elemento en la lista por cada uno de ellos
          if(!this.usuarios){
              this.usuarios = listaUsuarios
              Object.keys(this.usuarios).forEach((clave)=>{
                  if(clave != this.usr){
                      this.anadirUsuarios(clave,socket)
                  }
              })
          }
          //Por cada elemento que falte en la lista lo añade.
          Object.keys(listaUsuarios).forEach(clave => {
              if(!Object.keys(this.usuarios).includes(clave)){
                  if(clave != this.usr){
                      this.usuarios[clave] = listaUsuarios[clave]
                      this.anadirUsuarios(clave,socket)
                  }
              }
          })
      })
      //socket.on('checked',clave){}
      //Por cada usuario que se ha desconectado, lo elimina de la lista.
      socket.on('usuarioDesc',(usuarioDesc) => {
          usuarioDesc.forEach((usuario) => {
              delete this.usuarios[usuario]
              $('#'+usuario).remove()
          })
      })
      socket.on('menPriv',(msg)=>{
          console.log(msg)
      })
      //Cada vez que un usuario le da click a su chequed, manda un evento para que se cambie en los otros clientes
      socket.on('cambEstado',(clave) => {
          this.usuarios[clave].ready = !this.usuarios[clave].ready
          let checkbox = $('#'+clave).find('input')[0]
          $(checkbox).attr("checked",this.usuarios[clave].ready)
      })
      $('#enviar').click(()=>{this.enviarMensaje(socket)})
      $('#textInput').keypress((event) => {
          if(event.keyCode == '13')
            this.enviarMensaje(socket)
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
      this.inicializarUsuario(this.usr,socket)
      },
    data () {
      return {
        chat: Object(),
        usr: '',
        roomActual: 'general',
        usuarios: null,
      }
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
              this.usuarios[nombre].ready = !this.usuarios[nombre].ready;
              socket.emit('checked',nombre);
          })
          $('#nombreUserLocal').text(nombre);
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
              let msgChat = {'usr':this.usr,'id':this.usuarios[this.usr].id,'msg':mensaje,'dest':destino,'userDest':this.roomActual,}
              socket.emit("mensaje",msgChat)
              if(!this.chat[msgChat.userDest])
                  this.chat[msgChat.userDest] = []
              this.chat[msgChat.userDest].push(msgChat)
              this.mostrarMensaje(msgChat,true)
          }
      },
      cambiarRoom: function(clave){
          //cambia la room actual por la correspondiente y carga los mensajes guardados.
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
      anadirUsuarios: function(clave,socket){
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
      },
    },
    computed: {

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
