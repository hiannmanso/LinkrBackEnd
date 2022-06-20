import { Router } from 'express'
import { infoUser } from '../controllers/userController.js'
import validateSchema from '../middlewares/schemaValidator.js'
import tokenValidator from '../middlewares/tokenValidator.js'

const userRouter = Router()

userRouter.get('/users', tokenValidator, infoUser)
//userRouter.get('/endPoint', endPoint);

export default userRouter
