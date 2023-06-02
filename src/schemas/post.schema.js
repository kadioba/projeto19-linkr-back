import joi from "joi";

const publishPost = joi.object({
  url: joi
    .string()
    .trim()
    .uri({ scheme: ["http", "https"] })
    .required(),
  content: joi.string().trim().allow(""),
});

const editPost = joi.object({
  content: joi.string().trim().allow(""),
});

const postSchema = { publishPost, editPost };
export default postSchema;
