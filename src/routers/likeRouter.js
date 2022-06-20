import { Router } from 'express';
import { setLike } from '../controllers/likeController.js';
import validateSchema from '../middlewares/schemaValidator.js';
import tokenValidator from '../middlewares/tokenValidator.js';
import likeSchema from '../schemas/likeSchema.js';

const likeRouter = Router();

likeRouter.post("/like", tokenValidator, validateSchema(likeSchema), setLike);
// likeRouter.delete("/like", tokenValidator, validateSchema(likeSchema), removeLike);

export default likeRouter;