import { IController } from "./controllers/IController";
import ControllerContainer from "./controllers/InversifyContainer/ControllerContainer";
import ControllerTypes from "./controllers/InversifyContainer/ControllerTypes";
import {pagination} from 'typeorm-pagination'

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require('cors');

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(pagination)
app.use(cors());

const containers: IController[] = ControllerContainer.getAll<IController>(
  ControllerTypes.Controller
);
containers.forEach(controller => {
    controller.forApp(app).registrarRotas();
});

module.exports = app;
