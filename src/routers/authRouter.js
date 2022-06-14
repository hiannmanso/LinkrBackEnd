import { Router } from "express";
import { signIn } from "../controllers/authController.js";
import loginSchema from "../schemas/loginSchema.js";

const authRouter = Router();

authRouter.post('/signin', validateSchema(loginSchema), signIn);

export default authRouter;