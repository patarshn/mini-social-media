import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handler(req, res);
  });

  // Singleton pattern for Socket.IO
  let io;
  if (!global.io) {
    io = new Server(httpServer, {
      cors: {
        origin: "*", // Replace with your allowed origins
      },
    });

    global.io = io; // Save the instance globally
  } else {
    io = global.io;
  }

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("trySocket", (msg) => {
      console.log("Message received:", msg);
      // io.emit("trySocket", `Server response: ${msg}`); // Emit to all clients
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
