import Joi from "joi";

module.exports = async (req: any, res: any) => {
  try {
    const schema = Joi.object({
      data: Joi.string().required(),
      cliente: Joi.number().required(),
      observacao: Joi.string().allow("").optional(),
      tipoPagamento: Joi.number().required(),
      valorPago: Joi.number(),
      valorTotal: Joi.number().required(),
    });

    await schema.validateAsync(req.body);
  } catch (error) {
    return error;
  }
};
