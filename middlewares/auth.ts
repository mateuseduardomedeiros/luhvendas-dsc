require("dotenv").config();
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const authConfig = require("../config/auth");

const degub = false;

module.exports = async (req: any, res: any, next: any) => {
  if (degub && process.env.NODE_ENV === "development") {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "Token não fornecido" });
  }
  const [, token] = authHeader.split(" ");

  try {
    await promisify(jwt.verify)(token, authConfig.secret);
    return next();
  } catch (error) {
    return res.status(401).json({ msg: "Token inválido" });
  }
};
