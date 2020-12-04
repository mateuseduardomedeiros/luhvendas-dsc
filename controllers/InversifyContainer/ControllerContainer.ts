import { Container } from "inversify";
import { IController } from "../IController";
import { IndexController } from "../IndexController";
import { SessaoController } from "../SessaoController";
import { UsuarioController } from "../UsuarioController";
import ControllerTypes from "./ControllerTypes";

const ControllerContainer = new Container();

ControllerContainer.bind<IController>(ControllerTypes.Controller).to(IndexController);
ControllerContainer.bind<IController>(ControllerTypes.Controller).to(UsuarioController);
ControllerContainer.bind<IController>(ControllerTypes.Controller).to(SessaoController);

export default ControllerContainer;