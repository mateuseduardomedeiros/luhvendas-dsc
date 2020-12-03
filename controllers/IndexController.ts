import { AbstractController } from "./AbstractController";

export class IndexController extends AbstractController {
  protected prefix: string = '/'

  hello() {
    return (req: any, res: any) => {
      res.status(200).json({ msg: "LuhVendas API v1" });
    };
  }

  registrarRotas() {
    this.forRoute('/').get(this.hello());
  }
}
