<template>
  <v-app>
    <NavBar v-cloak v-if="!$route.meta.esconderNavbar"></NavBar>
    <v-main>
      <v-container
        fluid
        :class="$route.meta.esconderNavbar ? 'fill-height' : ''"
      >
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
export default {
  name: "App",
  components: {
    NavBar,
  },
  watch: {
    "$route.meta.titulo"(val) {
      if (val === null) {
        document.title = `${process.env.VUE_APP_NAME}`;
      } else {
        document.title = `${val} - ${process.env.VUE_APP_NAME}`;
      }
    },
  },
  created() {
    if (this.$route.name === null) {
      document.title = `${process.env.VUE_APP_NAME}`;
    } else {
      document.title = `${this.$route.name} - ${process.env.VUE_APP_NAME}`;
    }
  },
};
</script>

<style>
[v-cloak] {
  display: none !important;
}
</style>
