<template>
  <div>
    <v-navigation-drawer
      app
      dark
      :mini-variant="estadoMenu"
      hide-overlay
      permanent
      :value="estadoMenu"
      class="primary"
    >
      <v-list dense nav>
        <v-list-item
          @click="navegarPara(item.rota)"
          v-for="item in itensMenu"
          :key="item.rota"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icone }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.titulo }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-item @click="logout()">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              Sair
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dense dark>
      <div class="d-flex align-center">
        <span class="font-weight-bold">
          Luh
          <span class="font-weight-light">Vendas</span>
        </span>
      </div>

      <v-spacer></v-spacer>

      <!-- <v-btn text @click="logout()">
        <v-icon>mdi-logout</v-icon>
      </v-btn> -->
    </v-app-bar>
  </div>
</template>
<script>
export default {
  name: "Navbar",
  components: {},
  data() {
    return {
      menu: false,
      itensMenu: [
        { rota: "/home", icone: "mdi-home", titulo: "Home" },
        { rota: "/clientes", icone: "mdi-account-group", titulo: "Clientes" },
        {
          rota: "/compras",
          icone: "mdi-cart",
          titulo: "Compras",
        },
        { rota: "/vendas", icone: "mdi-currency-usd", titulo: "Vendas" },
      ],
    };
  },
  methods: {
    navegarPara(rota) {
      if (this.$route.path !== rota) {
        this.$router.push(rota);
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push({ name: "Login" });
    },
  },
  computed: {
    estadoMenu() {
      return this.$store.state.estadoMenu;
    },
  },
};
</script>
