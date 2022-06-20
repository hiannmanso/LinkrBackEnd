import joi from "joi";

const likeSchema = joi.object({
    postID: joi.number().required()
});

export default likeSchema;