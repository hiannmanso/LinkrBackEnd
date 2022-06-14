import { Router } from 'express'
import { signIn } from '../controllers/authController.js'
import loginSchema from '../schemas/loginSchema.js'
import validateSchema from '../middlewares/schemaValidator.js'

const authRouter = Router()

authRouter.post('/signin', validateSchema(loginSchema), signIn)

export default authRouter
