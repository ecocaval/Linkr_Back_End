import { Router } from "express";
import { signUp } from "../controllers/AuthController.js";
import { validateSchema } from "../middlewares/ValidateSchema.js";
import { signUpSchema } from "../schemas/AuthSchemas.js";

const authRouter = Router()

authRouter.post('/signup', validateSchema(signUpSchema), signUp)

export default authRouter