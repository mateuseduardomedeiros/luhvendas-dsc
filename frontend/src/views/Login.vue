<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-spacer></v-spacer>
          <v-toolbar-title>
            <span>
              LuhVendas
              <span class="font-weight-bold">APP</span>
            </span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-form v-model="valid" autocomplete="off">
            <v-text-field
              v-model.trim="usuario.login"
              label="Usuário"
              name="login"
              :rules="[usuario.login.length > 0 || '*Campo obrigatório!']"
              prepend-icon="mdi-account"
              type="text"
            ></v-text-field>
            <v-text-field
              @keydown.enter="autenticarUsuario()"
              v-model.trim="usuario.senha"
              id="password"
              label="Senha"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!valid"
            @click.stop="autenticarUsuario()"
            color="primary"
            >Entrar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Login",

  data() {
    return {
      valid: true,
      usuario: {
        login: "",
        senha: "",
      },
    };
  },

  methods: {
    async autenticarUsuario() {
      await this.$axios
        .post("login", this.usuario)
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("nome", response.data.nome);
            this.$router.push({ name: "Home" });
            this.$swal({
              toast: true,
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 3000,
              position: "top-end",
              icon: "success",
              title: "Seja bem vindo!",
              text: response.data.nome,
            });
          }
        })
        .catch((error) => {
          this.$swal({
            toast: true,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3000,
            position: "top-end",
            icon: "error",
            title: "Falha!",
            text: error.response.data.msg,
          });
        });
    },
  },
};
</script>
