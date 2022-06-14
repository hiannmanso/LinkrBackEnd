import { Router } from "express";
import { singIn } from "../controllers/authController.js";
import loginSchema from "../schemas/loginSchema.js";

const authRouter = Router();

authRouter.post('/signin', validateSchema(loginSchema), singIn);

export default authRouter;