const Post = require("../models/post");
const fs = require("fs");
const path = require("path");
module.exports.getPosts = async (req, res, next) => {
  const pageSize = +req.query["pageSize"];
  const currentPage = +req.query["currentPage"];
  const postQuery = Post.find();
  const totalPosts = await Post.count();
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  const fetchedPosts = await postQuery;
  res.status(200).json({
    message: "success get posts",
    posts: fetchedPosts,
    totalPosts,
  });
};
module.exports.createPost = async (decode, req, res, next) => {
  const { title, content } = req.body;
  const creator = decode.id;
  const url = `${req.protocol}://${req.get("host")}/uploads/`;
  const imagePath = req.file ? url + req.file.filename : null;
  const newPost = await new Post({
    creator,
    title,
    content,
    imagePath,
  }).save();

  res.status(200).json({
    message: "post created",
    post: newPost,
  });
};
module.exports.getPostById = async (req, res, next) => {
  const postId = req.params["id"];
  const post = await Post.findById(postId);
  if (post) {
    res.status(200).json({
      message: "success get post",
      post,
    });
  }
  res.status(202).json({
    message: "post not found",
  });
};
module.exports.editPost = async (decode, req, res, next) => {
  const postId = req.params["id"];
  const { title, content } = req.body;
  const url = `${req.protocol}://${req.get("host")}/uploads/`;
  const oldPost = await Post.findById(postId);
  const imagePath = req.file ? url + req.file.filename : oldPost.imagePath;
  if (req.file && oldPost.imagePath) {
    const image = oldPost.imagePath.split("/").slice(-1);
    fs.unlinkSync(path.join(__dirname, "../../uploads", ...image));
  }
  const newPost = await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        title,
        content,
        imagePath,
      },
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    message: "post edited",
    post: newPost,
  });
};
module.exports.deletePost = async (decode, req, res, next) => {
  const postId = req.params["id"];
  const deletedPost = await Post.findByIdAndDelete(postId);
  const image = deletedPost.imagePath
    ? deletedPost.imagePath.split("/").slice(-1)
    : null;
  if (deletedPost) {
    if (image) {
      fs.unlinkSync(path.join(__dirname, "../../uploads", ...image));
    }
    res.status(200).json({
      message: "post deleted",
      post: deletedPost,
    });
  }
  res.status(401).json({
    message: "faild to delete post",
  });
};
