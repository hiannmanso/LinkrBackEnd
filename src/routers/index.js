import { Router } from 'express'
import authRouter from './authRouter.js'
import likeRouter from './likeRouter.js'
import postRouter from './postRouter.js'
import userRouter from './userRouter.js'

const router = Router()

router.use(authRouter)
router.use(userRouter)
router.use(postRouter)
router.use(likeRouter)

export default router
