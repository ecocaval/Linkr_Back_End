import { Router } from 'express'
import { deleteFollow, followUser, getMyUser, getUsers } from '../controllers/UserController.js'
import { validateToken } from '../middlewares/ValidateToken.js'

const userRouter = Router()

userRouter.get("/users", validateToken, getUsers)
userRouter.get("/my_user", validateToken, getMyUser)
userRouter.post("/users/:followed_id/follow", validateToken, followUser)
userRouter.delete("/users/:followed_id/unfollow", validateToken, deleteFollow)

export default userRouter