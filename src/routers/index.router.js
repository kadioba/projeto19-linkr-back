import { Router } from "express";

const router = Router();

router.all("*", (_req, res) => res.status(404).send({ message: "Not Found" }));

export default router;
