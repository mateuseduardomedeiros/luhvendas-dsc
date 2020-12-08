<template>
  <div>
    <v-dialog
      v-model="modalItem"
      scrollable
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ tituloModal }}</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="12" md="6">
              <v-text-field
                label="Data"
                hint="Data da compra"
                v-model="itemAtual.data"
                v-mask="['##/##/####']"
                @keyup.enter="salvarCompra()"
                autocomplete="off"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="6">
              <v-text-field
                id="valor"
                label="Valor"
                v-money="money"
                hint="Digite o valor total das compras"
                v-model="price"
                clearable
                @keyup.enter="salvarCompra()"
                autocomplete="off"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-textarea
                label="Observação"
                v-model="itemAtual.observacao"
                hint="Digite como foi gasto o dinheiro"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="fecharModal()">Fechar</v-btn>
          <v-btn
            color="primary"
            text
            @click="salvarCompra()"
            :disabled="desabilitarBtnSalvar || itemAtual.data.trim().length < 2"
            >Salvar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card v-if="!(isMobile() && !estadoMenu)">
      <v-card-title style="padding-bottom: 0; ">
        Compras
        <v-layout row wrap>
          <v-flex
            xs12
            sm6
            :class="`d-flex align-center ${isMobile() ? 'mx-3' : 'pl-4'}`"
          >
            <!-- <h1 class="headline text-no-wrap">{{ this.$options.name }}</h1> -->
            <v-spacer v-if="isMobile()"></v-spacer>
            <v-btn
              small
              elevation="1"
              color="primary"
              class="ml-2"
              @click="abrirModal()"
              ref="teste"
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
          <!-- eslint-disable-next-line -->
          <template v-slot:item.observacao="{ item }">
            <pre>{{ item.observacao }}</pre>
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.valor="{ item }">
            <span>{{
              Number(item.valor.toFixed(2)).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }}</span>
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.action="{ item }">
            <v-icon
              class="mr-1"
              small
              color="info"
              @click.stop="abrirCompra(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              class="mr-1"
              small
              color="error"
              @click="deletarCompra(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
        <div class="text-center pt-5 mx-5 pb-5" v-if="itens.length !== 0">
          <v-pagination
            v-model="paginaAtual"
            :length="numeroPaginas"
            @input="carregarCompras()"
          ></v-pagination>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mask } from "vue-the-mask";
