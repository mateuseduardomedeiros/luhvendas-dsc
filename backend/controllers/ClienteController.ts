import { Cliente } from "../models/Cliente";
import { AbstractController } from "./AbstractController";

const validarCamposCliente = require("../middlewares/ClienteValidator");
const auth = require("../middlewares/auth");

export class ClienteController extends AbstractController {
  protected prefix: string = "/cliente";

  get() {
    return async (req: any, res: any, next: any) => {
      auth(req, res, next);
      let clientes: Array<Cliente> | undefined = await Cliente.find();
      let totalPages = 1;
      if (clientes.length % req.query.per_page == 0) {
        totalPages = clientes.length / req.query.per_page;
      } else {
        totalPages = clientes.length / req.query.per_page + 1;
      }

      let result = await Cliente.createQueryBuilder().paginate();

      return res.status(200).json({ totalPages, result });
    };
  }

  create() {
    return async (req: any, res: any, next: any) => {
      await auth(req, res, next);
      await validarCamposCliente(req, res, next);
      let buscaCliente: Cliente | undefined = await Cliente.findOne({
        where: { nome: req.body.nome },
      });
      if (buscaCliente) {
        return res.status(403).json({ msg: "Cliente já cadastrado!" });
      }
      try {
        let cliente: Cliente = new Cliente();
        cliente.nome = req.body.nome;
        cliente.telefone = req.body.telefone;
        await cliente.save();
        return res
          .status(201)
          .json({ msg: "Cliente cadastrado com sucesso!", cliente });
      } catch (error) {
        return res.status(500).json({ msg: "Erro interno!", error });
      }
    };
  }

  show() {
    return async (req: any, res: any, next: any) => {
      await auth(req, res, next);
      try {
        let cliente: Cliente | undefined = await Cliente.findOne({
          id: req.params.id,
        });
        if (cliente) {
          return res.status(200).json(cliente);
        } else {
          return res.status(404).json({ msg: "Cliente não encontrado!" });
        }
      } catch (error) {
        return res.status(500).json({ msg: "Erro interno!" });
      }
    };
  }

  update() {
    return async (req: any, res: any, next: any) => {
      await auth(req, res, next);
      try {
        let cliente: Cliente | undefined = await Cliente.findOne({
          id: req.params.id,
        });
        if (cliente) {
          cliente.nome = req.body.nome;
          cliente.telefone = req.body.telefone;
          await cliente.save();
          return res
            .status(200)
            .json({ msg: "Cliente atualizado com sucesso!", cliente });
        } else {
          return res.status(404).json({ msg: "Cliente não encontrado!" });
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
