require("dotenv").config();
const http = require("http");
const path = require("path");
const port = process.env.SERVER_PORT;
const app = require("./server/backend/app");
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server, { cors: "http:localhost:4200" });
io.on("connection", (socket) => {
  console.log("new user connection !!");
  socket.on("join", (room) => {
    socket.join("posts");
  });
  socket.on("onCreatePost", ({ post, room }) => {
    socket.broadcast.to(room).emit("onGetPost", post);
  });
  socket.on("onDeletePost", ({ id, room }) => {
    socket.broadcast.to(room).emit("onGetDeletedPost", id);
  });
  socket.on("onUpdatePost", ({ post, room }) => {
    socket.broadcast.to(room).emit("onGetUpdatedPost", post);
  });
  socket.on("leave", (room) => {
    socket.leave(room);
  });
  socket.on("disconnect", (socket) => {
    console.log("user has been left !!");
  });
});
server.listen(3000, () => {
  console.log("server is runing...");
});
