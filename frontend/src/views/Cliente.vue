<template>
  <v-card v-if="!(isMobile() && !estadoMenu)">
    <v-card-title style="padding-bottom: 0; ">
      Clientes
      <v-layout row wrap>
        <v-flex
          xs12
          sm6
          :class="`d-flex align-center ${isMobile() ? 'mx-3' : 'pl-4'}`"
        >
          <h1 class="headline text-no-wrap">{{ this.$options.name }}</h1>
          <v-spacer v-if="isMobile()"></v-spacer>
          <v-btn
            small
            elevation="1"
            color="primary"
            class="ml-2"
            @click="abrirModal()"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs12 sm6 :class="`${isMobile() ? 'mx-3' : 'pr-4'} `">
          <v-text-field
            append-icon="mdi-magnify"
            label="Pesquisar"
            hide-details
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-card-title>
    <div>
      <v-data-table
        :headers="cabecalhos"
        :items="itens"
        :loading="carregandoItens"
        loading-text="Carregando dados..."
        :search="pesquisar"
        :page.sync="paginaAtual"
        :items-per-page="Number(itensPorPagina)"
        hide-default-footer
        :page-count="numeroPaginas"
      >
        <template>
          <v-icon small color="info" @click="abrirItem(item)">
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table>
      <div class="text-center pt-5 mx-5 pb-5" v-if="itens.length !== 0">
        <v-pagination
          v-model="paginaAtual"
          :length="numeroPaginas"
          @input="carregarClientes()"
        ></v-pagination>
        <!-- <v-select
          :items="numeroElementos"
          :class="`${isMobile() ? 'mt-5' : ''}`"
          label="Itens por página"
          hide-details
          v-model="itensPorPagina"
          @change="listarItens((n = true))"
        ></v-select> -->
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      carregandoClientes: false,
      desabilitarBtnDeletar: true,
      desabilitarBtnSalvar: false,
      carregandoItens: false,
      esconderMobile: false,
      paginaAtual: 1,
      numeroPaginas: 2,
      itensPorPagina: 3,
      tituloModal: "",
      modalItem: false,
      pesquisar: "",
      novoItem: false,
      itens: [],
      cabecalhos: [
        { text: "Nome", align: "left", value: "nome", sortable: false },
        { text: "Telefone", value: "telefone", sortable: false },
        { text: "Ação", value: "action", align: "right", sortable: false },
      ],
    };
  },
  computed: {
    estadoMenu() {
      return this.$store.state.estadoMenu;
    },
  },
  created() {
    this.carregarClientes();
  },
  methods: {
    async carregarClientes() {
      this.carregandoClientes = true;
      await this.$axios
        .get(
          `cliente/?page=${this.paginaAtual}&per_page=${this.itensPorPagina}`
        )
        .then((response) => {
            console.log(response.data)
          this.itens = response.data.result.data;
          this.carregandoClientes = false;
        //   this.numeroPaginas = parseInt(response.data.totalPages);
        //   console.log(this.numeroPaginas)
        })
        .catch(() => {
          this.$swal({
            toast: true,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3000,
            position: "top-end",
            icon: "error",
            title: "Falha!",
            text: "Erro ao carregar Clientes!",
          });
        });
    },
    isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style></style>
