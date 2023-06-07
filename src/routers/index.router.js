import { Router } from "express";
import usersRouter from "./users.router.js";
import postRouter from "./post.router.js";
import hashtagsRouter from "./hashtags.router.js";
import commentsRouter from "./comments.router.js";

const router = Router();

router.use(usersRouter);
router.use(postRouter);
router.use(hashtagsRouter);
router.use(commentsRouter)
router.all("*", (_req, res) => res.status(404).send({ message: "Not Found" }));

export default router;
