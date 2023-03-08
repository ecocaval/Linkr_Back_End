import Joi from '@hapi/joi'

export const postSchema = Joi.object({
    link: Joi.string().uri().required(),
    description: Joi.string().max(280)
})