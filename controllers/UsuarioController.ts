import { AbstractController } from "./AbstractController";

export class UsuarioController extends AbstractController {

  protected prefix: string = "/usuario";

  get() {
    return (req: any, res: any) => {
      return res.status(200).json({ msg: "GET usuario" });
    };
  }

  create() {
    return (req: any, res: any) => {
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
