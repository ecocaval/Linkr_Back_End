import { Router } from 'express'
import { getMyUser, getUsers } from '../controllers/UserController.js'
import { validateToken } from '../middlewares/ValidateToken.js'

const userRouter = Router()

userRouter.get("/users", validateToken, getUsers)
userRouter.get("/my_user", validateToken, getMyUser)

export default userRouter