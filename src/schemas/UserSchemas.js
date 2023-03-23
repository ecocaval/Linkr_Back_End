import Joi from '@hapi/joi'

export const followSchema = Joi.object({
    follower_id: Joi.number().required(),
    followed_id: Joi.number().required()
})