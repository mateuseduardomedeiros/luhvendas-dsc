<template>
  <div>
    <!-- MODAL MÊS  -->
    <v-dialog v-model="modalMes" width="390px">
      <v-date-picker v-model="mesAno" type="month" locale="pt-br" scrollable>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="modalMes = false">Fechar</v-btn>
        <v-spacer></v-spacer>
      </v-date-picker>
    </v-dialog>
    <!-- MODAL CLIENTE -->
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
                  label="Nome"
                  :hint="
                    `${
                      itemAtual.nome.length === 0
                        ? 'Este campo é obrigatório'
                        : itemAtual.nome.length < 2
                        ? 'Digite pelo menos 2 caracteres'
                        : ''
                    }`
                  "
                  v-model="itemAtual.nome"
                  @keyup.enter="salvarCliente()"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  label="Telefone"
                  hint="Digite um número de telefone"
                  v-model="itemAtual.telefone"
                  clearable
                  counter
                  @keyup.enter="salvarCliente()"
                  v-mask="['(##) #########']"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="error"
            text
            v-if="!novoCliente"
            :disabled="desabilitarBtnDeletar"
            @click="deletarCliente(itemAtual)"
            >Deletar</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="fecharModal()">Fechar</v-btn>
          <v-btn
            color="primary"
            text
            @click="salvarCliente()"
            :disabled="desabilitarBtnSalvar || itemAtual.nome.trim().length < 2"
            >Salvar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- MODAL LISTA DE COMPRAS  -->
    <v-dialog
      v-model="modalCompras"
      scrollable
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title>
          <span class="headline"
            >{{ cliente.nome }} - {{ cliente.telefone }}</span
          >
          <v-layout row wrap>
            <v-flex
              xs12
              sm6
              :class="`d-flex align-center ${isMobile() ? 'mx-3' : 'pl-4'}`"
            >
              <v-spacer v-if="isMobile()"></v-spacer>
            </v-flex>
            <v-flex xs12 sm6 :class="`${isMobile() ? 'mx-3' : 'pr-4'} `">
              <v-text-field
                v-model="mesAnoFormatado"
                :style="isMobile() ? '' : 'padding-top: 0; margin-top: 0;'"
                readonly
                @click="modalMes = true"
                label="Mês"
                hide-details
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-data-table
                  dense
                  :headers="cabecalhosCompra"
                  :items="compras"
                  :loading="carregandoItens"
                  loading-text="Carregando dados..."
                  :search="pesquisar"
                  :page.sync="paginaAtual"
                  :items-per-page="Number(itensPorPagina)"
                  :server-items-length="totalItems"
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
                      Number(item.valorPago.toFixed(2)).toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )
                    }}</span>
                  </template>
                  <!-- eslint-disable-next-line -->
                  <template v-slot:item.valorTotal="{ item }">
                    <span>{{
                      Number(item.valorTotal.toFixed(2)).toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )
                    }}</span>
                  </template>
                  <!-- eslint-disable-next-line -->
                  <template v-slot:item.action="{ item }">
                    <v-icon
                      class="mr-1"
                      small
                      color="info"
                      @click="abrirVenda(item)"
                    >
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
              </v-col>
              <v-col cols="12" sm="12" md="6">
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-title style="padding-top: 0" v-if="itens.length !== 0">
          <v-container
            fluid
            style="padding: 0"
            :class="isMobile() ? 'mt-3 text-center' : ''"
          >
            <v-row
              align="center"
              :class="`${isMobile() ? 'text-center' : 'text-end'}`"
            >
              <v-spacer></v-spacer>
              <v-col cols="12" sm="12">
                <h1 class="subtitle-2 text-no-wrap">
                  Total Vendido:
                  {{
                    Number(valorTotal.toFixed(2)).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  }}
                </h1>
                <h1 class="subtitle-2 text-no-wrap">
                  Total Recebido:
                  {{
                    Number(valorPago.toFixed(2)).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  }}
                </h1>
                <h1
                  class="subtitle-2 text-no-wrap"
                  :class="valorDevendo > 0 ? 'error' : 'success'"
                >
                  Devendo:
                  {{
                    Number(valorDevendo.toFixed(2)).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  }}
                </h1>
              </v-col>
              <v-spacer v-if="isMobile()"></v-spacer>
            </v-row>
          </v-container>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="fecharCompras()">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- MODAL EDITAR COMPRA -->
    <v-dialog
      v-model="modalVenda"
      scrollable
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Editar Venda</span>
        </v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  label="Data"
                  hint="Data da compra"
                  v-model="vendaAtual.data"
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
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-textarea
                  label="Observação"
                  v-model="vendaAtual.observacao"
                  hint="Digite como foi gasto o dinheiro"
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  id="valorTotal"
                  label="Valor Total"
                  v-money="money"
                  hint="Digite o valor total da venda"
                  v-model.lazy="vendaAtual.valorTotal"
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
                  v-model.lazy="vendaAtual.valorPago"
                  clearable
                  @keyup.enter="salvarVenda()"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-select
                  v-model="vendaAtual.tipoPagamento"
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
          <v-btn color="primary" text @click="fecharVenda()">Fechar</v-btn>
          <v-btn
            color="primary"
            text
            @click="salvarVenda()"
            :disabled="
              desabilitarBtnSalvar || vendaAtual.data.trim().length < 2
            "
            >Salvar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card v-if="!(isMobile() && !estadoMenu)">
      <v-card-title style="padding-bottom: 0; ">
        Clientes
        <v-layout row wrap>
          <v-flex
            xs12
            sm6
            :class="`d-flex align-center ${isMobile() ? 'mx-3' : 'pl-4'}`"
          >
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
              v-model="pesquisar"
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
          <template v-slot:item.action="{ item }">
            <v-icon class="mr-1" small color="info" @click="abrirCompras(item)">
              mdi-eye
            </v-icon>
            <v-icon class="mr-1" small color="info" @click="abrirCliente(item)">
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
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mask } from "vue-the-mask";
import { VMoney } from "v-money";
export default {
  directives: { money: VMoney, mask },
  data() {
    return {
      clienteId: 0,
      valorPago: 0,
      valorTotal: 0,
      valorDevendo: 0,
      money: {
        decimal: ",",
        thousands: "",
        prefix: "R$ ",
        precision: 2,
        masked: false,
      },
      carregandoClientes: false,
      desabilitarBtnDeletar: true,
      desabilitarBtnSalvar: false,
      carregandoItens: false,
      esconderMobile: false,
      paginaAtual: 1,
      numeroPaginas: 1,
      itensPorPagina: 10,
      tituloModal: "",
      modalItem: false,
      modalCompras: false,
      modalVenda: false,
      modalMes: false,
      mesAno: "",
      mesAnoFormatado: "",
      nomeClienteAtual: "",
      cliente: {
        nome: "",
        telefone: "",
        id: 0,
      },
      compras: [],
      totalItems: 0,
      pesquisar: "",
      novoCliente: false,
      itens: [],
      itemAtual: {
        nome: "",
        telefone: "",
        id: "",
      },
      vendaAtual: {
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
      pesquisar: "",
      cabecalhosCompra: [
        { text: "Data", align: "left", value: "data", sortable: false },
        {
          text: "Observação",
          align: "left",
          value: "observacao",
          sortable: false,
        },
        {
          text: "Valor Pago",
          align: "left",
          value: "valorPago",
          sortable: false,
        },
        {
          text: "Valor Total",
          align: "left",
          value: "valorTotal",
          sortable: false,
        },
        ,
        { text: "Ação", value: "action", align: "right", sortable: false },
      ],

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
  watch: {
    pesquisar(val) {
      this.carregandoItens = true;
      if (val === "") {
        this.carregandoItens = false;
      }
      if (val !== null && val !== undefined && val.length > 0) {
        this.$axios
          .post(
            `cliente/find/?page=${this.paginaAtual}&limit=${this.itensPorPagina}`,
            { nome: val }
          )
          .then((response) => {
            this.itens = response.data.result.data;
            this.paginaAtual = response.data.current_page;
            this.numeroPaginas = response.data.totalPages;
            this.carregandoItens = false;
          })
          .catch((err) => {
            this.fecharModal();
          });
      } else {
        this.carregarClientes();
      }
    },
    mesAno(val) {
      this.mesAnoFormatado = `${val.split("-")[1]}/${val.split("-")[0]}`;

      this.$axios
        .post(
          `venda/cliente/mes/?per_page=${this.itensPorPagina}&page=${this.paginaAtual}`,
          {
            data: this.mesAno,
            cliente: this.clienteId,
          }
        )
        .then((response) => {
          this.compras = response.data.vendas;
          this.valorTotal = response.data.valorTotal;
          this.valorPago = response.data.valorPago;
          this.modalMes = false;
        });
    },
  },
  created() {
    this.noAuth();
  },
  methods: {
    async noAuth() {
      if (!localStorage.token) {
        this.$swal({
          toast: true,
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 3000,
          position: "top-end",
          icon: "error",
          title: "Falha!",
          text: "Realize login para ver isso!",
        });
        this.$router.push("/login");
      } else {
        this.carregarClientes();
      }
    },
    async carregarClientes() {
      this.carregandoClientes = true;
      await this.$axios
        .get(
          `cliente/?page=${this.paginaAtual}&per_page=${this.itensPorPagina}`
        )
        .then((response) => {
          this.itens = response.data.result.data;
          this.carregandoClientes = false;
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
            text: "Erro ao carregar Clientes!",
          });
        });
    },
    abrirModal() {
      this.modalItem = true;
      this.tituloModal = "Cadastrar Cliente";
      this.novoCliente = true;
    },
    fecharModal() {
      this.carregandoClientes = false;
      this.modalItem = false;
      setTimeout(() => {
        this.itemAtual.nome = "";
        this.itemAtual.telefone = "";
        this.itemAtual.id = "";
        this.novoCliente = false;
      }, 100);
    },
    async salvarCliente() {
      this.desabilitarBtnSalvar = true;
      if (this.novoCliente) {
        if (this.itemAtual.nome.length > 0) {
          delete this.itemAtual.id;
          await this.$axios
            .post(`cliente`, { ...this.itemAtual })
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
                text: response.data.cliente.nome,
              });

              this.fecharModal();
              this.carregarClientes();
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
          .put(`cliente/${idItem}`, { ...this.itemAtual })
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
              text: response.data.cliente.nome,
            });
            this.fecharModal();
            this.carregarClientes();
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
            this.itemAtual.id = idItem;
          });
      }
    },
    async abrirCliente(item) {
      await this.$axios
        .get(`/cliente/${item.id}`)
        .then((response) => {
          this.desabilitarBtnDeletar = response.data.length > 0 ? true : false;
          this.tituloModal = "Editar Cliente";
          this.itemAtual.nome = item.nome;
          this.itemAtual.telefone = item.telefone;
          this.itemAtual.id = item.id;
          this.modalItem = true;
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
    async deletarCliente(item) {
      this.$swal
        .fire({
          title: "Tem certeza que deseja deletar esse Cliente?",
          text: "Todas as vendas vinculadas a ele serão deletadas.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#008000",
          cancelButtonColor: "#d33",
          cancelButtonText: "Não",
          confirmButtonText: "Sim",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            await this.$axios
              .delete(`cliente/${item.id}`)
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
                this.carregarClientes();
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
    async abrirCompras(item) {
      this.modalCompras = true;
      this.cliente.nome = item.nome;
      this.cliente.telefone = item.telefone;
      this.cliente.id = item.id;
      this.clienteId = item.id;
      await this.$axios
        .post(`venda/cliente/?per_page=${this.itensPorPagina}`, {
          cliente: item.id,
        })
        .then((response) => {
          this.valorPago = response.data.valorPago;
          this.valorTotal = response.data.valorTotal;
          this.valorDevendo = response.data.valorDevendo;
          this.compras = response.data.result.data;
          this.totalItems = response.data.result.total;
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
        .then(async (result) => {
          if (result.isConfirmed) {
            await this.$axios
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
                this.modalCompras = false;
                this.abrirCompras(this.cliente);
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
                this.fecharModal();
              });
          }
        });
    },
    async abrirVenda(item) {
      this.vendaAtual.id = item.id;
      this.vendaAtual.data = item.data;
      this.vendaAtual.observacao = item.observacao;
      this.modalVenda = true;
      await this.$axios
        .get(`/venda/${item.id}`)
        .then((response) => {
          this.nomeClienteAtual = response.data.cliente.nome;
          this.vendaAtual.cliente.id = response.data.cliente.id;
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
    async salvarVenda() {
      this.desabilitarBtnSalvar = true;
      let auxTotal = String(this.vendaAtual.valorTotal);
      auxTotal = Number(auxTotal.replace("R$ ", "").replace(",", "."));
      this.vendaAtual.valorTotal = auxTotal;
      let auxPago = String(this.vendaAtual.valorPago);
      auxPago = Number(auxPago.replace("R$ ", "").replace(",", "."));
      this.vendaAtual.valorPago = auxPago;
      let idItem = this.vendaAtual.id;
      await this.$axios
        .put(`venda/${idItem}`, {
          data: this.vendaAtual.data,
          cliente: this.vendaAtual.cliente.id,
          observacao: this.vendaAtual.observacao,
          tipoPagamento: this.vendaAtual.tipoPagamento.id,
          valorPago: this.vendaAtual.valorPago,
          valorTotal: this.vendaAtual.valorTotal,
        })
        .then(async (response) => {
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
          await this.$axios
            .post(`venda/cliente/?per_page=${this.itensPorPagina}`, {
              cliente: this.vendaAtual.cliente.id,
            })
            .then((response) => {
              this.compras = response.data.result.data;
              this.valorPago = response.data.valorPago;
              this.valorTotal = response.data.valorTotal;
              this.valorDevendo = response.data.valorDevendo;
              this.fecharVenda();
            });
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
    },
    async fecharCompras() {
      this.modalCompras = false;
      this.cliente.nome = "";
      this.cliente.telefone = "";
      this.cliente.id = "";
    },
    async fecharVenda() {
      this.modalVenda = false;
      setTimeout(() => {
        this.nomeClienteAtual = "";
        this.vendaAtual.data = "";
        this.vendaAtual.cliente.id = 0;
        this.vendaAtual.observacao = "";
        const auxTotal = document.querySelector("#valorTotal");
        auxTotal.value = 0;
        const auxPago = document.querySelector("#valorPago");
        auxPago.value = 0;
        this.vendaAtual.tipoPagamento.id = 1;
        this.vendaAtual.id = "";
      }, 100);
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
