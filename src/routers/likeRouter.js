import { Router } from 'express';
import { getUsersWhoLiked, setLike } from '../controllers/likeController.js';
import validateSchema from '../middlewares/schemaValidator.js';
import tokenValidator from '../middlewares/tokenValidator.js';
import likeSchema from '../schemas/likeSchema.js';

const likeRouter = Router();

likeRouter.post("/like", tokenValidator, validateSchema(likeSchema), setLike);
likeRouter.get("/likes", getUsersWhoLiked);
// likeRouter.delete("/like", tokenValidator, validateSchema(likeSchema), removeLike);

export default likeRouter;