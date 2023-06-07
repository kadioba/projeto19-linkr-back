import { Router } from "express";
import commentController from "../controllers/commentController.js";
import authValidation from "../middlewares/auth.middleware.js";


const commentsRouter = Router()

//Posta um comentário
commentsRouter.post("/post/:postId/comment", authValidation, commentController.publishComment)
//Busca os comentarios de um post
commentsRouter.get("/post/:postId/comment", authValidation, commentController.getCommentsByPostId)

export default commentsRouter