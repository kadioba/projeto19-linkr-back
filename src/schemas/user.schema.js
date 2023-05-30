import joi from "joi";

const userSchema = joi.object({
  name: joi.string().trim().required(),
  email: joi.string().trim().email().required(),
  password: joi.string().trim().required(),
});

export default userSchema;