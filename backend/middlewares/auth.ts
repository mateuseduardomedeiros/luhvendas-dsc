require("dotenv").config();

const jwt = require("jsonwebtoken");

const { promisify } = require("util");

const authConfig = require("../config/auth");

const degub = false;

module.exports = async (req: any, res: any) => {
  if (degub && process.env.NODE_ENV === "development") {
    return true;
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return { error: true, msg: "Token não fornecido" };
  }

  const [, token] = authHeader.split(" ");

  try {
    await promisify(jwt.verify)(token, authConfig.default.secret);
    return { error: false };
  } catch (error) {
    return { error: true, msg: "Token inválido" };
  }
};
