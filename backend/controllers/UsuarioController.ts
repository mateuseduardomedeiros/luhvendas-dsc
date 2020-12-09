import { Usuario } from "../models/Usuario";
import { AbstractController } from "./AbstractController";
const auth = require("../middlewares/auth");
export class UsuarioController extends AbstractController {
  protected prefix: string = "/usuario";

  get() {
    return async (req: any, res: any, next: any) => {
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }
      return res.status(200).json(await Usuario.find());
    };
  }

  show() {
    return async (req: any, res: any, next: any) => {
      let autenticou = await auth(req, res);
      if (autenticou.error) {
        return res.status(403).json({ msg: autenticou.msg });
      }
      try {
        let usuario: Usuario | undefined = await Usuario.findOne({
          id: req.params.id,
        });
        if (usuario) {
          return res.status(200).json(usuario);
        } else {
          return res.status(404).json({ msg: "Usuario não encontrado!" });
        }
      } catch (error) {
        return res.status(500).json({ msg: "Erro interno!" });
      }
    };
  }

  registrarRotas() {
    this.forRoute("/").get(this.get());
    this.forRoute("/:id").get(this.show());
  }
}
