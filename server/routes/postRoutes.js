import express, { text } from "express";
import { Post } from "../models/post.js";
import { middleware } from "./middleware.js";

const router = express.Router();

// Create a new post
router.post("/posts", async (req, res) => {
  try {
    const { title, media, location, usersId, author } = req.body; // userId is provided manually
    const post = new Post({
      title,
      media,
      location,
      author,
      usersId,
    });
    await post.save();
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username profilePicture")
      .populate("likes", "username profilePicture")
      .populate("comments.user", "username profilePicture"); // Populate author details
    res.send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a single post by ID
router.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    .populate("author", "username profilePicture")
      .populate("likes", "username profilePicture")
      .populate("comments.user", "username profilePicture"); // Populate author details
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a post by ID
router.patch("/posts/:id", async (req, res) => {
  try {
    const { title, media, location, username, usersId, comments, likes } =
      req.body;
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id }, // Ensure the authenticated user is the author
      {
        title,
        media,
        location,
        usersId,
        username,
        updatedAt: Date.now(),
        comments,
        likes,
      },
      { new: true, runValidators: true }
    );
    if (!post) {
      return res
        .status(404)
        .send({ message: "Post not found or unauthorized" });
    }
    res.send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a post by ID
router.delete("/posts/:id", async (req, res) => {
  try {
    // const { _id } = req.body; // userId is provided manually
    const post = await Post.findOneAndDelete({ _id: req.params.id }); // Ensure the provided userId is the author
    if (!post) {
      return res
        .status(404)
        .send({ message: "Post not found or unauthorized" });
    }
    res.send(post);
  } catch (error) {
    res.status(500).send(error);
  }
});

export { router as postRoutes };
