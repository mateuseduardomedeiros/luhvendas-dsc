import { Compra } from "../models/Compra";
import { AbstractController } from "./AbstractController";
import moment from "moment";

const validarCamposCompra = require("../middlewares/CompraValidator");
const auth = require("../middlewares/auth");
export class CompraController extends AbstractController {
  protected prefix: string = "/compra";

  get() {
    return async (req: any, res: any, next: any) => {
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }
      let compras: Array<Compra> | undefined = await Compra.find();
      let totalPages = 1;
      if (compras.length % req.query.per_page == 0) {
        totalPages = compras.length / req.query.per_page;
      } else {
        totalPages = compras.length / req.query.per_page + 1;
      }

      let result = await Compra.createQueryBuilder()
        .orderBy("data", "ASC")
        .paginate();
      //format data dd/mm/yyyy
      result.data.forEach((element: any) => {
        element.data = moment(element.data).format("DD/MM/YYYY");
      });

      return res.status(200).json({ totalPages, result });
    };
  }

  create() {
    return async (req: any, res: any, next: any) => {
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }
      let validouError = await validarCamposCompra(req, res);
      if (validouError) {
        return res.status(400).json({ msg: "Erro de validação!" });
      }

      try {
        let compra: Compra = new Compra();
        compra.data = req.body.data;
        compra.observacao = req.body.observacao;
        compra.valor = req.body.valor;
        await compra.save();
        return res
          .status(201)
          .json({ msg: "Compra cadastrada com sucesso!", compra });
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
        let compra: Compra | undefined = await Compra.findOne({
          id: req.params.id,
        });
        if (compra) {
          return res.status(200).json(compra);
        } else {
          return res.status(404).json({ msg: "Compra não encontrada!" });
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
      let validouError = await validarCamposCompra(req, res);
      if (validouError) {
        return res.status(400).json({ msg: "Erro de validação!" });
      }
      try {
        let compra: Compra | undefined = await Compra.findOne({
          id: req.params.id,
        });
        if (compra) {
          compra.data = req.body.data;
          compra.observacao = req.body.observacao;
          compra.valor = req.body.valor;
          await compra.save();
          return res
            .status(200)
            .json({ msg: "Compra atualizada com sucesso!", compra });
        } else {
          return res.status(404).json({ msg: "Compra não encontrada!" });
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
        let compra: Compra | undefined = await Compra.findOne({
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
    this.forRoute("/").post(this.create());
    this.forRoute("/:id").get(this.show());
    this.forRoute("/:id").put(this.update());
    this.forRoute("/:id").delete(this.remove());
  }
}
