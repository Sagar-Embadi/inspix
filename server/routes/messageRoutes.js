import express from "express";
import { getMessages, sendMessage } from "../Controllers/message.controller.js";
import { middleware } from "./middleware.js";
import Message from "../models/message.js";

const router = express.Router();

// router.get("/users", getUsersForSidebar);
router.get('/conversation/:user1Id/:user2Id',async(req,res)=>{
    try {
        const { user1Id, user2Id } = req.params;
    
        const messages = await Message.find({
          $or: [
            { sender: user1Id, receiver: user2Id },
            { sender: user2Id, receiver: user1Id }
          ]
        }).sort({ timestamp: 1 }).populate('sender receiver', 'username profilePicture'); // oldest to newest
        
        res.status(200).send(messages);
      } catch (err) {
        res.status(500).send('Failed to fetch messages');
      }
} ); // Get conversation messages
// router.get("/messages/:id",middleware, getMessages);
router.post("/messages/send", sendMessage);

export default router;