import joi from "joi";

const editPostSchema = joi.object({
    description: joi.string().required()
});

export default editPostSchema;