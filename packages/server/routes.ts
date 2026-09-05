import express from "express";
import {chatController} from "./controller/chat.controllers.ts";

const router = express.Router();

router.post("/api/chat", chatController.sendMessage);
export default router;