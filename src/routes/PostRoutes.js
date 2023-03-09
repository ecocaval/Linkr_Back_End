import { Router } from 'express'
import { getPosts, publishPost } from '../controllers/PostController.js'
import { validateSchema } from '../middlewares/ValidateSchema.js'
import { postSchema } from '../schemas/PostSchema.js'

const postRouter = Router()

postRouter.post("/posts/new", validateSchema(postSchema), publishPost)
postRouter.get("/posts", getPosts)

export default postRouter