import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import VueSweetalert2 from "vue-sweetalert2";

import toReal from './plugins/toReal'

// If you don't need the styles, do not connect
import "sweetalert2/dist/sweetalert2.min.css";

import store from './store'

Vue.use(VueSweetalert2);
Vue.config.productionTip = false;

Vue.use(toReal)


new Vue({
  router,
  vuetify,
  store,

  render: function(h) {
    return h(App);
  }
}).$mount("#app");
