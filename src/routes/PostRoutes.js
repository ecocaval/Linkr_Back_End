import { Router } from 'express'
import { toggleLike, getPosts, publishPost } from '../controllers/PostController.js'
import { validateSchema } from '../middlewares/ValidateSchema.js'
import { validateToken } from '../middlewares/ValidateToken.js'
import { postSchema } from '../schemas/PostSchema.js'

const postRouter = Router()

postRouter.post("/posts/new", validateToken, validateSchema(postSchema), publishPost)
postRouter.get("/posts", getPosts)
postRouter.post("/posts/toggle-like", validateToken, toggleLike)

export default postRouter