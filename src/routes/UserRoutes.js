import { Router } from 'express'
import { deleteFollow, followUser, getMyUser, getUsers } from '../controllers/UserController.js'
import { validateToken } from '../middlewares/ValidateToken.js'
import { validateSchema } from "../middlewares/ValidateSchema.js";
import { followSchema } from '../schemas/UserSchemas.js';

const userRouter = Router()

userRouter.get("/users", validateToken, getUsers)
userRouter.get("/my_user", validateToken, getMyUser)
userRouter.post("/follow", validateSchema(followSchema) ,followUser)
userRouter.delete("/follow/delete", validateSchema(followSchema), deleteFollow)

export default userRouter