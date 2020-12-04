import { Container } from "inversify";
import { ClienteController } from "../ClienteController";
import { CompraController } from "../CompraController";
import { IController } from "../IController";
import { IndexController } from "../IndexController";
import { SessaoController } from "../SessaoController";
import { TipoPagamentoController } from "../TipoPagamentoController";
import { UsuarioController } from "../UsuarioController";
import ControllerTypes from "./ControllerTypes";

const ControllerContainer = new Container();

ControllerContainer.bind<IController>(ControllerTypes.Controller).to(IndexController);
ControllerContainer.bind<IController>(ControllerTypes.Controller).to(TipoPagamentoController);
ControllerContainer.bind<IController>(ControllerTypes.Controller).to(UsuarioController);
ControllerContainer.bind<IController>(ControllerTypes.Controller).to(SessaoController);
ControllerContainer.bind<IController>(ControllerTypes.Controller).to(CompraController);
ControllerContainer.bind<IController>(ControllerTypes.Controller).to(ClienteController);

export default ControllerContainer;