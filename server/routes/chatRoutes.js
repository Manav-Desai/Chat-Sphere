import express from "express";
import protect from "../middleware/authMiddleware.js";
import { accessChat, addToGroup, createGroupChat, fetchChats, removeFromGroup, renameGroup } from "../controllers/chatControllers.js";

const router = express.Router();

router.route("/").post(protect,accessChat).get(protect,fetchChats);
router.post("/group" , protect ,createGroupChat);
router.put("/rename",protect, renameGroup);
router.put("/groupremove",protect, removeFromGroup);
router.put("/groupadd",protect, addToGroup);

export default router;