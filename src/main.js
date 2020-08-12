import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import {auth} from './firebase/fb';

Vue.config.productionTip = false

let app = null

auth.onAuthStateChanged(() => {

  if (!app) {
    app = new Vue({
      router,
      vuetify,
      store,
      render: h => h(App)
    }).$mount('#app')

  }
})

