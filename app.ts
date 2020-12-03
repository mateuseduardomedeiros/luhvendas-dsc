import { IndexController } from "./controllers/IndexController";
import { UsuarioController } from "./controllers/UsuarioController";

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var consola = require('consola');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

new IndexController().forApp(app).registrarRotas();
new UsuarioController().forApp(app).registrarRotas();

consola.success({message: 'Servidor rodando em: http://localhost:3000'})

module.exports = app;
