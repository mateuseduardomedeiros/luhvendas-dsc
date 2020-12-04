import { Usuario } from "../models/Usuario";
import { AbstractController } from "./AbstractController";
import * as jwt from "jsonwebtoken";
import authConfig from "../config/auth";

export class SessaoController extends AbstractController {
  protected prefix: string = "/login";

  login() {
    return async (req: any, res: any, next: any) => {
      let usuario: Usuario | undefined = await Usuario.findOne({
        login: req.body.login,
      });
      if (!usuario) {
        return res.status(404).json({ msg: "Usuário não existe!" });
      }

      if (usuario.checkSenha(req.body.senha)) {
        return res.status(200).json({
          nome: usuario.nome,
          token: jwt.sign(
            { nome: usuario.nome, usuarioId: usuario.id },
            authConfig.secret,
            { expiresIn: authConfig.expiresIn }
          ),
        });
      } else {
        return res.status(400).json({ msg: "Senha incorreta!" });
      }
    };
  }

  registrarRotas(): void {
    this.forRoute("/").post(this.login());
  }
}
