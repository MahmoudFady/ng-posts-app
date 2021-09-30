const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const mongoose = require("mongoose");
const userRoutes = require("./router/user");
const postRoutes = require("./router/post");
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: false })
  .then(() => {
    console.log("contected to db");
  })
  .catch(() => {
    console.log("faild to connect db");
  });

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/user/", userRoutes);
app.use("/post/", postRoutes);
app.use((req, res, next) => {
  res.status(404).json({
    message: "un knowm request",
  });
});

module.exports = app;
