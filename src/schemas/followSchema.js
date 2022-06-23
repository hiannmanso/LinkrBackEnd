import joi from "joi"

const followSchema = joi.object({
    followed: joi.number().required()
});

export default followSchema;