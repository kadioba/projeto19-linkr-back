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

const paramsPostId = joi.object({
  postId: joi.number().required()
})

const postSchema = { publishPost, editPost, paramsPostId };
export default postSchema;
