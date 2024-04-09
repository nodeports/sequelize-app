import { Router } from "express";
import { createUserWithPosts } from "../controllers/user";

const router = Router();

router.post("/users", createUserWithPosts);

export default router;