import moment from "moment";
import { VMoney } from "v-money";
export default {
  name: "Compra",
  directives: { money: VMoney, mask },
  data() {
    return {
      price: "R$ 0,00",

      carregandoCompras: false,
      desabilitarBtnDeletar: true,
      desabilitarBtnSalvar: false,
      carregandoItens: false,
      esconderMobile: false,
      paginaAtual: 1,
      numeroPaginas: 1,
      itensPorPagina: 10,
      tituloModal: "",
      modalItem: false,
      pesquisar: "",
      novaCompra: false,
      itens: [],
      itemAtual: {
        data: "",
        observacao: "",
        valor: 0,
        id: "",
      },
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        precision: 2,
      },
      cabecalhos: [
        { text: "Data", align: "left", value: "data", sortable: false },
        {
          text: "Observação",
          align: "center",
          value: "observacao",
          sortable: false,
        },
        { text: "Valor", align: "right", value: "valor", sortable: false },
        { text: "Ação", value: "action", align: "right", sortable: false },
      ],
    };
  },
  watch: {
    price(val) {
      if (val !== undefined || val !== null) {
        const unmasked = Number(
          String(val)
            .replace(this.money.prefix, "")
            .replace(".", "")
            .replace(",", ".")
        );
        this.itemAtual.valor = unmasked;
      }
    },
  },

  computed: {
    estadoMenu() {
      return this.$store.state.estadoMenu;
    },
  },
  created() {
    this.carregarCompras();
  },
  methods: {
    async carregarCompras() {
      this.carregandoCompras = true;
      await this.$axios
        .get(`compra/?page=${this.paginaAtual}&per_page=${this.itensPorPagina}`)
        .then((response) => {
          this.itens = response.data.result.data;
          this.carregandoCompras = false;
          this.numeroPaginas = parseInt(response.data.totalPages);
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
            text: "Erro ao carregar compras!",
          });
        });
    },
    abrirModal() {
      this.modalItem = true;
      this.tituloModal = "Cadastrar Compra";
      this.novaCompra = true;
    },
    fecharModal() {
      this.carregandoCompras = false;
      this.modalItem = false;
      setTimeout(() => {
        this.itemAtual.data = "";
        this.itemAtual.observacao = "";
        const auxValor = document.querySelector("#valor");
        auxValor.value = 0;
        this.itemAtual.id = "";
        this.novaCompra = false;
      }, 100);
    },
    async salvarCompra() {
      this.desabilitarBtnSalvar = true;
      // this.itemAtual.data = moment(this.itemAtual.data).format("YYYY-MM-DD");
      let aux = String(this.itemAtual.valor);
      aux = Number(aux.replace("R$ ", "").replace(",", "."));
      this.itemAtual.valor = aux;
      if (this.novaCompra) {
        if (this.itemAtual.data.length > 0) {
          delete this.itemAtual.id;
          await this.$axios
            .post(`compra`, { ...this.itemAtual })
            .then((response) => {
              this.desabilitarBtnSalvar = false;
              this.$swal({
                toast: true,
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 3000,
                position: "top-end",
                icon: "success",
                title: response.data.msg,
              });

              this.fecharModal();
              this.carregarCompras();
            })
            .catch((error) => {
              this.desabilitarBtnSalvar = false;
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
              this.fecharModal();
            });
        }
      } else {
        let idItem = this.itemAtual.id;
        delete this.itemAtual.id;
        await this.$axios
          .put(`compra/${idItem}`, { ...this.itemAtual })
          .then((response) => {
            this.desabilitarBtnSalvar = false;
            this.$swal({
              toast: true,
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 3000,
              position: "top-end",
              icon: "success",
              title: response.data.msg,
            });
            this.fecharModal();
            this.carregarCompras();
          })
          .catch((err) => {
            this.desabilitarBtnSalvar = false;
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
            this.itemAtual.id = idItem;
          });
      }
    },
    async abrirCompra(item) {
      // const auxValor = document.getElementById("valor");

      this.tituloModal = "Editar Compra";
      this.modalItem = true;
      this.itemAtual.data = item.data;
      this.itemAtual.observacao = item.observacao;
      this.itemAtual.id = item.id;
      await this.$axios
        .get(`/compra/${item.id}`)
        .then((response) => {
          // auxValor.value = ;
          document.querySelector("#valor").value = this.$toReal(
            response.data.valor
          );

          this.price = this.$toReal(response.data.valor);
          // this.itemAtual.valor = item.valor.toFixed(2);
          // setTimeout(() => {
          //   document.querySelector("#valor").value = "R$ 10,00";
          // }, 300);
        })
        .catch((error) => {
          console.log(error);
          this.$swal({
            toast: true,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3000,
            position: "top-end",
            icon: "error",
            title: "Falha!",
            text: error.response,
          });
        });
    },
    deletarCompra(item) {
      this.$swal
        .fire({
          title: "Tem certeza que deseja deletar esse registro?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#008000",
          cancelButtonColor: "#d33",
          cancelButtonText: "Não",
          confirmButtonText: "Sim",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$axios
              .delete(`compra/${item.id}`)
              .then((response) => {
                this.$swal({
                  toast: true,
                  showConfirmButton: false,
                  timerProgressBar: true,
                  timer: 3000,
                  position: "top-end",
                  icon: "success",
                  title: response.data.msg,
                });
                this.fecharModal();
                this.carregarCompras();
              })
              .catch((response) => {
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
                this.fecharModal();
              });
          }
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
