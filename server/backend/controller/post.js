const Post = require("../models/post");
const fs = require("fs");
const path = require("path");
const deleteFile = (filePath) => {
  const [filename] = filePath.split("/").slice(-1);
  fs.unlinkSync(path.join(__dirname, "../../uploads", filename));
};
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
  if (!newPost) {
    return res.status(404).json({
      message: "something go wrong",
      post: null,
    });
  }
  res.status(200).json({
    message: "post created",
    post: newPost,
  });
};
module.exports.getPostById = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (post) {
    return res.status(200).json({
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
    deleteFile(oldPost.imagePath);
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
  const imagePath = deletedPost.imagePath ? deletedPost.imagePath : null;
  if (!deletedPost) {
    return res.status(401).json({
      message: "faild to delete post",
    });
  }
  if (imagePath) {
    deleteFile(imagePath);
  }
  res.status(200).json({
    message: "post deleted",
    post: deletedPost,
  });
};
