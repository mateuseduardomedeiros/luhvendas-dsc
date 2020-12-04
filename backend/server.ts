import { createConnection } from "typeorm";

require("dotenv").config();
const consola = require("consola");
const app = require("./app");

const { PORT, NODE_ENV } = process.env;

createConnection().then(() => {
  consola.success({ message: `Banco de dados conectado!` });
  app.listen(PORT || 3000, () => {
    consola.success({
      message: `Servidor rodando em: http://localhost:${PORT || 3000}`,
    });
    consola.success({ message: `Ambiente: ${NODE_ENV}` });
  });
});
