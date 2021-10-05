let io;
const init = (httpServer) => {
  io = require("socket.io")(httpServer, { cors: "http:localhost:4200" });
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
};

module.exports = {
  init,
};
