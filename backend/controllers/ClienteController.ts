import { Cliente } from "../models/Cliente";
import { AbstractController } from "./AbstractController";

const validarCamposCliente = require("../middlewares/ClienteValidator");
const auth = require("../middlewares/auth");

export class ClienteController extends AbstractController {
  protected prefix: string = "/cliente";

  get() {
    return async (req: any, res: any, next: any) => {
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }
      let clientes: Array<Cliente> | undefined = await Cliente.find();
      let totalPages = 1;
      if (clientes.length % req.query.per_page == 0) {
        totalPages = clientes.length / req.query.per_page;
      } else {
        totalPages = clientes.length / req.query.per_page + 1;
      }

      let result = await Cliente.createQueryBuilder()
        .orderBy("nome", "ASC")
        .paginate();

      return res.status(200).json({ totalPages, result });
    };
  }
  getByNome() {
    return async (req: any, res: any, next: any) => {
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }
      let clientes: Array<Cliente> | undefined = await Cliente.find();
      let totalPages = 1;
      if (clientes.length % req.query.per_page == 0) {
        totalPages = clientes.length / req.query.per_page;
      } else {
        totalPages = clientes.length / req.query.per_page + 1;
      }

      let result = await Cliente.createQueryBuilder("cliente")
        .where("cliente.nome like :nome", { nome: `%${req.body.nome}%` })
        .orderBy("nome", "ASC")
        .paginate();

      return res.status(200).json({ totalPages, result });
    };
  }

  find() {
    return async (req: any, res: any, next: any) => {
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }
      let result = await Cliente.createQueryBuilder("cliente")
        .where("cliente.nome like :nome", { nome: `${req.body.nome}%` })
        .orderBy("nome", "ASC")
        .getMany();

      return res.status(200).json(result);
    };
  }

  create() {
    return async (req: any, res: any, next: any) => {
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }
      let validouError = await validarCamposCliente(req, res);
      if (validouError) {
        return res.status(400).json({ msg: "Erro de validação!" });
      }
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
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }
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
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }
      let validouError = await validarCamposCliente(req, res);
      if (validouError) {
        return res.status(400).json({ msg: "Erro de validação!" });
      }
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
  remove() {
    return async (req: any, res: any, next: any) => {
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }
      try {
        let cliente: Cliente | undefined = await Cliente.findOne({
          id: req.params.id,
        });
        if (cliente) {
          await cliente.remove();
          return res
            .status(200)
            .json({ msg: "Cliente removido com sucesso!" });
        } else {
          return res
            .status(404)
            .json({ msg: "Cliente não encontrado!" });
        }
      } catch (error) {
        return res.status(500).json({ msg: "Erro interno!", error });
      }
    };
  }

  registrarRotas() {
    this.forRoute("/").get(this.get());
    this.forRoute("/find").post(this.getByNome());
    this.forRoute("/nome").post(this.find());
    this.forRoute("/").post(this.create());
    this.forRoute("/:id").get(this.show());
    this.forRoute("/:id").put(this.update());
    this.forRoute("/:id").delete(this.remove());
  }
}
