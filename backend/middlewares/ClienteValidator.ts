import Joi from "joi";

module.exports = async (req: any, res: any) => {
  try {
    const schema = Joi.object({
      nome: Joi.string().required(),
      telefone: Joi.string().allow("").optional(),
    });

    await schema.validateAsync(req.body);
  } catch (error) {
    return error
  }
};
