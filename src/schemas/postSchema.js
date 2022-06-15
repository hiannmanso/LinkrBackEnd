import joi from 'joi'

const postSchema = joi.object({
	url: joi
		.string()
		.pattern(/^[a-zA-Z0-9-_]+[:./\\]+([a-zA-Z0-9 -_./:=&"'?%+@#$!])+$/)
		.required(),
	description: joi.string(),
})

export default postSchema
