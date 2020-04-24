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
window.$ = JQuery

var $ = require('jquery');
window.$ = $;
Vue.config.productionTip = false

Vue.use(VueMaterial)

new Vue({
  render: h => h(App),
}).$mount('#app')
