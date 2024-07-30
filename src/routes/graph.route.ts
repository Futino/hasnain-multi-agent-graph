import { chatAgent } from "../controller/index.controller";
import { Router, Request, Response } from "express";

const router = Router();

router.post("/chatAgent", chatAgent);
export default router;
