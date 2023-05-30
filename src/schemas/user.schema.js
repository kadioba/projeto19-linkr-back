import joi from "joi";

const signUp = joi.object({
  email: joi.string().trim().email().required(),
  password: joi.string().trim().required(),
  username: joi.string().trim().required(),
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
