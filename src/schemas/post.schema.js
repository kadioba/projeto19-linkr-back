import joi from "joi";

const publishPost = joi.object({
    url: joi.string().trim().uri({ scheme: ["http", "https"] }).required(),
    content: joi.string().trim().required()
});

const postSchema = { publishPost };
export default postSchema;