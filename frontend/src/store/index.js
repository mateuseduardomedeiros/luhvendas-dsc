import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    estadoMenu: true,
  },
  mutations: {
    alternarEstadoMenu(state) {
      state.estadoMenu = !state.estadoMenu;
    },
  },
  actions: {},
  modules: {},
});
