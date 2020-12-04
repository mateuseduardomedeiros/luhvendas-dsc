import { TipoPagamento } from "../models/TipoPagamento";
import { AbstractController } from "./AbstractController";

export class TipoPagamentoController extends AbstractController {
  protected prefix: string = "/tipopagamento";

  get() {
    return async (req: any, res: any) => {
      return res.status(200).json(await TipoPagamento.find());
    };
  }

  create() {
    return async (req: any, res: any) => {
      try {
        let tipopagamento: TipoPagamento = new TipoPagamento();
        tipopagamento.nome = req.body.nome;
        await tipopagamento.save();
        return res
          .status(201)
          .json({
            msg: "Tipo de pagamento cadastrado com sucesso!",
            tipopagamento,
          });
      } catch (error) {
        return res.status(500).json({ msg: "Erro interno!" });
      }
    };
  }

  show() {
    return async (req: any, res: any) => {
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
    return async (req: any, res: any) => {
      try {
        let tipopagamento: TipoPagamento  | undefined = await TipoPagamento.findOne({
          id: req.params.id,
        });
        if (tipopagamento) {
          tipopagamento.nome = req.body.nome;
          await tipopagamento.save();
          return res
            .status(200)
            .json({ msg: "Tipo de pagamento atualizado com sucesso!", tipopagamento });
        } else {
          return res.status(404).json({ msg: "Tipo de pagamento não encontrado!" });
        }
      } catch (error) {
        return res.status(500).json({ msg: "Erro interno!" });
      }
    };
  }
  //   remove() {
  //     return (req: any, res: any) => {
  //       return res.status(200).json({ msg: "DELETE usuario" });
  //     };
  //   }

  registrarRotas() {
    this.forRoute("/").get(this.get());
    this.forRoute("/").post(this.create());
    this.forRoute("/:id").get(this.show());
    this.forRoute("/:id").put(this.update());
    // this.forRoute("/:id").delete(this.remove());
  }
}
