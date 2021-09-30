require("dotenv").config();
const http = require("http");
const path = require("path");
const port = process.env.SERVER_PORT;
const app = require("./server/backend/app");
const server = http.createServer(app);
server.listen(3000, () => {
  console.log("server is runing...");
});
