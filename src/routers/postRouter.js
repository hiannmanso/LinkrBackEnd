import { Router } from 'express'
import {
	deletePost,
	getPost,
	deletePostHash,
	getRankingHash,
	newPost,
	showAllPosts,
	showPostsByHastags,
	showPostsByUser,
	toEditPost,
	repostPOST,
	repostGET,
} from '../controllers/postController.js'
import validateSchema from '../middlewares/schemaValidator.js'
import tokenValidator from '../middlewares/tokenValidator.js'
import editPostSchema from '../schemas/editPostSchema.js'
import postSchema from '../schemas/postSchema.js'

const postRouter = Router()

postRouter.post('/posts', tokenValidator, validateSchema(postSchema), newPost)
postRouter.get('/posts', tokenValidator, showAllPosts)
postRouter.get('/posts/:userID', tokenValidator, showPostsByUser)
postRouter.put(
	'/posts/:id',
	tokenValidator,
	validateSchema(editPostSchema),
	toEditPost
)
postRouter.get('/hashtag/:hashtag', tokenValidator, showPostsByHastags)
postRouter.get('/ranking', getRankingHash)
postRouter.delete('/posts/:postID', deletePost)
postRouter.get('/post/:id', getPost)
postRouter.post('/repost', repostPOST)
postRouter.get('/repost', repostGET)

export default postRouter
