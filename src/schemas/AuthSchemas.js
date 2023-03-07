import Joi from "@hapi/joi"

export const signUpSchema = Joi.object({
  name: Joi.string().invalid('').required(),
  email: Joi.string().email().required(),
  password: Joi.string().invalid('').required(),
  image: Joi.string().uri().required()
}) 

export const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().invalid('').required()
})