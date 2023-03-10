import { Router } from 'express'
import { deletePost, getPosts, publishPost } from '../controllers/PostController.js'
import { validateSchema } from '../middlewares/ValidateSchema.js'
import { validateToken } from '../middlewares/ValidateToken.js'
import validateUserForDelete from '../middlewares/validateUserForDelete.js'
import { postSchema } from '../schemas/PostSchema.js'

const postRouter = Router()

postRouter.get("/posts", validateToken, getPosts)
postRouter.post("/posts/new", validateToken, validateSchema(postSchema), publishPost)
postRouter.delete("/post/:postId", validateToken, validateUserForDelete, deletePost)

export default postRouter