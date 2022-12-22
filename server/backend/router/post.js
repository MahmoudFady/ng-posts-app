const router = require("express").Router();
const upload = require("../helpers/upload");
const checkAuth = require("../helpers/check-auth");
const {
  getPosts,
  createPost,
  getPostById,
  editPost,
  deletePost,
} = require("../controller/post");
router.get("/", getPosts);
router.post("/", upload.single("postImage"), checkAuth, createPost);
router.get("/:id", getPostById);
router.put("/:id", upload.single("postImage"), checkAuth, editPost);
router.delete("/:id", checkAuth, deletePost);
module.exports = router;
