import { Router } from "express";
import userController from "../controllers/user.controller.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import userSchema from "../schemas/user.schema.js";
import authValidation from "../middlewares/auth.middleware.js";

const usersRouter = Router();

usersRouter.post("/users/signup", validateSchema(userSchema.signUp), userController.signUp);
usersRouter.post("/users/signin", validateSchema(userSchema.signIn), userController.signIn);
usersRouter.post("/users/signout", authValidation, userController.signOut);
usersRouter.get("/user", authValidation, userController.getUser);
usersRouter.get("/user/:id", authValidation, userController.getUserById);
usersRouter.get("/users/search", authValidation, userController.searchUsers);
usersRouter.get("/users/:id/posts", authValidation, userController.getUserDataWithPosts);
usersRouter.post("/user/follow/:followedId", authValidation, userController.follow)

export default usersRouter;
