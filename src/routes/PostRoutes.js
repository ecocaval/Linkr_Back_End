import { Router } from 'express'
import { deletePost, editPost, getPosts, postLiked, publishPost, toggleLike } from '../controllers/PostController.js'
import { validateSchema } from '../middlewares/ValidateSchema.js'
import { validateToken } from '../middlewares/ValidateToken.js'
import validateUserForDelete from '../middlewares/validateUserForDelete.js'
import { postSchema } from '../schemas/PostSchema.js'

const postRouter = Router()

postRouter.get("/posts", validateToken, getPosts)
postRouter.post("/posts/new", validateToken, validateSchema(postSchema), publishPost)
postRouter.post("/posts/toggle-like", validateToken, toggleLike)
postRouter.post("/posts/liked", postLiked)
postRouter.put("/posts/:postId", validateToken, editPost)
postRouter.delete("/posts/:postId", validateToken, validateUserForDelete, deletePost)

export default postRouter