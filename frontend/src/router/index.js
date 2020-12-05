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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function() {
      return import(/* webpackChunkName: "about" */ "@/views/Home.vue");
    },
  },
  {
    path: "/clientes",
    name: "Clientes",
    meta: {
      titulo: "Clientes",
    },

    component: () =>
      import(/* webpackChunkName: "Login" */ "@/views/Cliente.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
