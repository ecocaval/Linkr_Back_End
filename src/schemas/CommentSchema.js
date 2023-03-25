import Joi from '@hapi/joi'

export const commentSchema = Joi.object({
    post_id: Joi.number().required(),
    user_id: Joi.number().required(),
    description: Joi.string().max(280).required()
})