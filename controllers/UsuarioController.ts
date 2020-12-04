import { Usuario } from "../models/Usuario";
import { AbstractController } from "./AbstractController";

export class UsuarioController extends AbstractController {
  protected prefix: string = "/usuario";

  get() {
    return async (req: any, res: any) => {
      return res.status(200).json(await Usuario.find());
    };
  }

  create() {
    return (req: any, res: any) => {
      let usuario: Usuario = new Usuario();
      usuario.nome = req.body.nome
      usuario.login = req.body.login;
      return res.status(201).json({ msg: "POST usuario" });
    };
  }

  show() {
    return (req: any, res: any) => {
      return res.status(200).json({ msg: "GET:id usuario" });
    };
  }

  update() {
    return (req: any, res: any) => {
      return res.status(200).json({ msg: "PUT usuario" });
    };
  }
  remove() {
    return (req: any, res: any) => {
      return res.status(200).json({ msg: "DELETE usuario" });
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
