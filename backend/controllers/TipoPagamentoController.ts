import { TipoPagamento } from "../models/TipoPagamento";
import { AbstractController } from "./AbstractController";

const validarCamposTipoPagamento = require("../middlewares/TipoPagamentoValidator");
const auth = require("../middlewares/auth");
export class TipoPagamentoController extends AbstractController {
  protected prefix: string = "/tipopagamento";

  get() {
    return async (req: any, res: any, next: any) => {
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }
      return res.status(200).json(await TipoPagamento.find());
    };
  }

  create() {
    return async (req: any, res: any, next: any) => {
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }

      let validouError = await validarCamposTipoPagamento(req, res);
      if (validouError) {
        return res.status(400).json({ msg: "Erro de validação!" });
      }

      let buscaTipoPagamento:
        | TipoPagamento
        | undefined = await TipoPagamento.findOne({
        nome: req.body.nome.trim(),
      });
      if (buscaTipoPagamento) {
        return res
          .status(403)
          .json({ msg: "Tipo de pagamento já cadastrado!" });
      }
      try {
        let tipopagamento: TipoPagamento = new TipoPagamento();
        tipopagamento.nome = req.body.nome;
        await tipopagamento.save();
        return res.status(201).json({
          msg: "Tipo de pagamento cadastrado com sucesso!",
          tipopagamento,
        });
      } catch (error) {
        return res.status(500).json({ msg: "Erro interno!" });
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
        let tipopagamento:
          | TipoPagamento
          | undefined = await TipoPagamento.findOne({
          id: req.params.id,
        });
        if (tipopagamento) {
          return res.status(200).json(tipopagamento);
        } else {
          return res
            .status(404)
            .json({ msg: "Tipo de pagamento não encontrado!" });
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
      let validouError = await validarCamposTipoPagamento(req, res);
      if (validouError) {
        return res.status(400).json({ msg: "Erro de validação!" });
      }
      try {
        let tipopagamento:
          | TipoPagamento
          | undefined = await TipoPagamento.findOne({
          id: req.params.id,
        });
        if (tipopagamento) {
          tipopagamento.nome = req.body.nome;
          await tipopagamento.save();
          return res.status(200).json({
            msg: "Tipo de pagamento atualizado com sucesso!",
            tipopagamento,
          });
        } else {
          return res
            .status(404)
            .json({ msg: "Tipo de pagamento não encontrado!" });
        }
      } catch (error) {
        return res.status(500).json({ msg: "Erro interno!" });
      }
    };
  }

  registrarRotas() {
    this.forRoute("/").get(this.get());
    this.forRoute("/").post(this.create());
    this.forRoute("/:id").get(this.show());
    this.forRoute("/:id").put(this.update());
  }
}
