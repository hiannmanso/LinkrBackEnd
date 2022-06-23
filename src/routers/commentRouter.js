import { Router } from 'express'
import { commentGET, commentPOST } from '../controllers/commentController.js'

const commentRouter = Router()

commentRouter.post('/comments', commentPOST)
commentRouter.get('/comments/:postID', commentGET)

export default commentRouter
