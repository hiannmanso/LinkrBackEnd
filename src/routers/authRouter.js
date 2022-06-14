import { Router } from 'express'
import { signIn } from '../controllers/authController.js'
import { createUser } from '../controllers/userController.js'
import loginSchema from '../schemas/loginSchema.js'
import userSchema from '../schemas/userSchema.js'
import validateSchema from '../middlewares/schemaValidator.js'

const authRouter = Router()

authRouter.post('/signin', validateSchema(loginSchema), signIn)
authRouter.post('/signup', validateSchema(userSchema), createUser);

export default authRouter
