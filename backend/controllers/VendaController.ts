import moment from "moment";
import { Venda } from "../models/Venda";
import { AbstractController } from "./AbstractController";
const auth = require("../middlewares/auth");
export class VendaController extends AbstractController {
  protected prefix: string = "/venda";

  get() {
    return async (req: any, res: any, next: any) => {
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }

      let vendas: Array<Venda> | undefined = await Venda.find();
      let totalPages = 1;
      if (vendas.length % req.query.per_page == 0) {
        totalPages = vendas.length / req.query.per_page;
      } else {
        totalPages = vendas.length / req.query.per_page + 1;
      }

      let valorTotal = 0;
      let valorPago = 0;
      vendas.forEach((element) => {
        valorPago += element.valorPago;
        valorTotal += element.valorTotal;
      });

      let result = await Venda.createQueryBuilder("venda")
        .orderBy("venda.data", "ASC")
        .leftJoinAndSelect("venda.cliente", "cliente")
        .leftJoinAndSelect("venda.tipoPagamento", "tipoPagamento")
        .paginate();
      //format data dd/mm/yyyy
      result.data.forEach((element: any) => {
        element.data = moment(element.data).format("DD/MM/YYYY");
      });

      return res
        .status(200)
        .json({ valorPago, valorTotal, totalPages, result });
    };
  }

  getByCliente() {
    return async (req: any, res: any, next: any) => {
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }

      try {
        let vendas: Array<Venda> | undefined = await Venda.createQueryBuilder(
          "venda"
        )
          .orderBy("venda.data", "ASC")
          .where("venda.clienteId = :cliente", { cliente: req.body.cliente })
          .getMany();

        let totalPages = 1;
        if (vendas.length % req.query.per_page == 0) {
          totalPages = vendas.length / req.query.per_page;
        } else {
          totalPages = vendas.length / req.query.per_page + 1;
        }

        let valorTotal = 0;
        let valorPago = 0;
        vendas.forEach((element) => {
          valorPago += element.valorPago;
          valorTotal += element.valorTotal;
        });
        let valorDevendo = valorTotal - valorPago;

        let result: any | undefined = await Venda.createQueryBuilder("venda")
          .orderBy("venda.data", "ASC")
          .where("venda.clienteId = :cliente", { cliente: req.body.cliente })
          .paginate();

        result.data.forEach((element: any) => {
          element.data = moment(element.data).format("DD/MM/YYYY");
        });

        return res
          .status(200)
          .json({ valorPago, valorTotal, valorDevendo, totalPages, result });
      } catch (error) {
        return res.status(500).json({ msg: "Erro interno!" }, error);
      }
    };
  }
  getByClienteMes() {
    return async (req: any, res: any, next: any) => {
      try {
        return res.status(200).send();
      } catch (error) {
        return res.status(500).json({ msg: "Erro interno!", error });
      }
    };
  }

  getByMes() {
    return async (req: any, res: any, next: any) => {
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }

      try {
        let vendas: Array<Venda> | undefined = await Venda.createQueryBuilder(
          "venda"
        )
          .orderBy("venda.data", "ASC")
          .where("venda.data::varchar like :data", {
            data: `${req.body.data}%`,
          })
          .getMany();

        let totalPages = 1;
        if (vendas.length % req.query.per_page == 0) {
          totalPages = vendas.length / req.query.per_page;
        } else {
          totalPages = vendas.length / req.query.per_page + 1;
        }

        let valorTotal = 0;
        let valorPago = 0;
        vendas.forEach((element) => {
          valorPago += element.valorPago;
          valorTotal += element.valorTotal;
        });
        let valorDevendo = valorTotal - valorPago;

        const result = await Venda.createQueryBuilder("venda")
          .orderBy("venda.data", "ASC")
          .leftJoinAndSelect("venda.cliente", "cliente")
          .leftJoinAndSelect("venda.tipoPagamento", "tipoPagamento")
          .where("venda.data::varchar like :data", {
            data: `${req.body.data}%`,
          })
          .paginate();

        result.data.forEach((element: any) => {
          element.data = moment(element.data).format("DD/MM/YYYY");
        });

        return res
          .status(200)
          .json({ valorPago, valorTotal, valorDevendo, totalPages, result });
      } catch (error) {
        return res.status(500).json({ msg: "Erro interno!" }, error);
      }
    };
  }

  create() {
    return async (req: any, res: any, next: any) => {
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }
      try {
        let venda: Venda = new Venda();
        venda.data = req.body.data;
        venda.cliente = req.body.cliente;
        venda.observacao = req.body.observacao;
        venda.tipoPagamento = req.body.tipoPagamento;
        venda.valorPago = req.body.valorPago;
        venda.valorTotal = req.body.valorTotal;

        await venda.save();
        return res
          .status(201)
          .json({ msg: "Venda cadastrada com sucesso!", venda });
      } catch (error) {
        return res.status(500).json({ msg: "Erro interno!", error });
      }
    };
  }

  show() {
    return async (req: any, res: any, next: any) => {
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }
      try {
        let venda: Venda | undefined = await Venda.findOne({
          id: req.params.id,
        });

        if (venda) {
          return res.status(200).json(venda);
        } else {
          return res.status(404).json({ msg: "Venda não encontrada!" });
        }
      } catch (error) {
        return res.status(500).json({ msg: "Erro interno!" });
      }
    };
  }

  update() {
    return async (req: any, res: any, next: any) => {
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }
      try {
        let venda: Venda | undefined = await Venda.findOne({
          id: req.params.id,
        });
        if (venda) {
          venda.data = req.body.data;
          venda.cliente = req.body.cliente;
          venda.observacao = req.body.observacao;
          venda.tipoPagamento = req.body.tipoPagamento;
          venda.valorPago = req.body.valorPago;
          venda.valorTotal = req.body.valorTotal;
          await venda.save();
          return res.status(200).json({
            msg: "Venda atualizada com sucesso!",
            venda,
          });
        } else {
          return res.status(404).json({ msg: "Venda não encontrada!" });
        }
      } catch (error) {
        return res.status(500).json({ msg: "Erro interno!" });
      }
    };
  }
  remove() {
    return async (req: any, res: any, next: any) => {
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }
      try {
        let compra: Venda | undefined = await Venda.findOne({
          id: req.params.id,
        });
        if (compra) {
          await compra.remove();
          return res
            .status(200)
            .json({ msg: "Registro de compra removido com sucesso!" });
        } else {
          return res
            .status(404)
            .json({ msg: "Registro de compra não encontrado!" });
        }
      } catch (error) {
        return res.status(500).json({ msg: "Erro interno!", error });
      }
    };
  }

  registrarRotas() {
    this.forRoute("/").get(this.get());
    this.forRoute("/mes/").post(this.getByMes());
    this.forRoute("/cliente/").post(this.getByCliente());
    this.forRoute("/cliente/mes/").post(this.getByClienteMes());
    this.forRoute("/").post(this.create());
    this.forRoute("/:id").get(this.show());
    this.forRoute("/:id").put(this.update());
    this.forRoute("/:id").delete(this.remove());
  }
}
