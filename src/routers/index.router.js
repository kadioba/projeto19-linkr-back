import { Router } from "express";
import usersRouter from "./users.router.js";
import hashtagsRouter from "./hashtags.router.js";

const router = Router();

router.use([usersRouter, hashtagsRouter]);
router.all("*", (_req, res) => res.status(404).send({ message: "Not Found" }));

export default router;
