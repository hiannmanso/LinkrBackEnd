import joi from 'joi';

const userSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  picture: joi.string().pattern(/^http/).required()
});

export default userSchema;