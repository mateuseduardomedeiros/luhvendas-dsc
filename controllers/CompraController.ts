import { Compra } from "../models/Compra";
import { AbstractController } from "./AbstractController";


export class CompraController extends AbstractController {
  protected prefix: string = "/compra";

  get() {
    return async (req: any, res: any, next: any) => {
      return res.status(200).json(await Compra.find());
    };
  }

  create() {
    return async (req: any, res: any, next: any) => {
      //await clienteValidateFields();
      try {
        let compra: Compra = new Compra();
        compra.data = req.body.data;
        compra.observacao = req.body.observacao;
        compra.valor = req.body.valor;
        await compra.save();
        return res
          .status(201)
          .json({ msg: "Compra cadastrada com sucesso!", compra });
      } catch (error) {}
    };
  }

  show() {
    return async (req: any, res: any, next: any) => {
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
  // remove() {
  //   return (req: any, res: any) => {
  //     return res.status(200).json({ msg: "DELETE usuario" });
  //   };
  // }

  registrarRotas() {
    this.forRoute("/").get(this.get());
    this.forRoute("/").post(this.create());
    this.forRoute("/:id").get(this.show());
    this.forRoute("/:id").put(this.update());
    //this.forRoute("/:id").delete(this.remove());
  }
}
