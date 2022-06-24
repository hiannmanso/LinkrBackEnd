import { Router } from 'express'
import { getUser, searchUser } from '../controllers/userController.js'
import { createUser } from '../controllers/userController.js'
import userSchema from '../schemas/userSchema.js'
import validateSchema from '../middlewares/schemaValidator.js'
import tokenValidator from '../middlewares/tokenValidator.js'

const userRouter = Router()

userRouter.get('/user/:userID', getUser)
userRouter.post('/signup', validateSchema(userSchema), createUser)
userRouter.get('/users/:userName', tokenValidator, searchUser)

export default userRouter
