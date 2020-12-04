import { Usuario } from "../models/Usuario";
import { AbstractController } from "./AbstractController";

export class UsuarioController extends AbstractController {
  protected prefix: string = "/usuario";

  get() {
    return async (req: any, res: any, next: any) => {
      return res.status(200).json(await Usuario.find());
    };
  }

  create() {
    return async (req: any, res: any, next: any) => {
      try {
        let usuario: Usuario = new Usuario();
        usuario.nome = req.body.nome;
        usuario.login = req.body.login;
        usuario.senha = req.body.senha;
        await usuario.hashSenha();
        await usuario.save();
        return res
          .status(201)
          .json({ msg: "Usuário cadastrado com sucesso!", usuario });
      } catch (error) {
        return;
      }
    };
  }

  show() {
    return async (req: any, res: any, next: any) => {
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

  update() {
    return (req: any, res: any, next: any) => {
      return res.status(200).json({ msg: "PUT usuario" });
    };
  }
  remove() {
    return (req: any, res: any, next: any) => {
      return res.status(200).json({ msg: "DELETE usuario" });
    };
  }

  registrarRotas() {
    this.forRoute("/").get(this.get());
    // this.forRoute("/").post(this.create());
    this.forRoute("/:id").get(this.show());
    // this.forRoute("/:id").put(this.update());
    // this.forRoute("/:id").delete(this.remove());
  }
}
