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
import VueRouter from 'vue-router'
window.$ = JQuery
import paginaPrincipal from './components/paginaPrincipal.vue'
import Game from './components/Game.vue'
import torneos from './components/torneos.vue'
import directos from './components/directos.vue'

var $ = require('jquery');
window.$ = $;
Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(VueMaterial)

const routes = [
  { path: '/', component: paginaPrincipal },
  { path: '/game', component: Game, props: true },
  { path: '/torneos', component: torneos},
  { path: '/directos', component: directos}
]

const router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
})


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
