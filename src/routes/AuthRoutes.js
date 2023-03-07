import { Router } from "express";
import { signIn, signUp } from "../controllers/AuthController.js";
import { validateSchema } from "../middlewares/ValidateSchema.js";
import { signInSchema, signUpSchema } from "../schemas/AuthSchemas.js";

const authRouter = Router()

authRouter.post('/signup', validateSchema(signUpSchema), signUp)
authRouter.post('/signin', validateSchema(signInSchema), signIn)

export default authRouter