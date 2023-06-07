import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import postSchema from "../schemas/post.schema.js";
import postController from "../controllers/post.controller.js";
import authValidation from "../middlewares/auth.middleware.js";

const postRouter = Router();

postRouter.post("/post", validateSchema(postSchema.publishPost), authValidation, postController.publishPost)
postRouter.post("/post/repost/:postId", validateSchema(postSchema.paramsPostId, "params"), authValidation, postController.repost)
postRouter.post("/post/like/:postId", authValidation, postController.like)
postRouter.get("/posts", authValidation, postController.getPosts)
postRouter.put("/post/:postId", validateSchema(postSchema.editPost), authValidation, postController.updatePost)
postRouter.delete("/post/:postId", authValidation, postController.deletePost)
postRouter.get("/posts/:id", authValidation, postController.getPostsById);

export default postRouter;
