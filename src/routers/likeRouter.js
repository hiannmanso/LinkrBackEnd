import { Router } from 'express';
import { addLike, removeLike } from '../controllers/likeController.js';
import validateSchema from '../middlewares/schemaValidator.js';
import tokenValidator from '../middlewares/tokenValidator.js';
import likeSchema from '../schemas/likeSchema.js';

const likeRouter = Router();

likeRouter.post("/like", tokenValidator, validateSchema(likeSchema), addLike);
likeRouter.delete("/like", tokenValidator, validateSchema(likeSchema), removeLike);

export default likeRouter;