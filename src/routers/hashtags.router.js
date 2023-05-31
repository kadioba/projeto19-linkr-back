import { Router } from "express";
import authValidation from "../middlewares/auth.middleware.js";
import hashtagController from "../controllers/hashtag.controller.js";

const hashtagsRouter = Router()

hashtagsRouter.get("/hashtag", authValidation, hashtagController.getTrendingHashtags)
hashtagsRouter.get("/hashtag/:hashtag", authValidation, hashtagController.getPostsByHashtag)
// adicionar authValidation nas rotas

export default hashtagsRouter


