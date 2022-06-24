import { Router } from 'express'
import {
	createFollow,
	showUsersFollowed,
	usersIFollow,
} from '../controllers/followController.js'
import validateSchema from '../middlewares/schemaValidator.js'
import tokenValidator from '../middlewares/tokenValidator.js'
import followSchema from '../schemas/followSchema.js'

const followRouter = Router()

followRouter.post(
	'/follow',
	tokenValidator,
	validateSchema(followSchema),
	createFollow
)
followRouter.get('/follow', tokenValidator, usersIFollow)
followRouter.get('/follow/:userID', showUsersFollowed)

export default followRouter
