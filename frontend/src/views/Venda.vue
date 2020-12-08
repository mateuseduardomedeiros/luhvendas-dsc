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
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  label="Data"
                  hint="Data da compra"
                  v-model="itemAtual.data"
                  v-mask="['##/##/####']"
                  @keyup.enter="salvarVenda()"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  v-if="nomeClienteAtual"
                  readonly
                  v-model="nomeClienteAtual"
                  hint="Esse campo não pode ser editado"
                ></v-text-field>
                <v-autocomplete
                  v-if="!nomeClienteAtual"
                  :allow-overflow="false"
                  ref="idCliente"
                  v-model="itemAtual.cliente.id"
                  :loading="carregandoCliente"
                  :items="clientes"
                  :search-input.sync="pesquisaCliente"
                  hide-no-data
                  cache-itens
                  clearable
                  item-text="nome"
                  item-value="id"
                  label="Cliente"
                  autocomplete="off"
                  flat
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-textarea
                  label="Observação"
                  v-model="itemAtual.observacao"
                  hint="Digite como foi gasto o dinheiro"
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  id="valorTotal"
                  label="Valor Total"
                  v-money="money"
                  hint="Digite o valor total da venda"
                  v-model.lazy="itemAtual.valorTotal"
                  clearable
                  @keyup.enter="salvarVenda()"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  id="valorPago"
                  label="Valor Pago"
                  v-money="money"
                  hint="Digite o valor total pago"
                  v-model.lazy="itemAtual.valorPago"
                  clearable
                  @keyup.enter="salvarVenda()"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-select
                  v-model="itemAtual.tipoPagamento"
                  hint="Tipo de pagamento"
                  :items="tiposPagamento"
                  item-text="nome"
                  item-value="id"
                  label="Select"
                  persistent-hint
                  return-object
                  single-line
                >
                </v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="fecharModal()">Fechar</v-btn>
          <v-btn
            color="primary"
            text
            @click="salvarVenda()"
            :disabled="desabilitarBtnSalvar || itemAtual.data.trim().length < 2"
            >Salvar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card v-if="!(isMobile() && !estadoMenu)">
      <v-card-title style="padding-bottom: 0; ">
        Vendas
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
          <template v-slot:item.valorPago="{ item }">
            <span>{{
              Number(item.valorPago.toFixed(2)).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }}</span>
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.valorTotal="{ item }">
            <span>{{
              Number(item.valorTotal.toFixed(2)).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            }}</span>
          </template>
          <!-- eslint-disable-next-line -->
          <template v-slot:item.action="{ item }">
            <v-icon class="mr-1" small color="info" @click="abrirVenda(item)">
              mdi-pencil
            </v-icon>
            <v-icon
              class="mr-1"
              small
              color="error"
              @click="deletarVenda(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
        <div class="text-center pt-5 mx-5 pb-5" v-if="itens.length !== 0">
          <v-pagination
            v-model="paginaAtual"
            :length="numeroPaginas"
            @input="carregarVendas()"
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
  directives: { money: VMoney, mask },
  data() {
    return {
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        precision: 2,
        masked: false,
      },
      tiposPagamento: [
        {
          id: 1,
          nome: "Dinheiro",
        },
        {
          id: 2,
          nome: "Cartão de Crédito",
        },
        {
          id: 3,
          nome: "Cartão de Débito",
        },
      ],
      carregandoCompras: false,
      desabilitarBtnDeletar: true,
      desabilitarBtnSalvar: false,
      carregandoItens: false,
      esconderMobile: false,
      paginaAtual: 1,
      numeroPaginas: 1,
      itensPorPagina: 10,
      tituloModal: "",
      carregandoCliente: false,
      clientes: [],
      pesquisaCliente: "",
      nomeClienteAtual: "",
      modalItem: false,
      pesquisar: "",
      novaVenda: false,
      itens: [],
      itemAtual: {
        id: "",
        data: "",
        cliente: {
          id: 0,
        },
        observacao: "",
        valorTotal: 0,
        valorPago: 0,
        tipoPagamento: {
          id: 1,
        },
      },
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        precision: 2,
        masked: false,
      },
      cabecalhos: [
        { text: "Data", align: "left", value: "data", sortable: false },
        { text: "Cliente", value: "cliente.nome", sortable: false },
        {
          text: "Observação",
          align: "right",
          value: "observacao",
          sortable: false,
        },
        {
          text: "Valor Pago",
          align: "right",
          value: "valorPago",
          sortable: false,
        },
        {
          text: "Valor Total",
          align: "right",
          value: "valorTotal",
          sortable: false,
        },
        {
          text: "Pagamento",
          align: "right",
          value: "tipoPagamento.nome",
          sortable: false,
        },
        { text: "Ação", value: "action", align: "right", sortable: false },
      ],
    };
  },
  computed: {
    estadoMenu() {
      return this.$store.state.estadoMenu;
    },
  },
  watch: {
    pesquisaCliente(val) {
      if (!!val) {
        this.carregandoCliente = true;
        this.$axios
          .post(`cliente/nome`, { nome: val })
          .then((response) => {
            this.carregandoCliente = false;
            this.clientes = response.data;
          })
          .catch((error) => {
            this.carregandoCliente = false;
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
      }
    },
  },
  created() {
    this.carregarVendas();
  },
  methods: {
    async carregarVendas() {
      this.carregandoCompras = true;
      await this.$axios
        .get(`venda/?page=${this.paginaAtual}&per_page=${this.itensPorPagina}`)
        .then((response) => {
          this.itens = response.data.result.data;
          this.carregandoCompras = false;
          this.numeroPaginas = parseInt(response.data.totalPages);
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
    abrirModal() {
      this.modalItem = true;
      this.tituloModal = "Cadastrar Venda";
      this.novaVenda = true;
    },
    fecharModal() {
      this.carregandoCompras = false;
      this.modalItem = false;
      setTimeout(() => {
        const auxTotal = document.querySelector("#valorTotal");
        auxTotal.value = 0;
        const auxPago = document.querySelector("#valorPago");
        auxPago.value = 0;
        this.itemAtual.valorPago = this.nomeClienteAtual = "";
        this.itemAtual.data = "";
        this.itemAtual.cliente.id = 0;
        this.itemAtual.observacao = "";
        this.itemAtual.tipoPagamento.id = 1;
        this.itemAtual.id = "";
        this.novaVenda = false;
      }, 100);
    },
    async salvarVenda() {
      this.desabilitarBtnSalvar = true;

      let auxTotal = String(this.itemAtual.valorTotal);
      auxTotal = Number(auxTotal.replace("R$ ", "").replace(",", "."));
      this.itemAtual.valorTotal = auxTotal;

      let auxPago = String(this.itemAtual.valorPago);
      auxPago = Number(auxPago.replace("R$ ", "").replace(",", "."));
      this.itemAtual.valorPago = auxPago;

      if (this.novaVenda) {
        if (this.itemAtual.data.length > 0) {
          delete this.itemAtual.id;
          await this.$axios
            .post(`venda`, {
              data: this.itemAtual.data,
              cliente: this.itemAtual.cliente.id,
              observacao: this.itemAtual.observacao,
              tipoPagamento: this.itemAtual.tipoPagamento.id,
              valorPago: this.itemAtual.valorPago,
              valorTotal: this.itemAtual.valorTotal,
            })
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
              this.carregarVendas();
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
              this.carregarVendas();
            });
        }
      } else {
        let idItem = this.itemAtual.id;
        delete this.itemAtual.id;
        await this.$axios
          .put(`venda/${idItem}`, {
            data: this.itemAtual.data,
            cliente: this.itemAtual.cliente.id,
            observacao: this.itemAtual.observacao,
            tipoPagamento: this.itemAtual.tipoPagamento.id,
            valorPago: this.itemAtual.valorPago,
            valorTotal: this.itemAtual.valorTotal,
          })
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
            this.carregarVendas();
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
            this.fecharModal();
            this.carregarVendas();
          });
      }
    },
    async abrirVenda(item) {
      this.tituloModal = "Editar Venda";
      this.itemAtual.id = item.id;
      this.itemAtual.data = item.data;
      this.itemAtual.observacao = item.observacao;
      this.itemAtual.cliente.id = item.cliente.id;
      this.modalItem = true;

      await this.$axios
        .get(`/venda/${item.id}`)
        .then((response) => {
          this.nomeClienteAtual = response.data.cliente.nome;

          let auxTotal = document.querySelector("#valorTotal");
          auxTotal.value = response.data.valorTotal.toFixed(2);
          let auxPago = document.querySelector("#valorPago");
          auxPago.value = response.data.valorPago.toFixed(2);
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
    deletarVenda(item) {
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
              .delete(`venda/${item.id}`)
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
                this.carregarVendas();
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
