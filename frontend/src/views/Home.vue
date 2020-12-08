<template>
  <div>
    <v-row>
      <Card
        icon="cart"
        :md="6"
        color="#4D95C5"
        titulo="Compras do Mês"
        :info="
          totalCompra
            .toFixed(2)
            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        "
      />
      <Card
        icon="currency-usd"
        :md="6"
        color="#E67F36"
        titulo="Vendas do Mês"
        :info="
          totalVendas
            .toFixed(2)
            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        "
      />

      <Card
        icon="cash-usd"
        :md="6"
        color="#53BD9D"
        titulo="Valor Recebido"
        :info="
          totalRecebido
            .toFixed(2)
            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        "
      />
      <Card
        icon="currency-usd-off"
        :md="6"
        color="#E74C3C"
        titulo="Total Devendo"
        :info="
          totalDevendo
            .toFixed(2)
            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        "
      />
      <Card
        icon="home-currency-usd"
        :md="12"
        :color="lucro > 0 ? '#3D844A' : '#E74C3C'"
        titulo="Lucro"
        :info="
          lucro
            .toFixed(2)
            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        "
      />
    </v-row>
  </div>
</template>

<script>
// @ is an alias to /src
import Card from "@/components/Card.vue";
import NavBar from "@/components/NavBar.vue";
import moment from "moment";

export default {
  name: "Home",
  components: {
    NavBar,
    Card,
  },
  data() {
    return {
      itens: [],
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
      ],
      totalVendas: 0,
      totalRecebido: 0,
      totalDevendo: 0,
      totalCompra: 0,
      lucro: 0,
      paginaAtual: 1,
      numeroPaginas: 1,
      itensPorPagina: 5,
    };
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
        this.carregarVendasMes();
      }
    },
    async carregarVendasMes() {
      try {
        let mes = moment().format("YYYY-MM");
        await this.$axios
          .post(
            `venda/mes/?per_page=${this.itensPorPagina}&page=${this.paginaAtual}`,
            { data: mes }
          )
          .then((response) => {
            this.totalVendas = response.data.valorTotal;
            this.totalRecebido = response.data.valorPago;
            this.totalDevendo = response.data.valorDevendo;
            this.itens = response.data.result.data;
            this.numeroPaginas = parseInt(response.data.totalPages);
          });
        await this.$axios
          .post(
            `compra/mes/?per_page=${this.itensPorPagina}&page=${this.paginaAtual}`,
            { data: mes }
          )
          .then((response) => {
            this.totalCompra = response.data.valorTotal;
          });

        this.lucro = this.totalVendas - this.totalCompra;
      } catch (error) {
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
      }
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
