import joi from "joi";

const signUp = joi.object({
  email: joi.string().trim().email().required(),
  password: joi.string().trim().min(3).required(),
  username: joi.string().trim().min(3).required(),
  picture: joi
    .string()
    .uri({ scheme: ["http", "https"] })
    .required(),
});

const signIn = joi.object({
  email: joi.string().trim().email().required(),
  password: joi.string().trim().required(),
});

const userSchema = { signIn, signUp };
export default userSchema;
