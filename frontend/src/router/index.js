import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    meta: {
      titulo: "Login",
      esconderNavbar: true,
    },
    component: () =>
      import(/* webpackChunkName: "Login" */ "@/views/Login.vue"),
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      titulo: "Home",
    },
    component: function() {
      return import(/* webpackChunkName: "Home" */ "@/views/Home.vue");
    },
  },
  {
    path: "/clientes",
    name: "Clientes",
    meta: {
      titulo: "Clientes",
    },
    component: () =>
      import(/* webpackChunkName: "Clientes" */ "@/views/Cliente.vue"),
  },
  {
    path: "/compras",
    name: "Compras",
    meta: {
      titulo: "Compras",
    },
    component: () =>
      import(/* webpackChunkName: "Compras" */ "@/views/Compra.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
