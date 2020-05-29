import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/black-green-light.css'
import 'bootstrap'
import 'slick-carousel'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import JQuery from 'jquery'
var $ = require('jquery');
import VueRouter from 'vue-router'
window.$ = JQuery
import paginaPrincipal from './components/paginaPrincipal.vue'
import Game from './components/Game.vue'
import torneos from './components/torneos.vue'
import directos from './components/directos.vue'
import perfil from './components/perfil.vue'
import detalleTorneo from './components/detalleTorneo.vue'
import "jquery/src/jquery.js"
var moment = require('moment');
moment().format()
import datePicker from 'vue-bootstrap-datetimepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
Vue.use(datePicker);
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
 
window.$ = $;
Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(VueMaterial)
$().extend(true, $.fn.datetimepicker.defaults, {
  icons: {
    time: 'far fa-clock',
    date: 'far fa-calendar',
    up: 'fas fa-arrow-up',
    down: 'fas fa-arrow-down',
    previous: 'fas fa-chevron-left',
    next: 'fas fa-chevron-right',
    today: 'fas fa-calendar-check',
    clear: 'far fa-trash-alt',
    close: 'far fa-times-circle'
  }
});

const routes = [
  { path: '/', component: paginaPrincipal },
  { path: '/game', component: Game, props: true },
  { path: '/torneos', component: torneos},
  { path: '/directos', component: directos},
  { path: '/perfil/:nick', component: perfil, props: true},
  { path: '/torneos/:id', component: detalleTorneo, props: true},
]

const router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
})


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
