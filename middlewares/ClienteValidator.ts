import Joi from "joi";

module.exports = async (req: any, res: any, next: any) => {
  try {
    const schema = Joi.object({
      nome: Joi.string().required(),
      telefone: Joi.string().required().length(14),
    });

    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ msg: "Erro de validação!", error: error.message });
  }
};
