import { Router } from 'express'
import {
	deletePost,
	deletePostHash,
	getRankingHash,
	newPost,
	showAllPosts,
	showPostsByHastags,
	showPostsByUser,
	toEditPost,
} from '../controllers/postController.js'
import validateSchema from '../middlewares/schemaValidator.js'
import tokenValidator from '../middlewares/tokenValidator.js'
import editPostSchema from '../schemas/editPostSchema.js'
import postSchema from '../schemas/postSchema.js'

const postRouter = Router()

postRouter.post('/posts', tokenValidator, validateSchema(postSchema), newPost)
postRouter.get('/posts', showAllPosts)
postRouter.get('/posts/:userID', showPostsByUser)
postRouter.put(
	'/posts/:id',
	tokenValidator,
	validateSchema(editPostSchema),
	toEditPost
)
postRouter.get('/hashtag/:hashtag', showPostsByHastags)
postRouter.get('/ranking', getRankingHash)
postRouter.delete('/posts/:postID', deletePost)

export default postRouter
