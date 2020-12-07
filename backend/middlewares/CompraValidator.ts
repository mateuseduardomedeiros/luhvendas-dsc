import Joi from "joi";

module.exports = async (req: any, res: any) => {
  try {
    const schema = Joi.object({
      data: Joi.string().required(),
      observacao: Joi.string().allow("").optional(),
      valor: Joi.number().required().disallow(0),
    });

    await schema.validateAsync(req.body);
  } catch (error) {
    return error;
  }
};
