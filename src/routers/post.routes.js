import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import postSchema from "../schemas/post.schema.js";
import postController from "../controllers/post.controller.js";
import authValidation from "../middlewares/auth.middleware.js";

const postRouter = Router();

postRouter.post("/post", validateSchema(postSchema(postSchema.publishPost)), authValidation, postController.publishPost)
postRouter.get("/posts", authValidation, postController.getPosts)

export default postRouter;