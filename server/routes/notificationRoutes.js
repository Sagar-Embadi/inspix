import express from "express";
import { User } from "../models/user.js";
const router = express.Router();

router.get("/users/:userId/notifications", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate({
        path: "notifications.fromUser",
        select: "username profilePicture",
      })
      .populate({
        path: "notifications.postId",
        select: "caption media",
      });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(user.notifications);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/users/:userId/notifications', async (req, res) => {
    try {
        const { type, postId, fromUserId, content } = req.body;
        const newNotification = {
            type,
            postId: postId || null,
            fromUser: fromUserId,
            content: content || null,
            createdAt: new Date(),
        };

        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $push: { notifications: newNotification } },
            { new: true }
        ).populate('notifications.fromUser', 'username profilePicture');

        if (!user) {
            return res.status(404).send( 'User not found' );
        }

        res.status(201).send('Notification created');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/users/:userId/notifications/:notificationId', async (req, res) => {
  try {
      const user = await User.findByIdAndUpdate(
          req.params.userId,
          { $pull: { notifications: { _id: req.params.notificationId } } },
          { new: true }
      );
      const notification = user.notifications.find(n => n._id.toString() === req.params.notificationId);
      
      if (!user) {
        return res.status(404).send('User not found');
      }
      if (!notification) {
          return res.status(404).send('Notification not found');
      }

      res.status(200).send('Notification deleted');
  } catch (error) {
      res.status(500).send(error.message);
  }
});

router.patch('/:userId/notifications/:notificationId', async (req, res) => {
  try {
      const { read } = req.body;

      const user = await User.findOneAndUpdate(
          {
              _id: req.params.userId,
              "notifications._id": req.params.notificationId
          },
          {
              $set: { "notifications.$.read": read }
          },
          { new: true }
      );

      if (!user) {
          return res.status(404).send('User or notification not found');
      }

      res.status(200).send('Notification updated');
  } catch (error) {
      res.status(500).send(error.message);
  }
});

export { router as notificationRoutes };
