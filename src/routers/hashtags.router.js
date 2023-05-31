import { Router } from "express";
import authValidation from "../middlewares/auth.middleware.js";
import hashtagController from "../controllers/hashtag.controller.js";

const hashtagsRouter = Router()

hashtagsRouter.get("/hashtag", hashtagController.getTrending)

export default hashtagsRouter