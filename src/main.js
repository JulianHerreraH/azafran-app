import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.config.productionTip = false

export const bus = new Vue()

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
