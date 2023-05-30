import { Router } from "express";
import usersRouter from "./users.router.js";

const router = Router();

router.use(usersRouter);
router.all("*", (_req, res) => res.status(404).send({ message: "Not Found" }));

export default router;
