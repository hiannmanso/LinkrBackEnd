import { Router } from 'express'
import {
	newPost,
	showAllPosts,
	showPostsByUser,
} from '../controllers/postController.js'
import validateSchema from '../middlewares/schemaValidator.js'
import tokenValidator from '../middlewares/tokenValidator.js'
import postSchema from '../schemas/postSchema.js'

const postRouter = Router()

postRouter.post('/posts', tokenValidator, validateSchema(postSchema), newPost)
postRouter.get('/posts', showAllPosts)
postRouter.get('/posts/:userID', showPostsByUser)
export default postRouter