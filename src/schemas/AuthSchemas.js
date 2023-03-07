import Joi from "joi"

export const signUpSchema = Joi.object({
  name: Joi.string().invalid('').required(),
  email: Joi.string().email().required(),
  password: Joi.string().invalid('').required(),
  image: Joi.string().uri().required()
}) 