import { Venda } from "../models/Venda";
import { AbstractController } from "./AbstractController";

export class VendaController extends AbstractController {
  protected prefix: string = "/venda";

  get() {
    return async (req: any, res: any) => {
      return res.status(200).json(await Venda.find());
    };
  }

  create() {
    return async (req: any, res: any) => {
      try {
        let venda: Venda = new Venda();
        venda.data = req.body.data;
        venda.cliente = req.body.cliente;
        venda.observacao = req.body.observacao;
        venda.tipoPagamento = req.body.tipoPagamento;
        venda.valorPago = req.body.valorPago;
        venda.valorTotal = req.body.valorTotal;

        await venda.save();
      } catch (error) {
        return res.status(500).json({ msg: "Erro interno!" });
      }
    };
  }

  show() {
    return async (req: any, res: any) => {
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
    return async (req: any, res: any) => {
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
          return res
            .status(404)
            .json({ msg: "Venda não encontrada!" });
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
