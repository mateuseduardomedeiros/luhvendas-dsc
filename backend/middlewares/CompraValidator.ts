import Joi from "joi";

module.exports = async (req: any, res: any, next: any) => {
  try {
    const schema = Joi.object({
      data: Joi.string().required(),
      observacao: Joi.string().allow('').optional(),
      valor: Joi.number().required()
    });

    await schema.validateAsync(req.body);

  } catch (error) {
    return res
      .status(400)
      .json({ msg: "Erro de validação!", error: error.message });
  }
};
