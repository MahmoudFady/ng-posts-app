require("dotenv").config();
const http = require("http");
const port = process.env.SERVER_PORT;
const app = require("./server/backend/app");
const server = http.createServer(app);
require("./socket").init(server);

server.listen(port, () => {
  console.log("server is runing...");
});
