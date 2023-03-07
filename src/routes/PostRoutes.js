import { Router } from 'express'
import { publishPost } from '../controllers/PostController.js'
import { validateSchema } from '../middlewares/ValidateSchema.js'
import { postSchema } from '../schemas/PostSchema.js'

const postRouter = Router()

postRouter.post("/posts/new", validateSchema(postSchema), publishPost)

export default postRouter