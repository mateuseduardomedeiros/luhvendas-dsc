import { Container } from "inversify";
import { IController } from "../IController";
import { UsuarioController } from "../UsuarioController";
import ControllerTypes from "./ControllerTypes";

const ControllerContainer = new Container();

ControllerContainer.bind<IController>(ControllerTypes.Controller).to(UsuarioController);

export default ControllerContainer;