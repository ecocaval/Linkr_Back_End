import { Router } from 'express'
import { addComment, deletePost, editPost, getComments, getPosts, postLiked, publishPost, sharePost, toggleLike } from '../controllers/PostController.js'
import { validateSchema } from '../middlewares/ValidateSchema.js'
import { validateToken } from '../middlewares/ValidateToken.js'
import validateUserForDelete from '../middlewares/validateUserForDelete.js'
import { postSchema } from '../schemas/PostSchema.js'

const postRouter = Router()

postRouter.get("/posts/:id?", validateToken, getPosts)
postRouter.post("/posts/new", validateToken, validateSchema(postSchema), publishPost)
postRouter.post("/posts/toggle-like", validateToken, toggleLike)
postRouter.post("/posts/liked", postLiked)
postRouter.put("/posts/:postId", validateToken, editPost)
postRouter.delete("/posts/:postId", validateToken, validateUserForDelete, deletePost)
postRouter.get("/posts/comments/:postId", validateToken, getComments)
postRouter.post("/posts/comments", validateToken, addComment)
postRouter.post("/posts/share", sharePost)

export default postRouter