const express = require("express");
const router = express.Router();
const db = require("../data/db");

// GET all posts
router.get("/", async (req, res) => {
  try {
    const posts = await db.find();
    !posts
      ? res.status(500).json({ error: "Could not retrieve posts...error!" })
      : res.status(200).json({ ...posts });
  } catch {
    res
      .status(500)
      .json({ error: "The posts information could not be retrieved." });
  }
});
// GET post by :id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const foundPost = await db.findById(id);
    foundPost.length < 1
      ? res.status(404).json({ error: `post id:${id} does not exist` })
      : res.status(200).json({ ...foundPost });
  } catch {
    res
      .status(500)
      .json({ error: "The post information could not be retrieved." });
  }
});
// GET comments by post :id
router.get("/:id/comments", async (req, res) => {
  try {
    const id = req.params.id;
    const foundPostComments = await db.findPostComments(id);
    foundPostComments.length < 1
      ? res.status(400).json({
          message: `Post id:${id} has no comments or doesn't exist at all.`,
        })
      : res.status(200).json({ ...foundPostComments });
  } catch {
    res
      .status(500)
      .json({ error: "The comments information could not be retrieved." });
  }
});

// POST a new post (title + contents required)
router.post("/", async (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }

  try {
    const newPost = await db.insert(req.body);
    res.status(201).json({ ...newPost, ...req.body });
  } catch {
    res.status(500).json({
      error: "There was an error while saving the post to the database",
    });
  }
});

module.exports = router;
