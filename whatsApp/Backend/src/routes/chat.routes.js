import { Router } from 'express';
import { authUser } from "../middlewares/auth.middleware.js";
import { createConversation, getConversations,getMessages } from "../controllers/chat.controller.js";

const router = Router();


/**
 * @route POST /api/chats/conversation
 * @desc Create a new conversation between two users
 * @access Private
 */
router.post("/conversation", authUser, createConversation);


router.get("/conversations", authUser, getConversations);

router.get("/messages", authUser, getMessages );


export default router;