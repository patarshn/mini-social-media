import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import 'dotenv/config'



const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
let users = {}
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
    console.log("A user connected", users);

    socket.on("register", function (userId) {
      console.log("socket userRegister", userId, socket.id)
      if (userId){
        users[userId] = socket.id;
      }
    });

    socket.on("new-story-following", function (data){
      console.log("new-story-following event:", data.data, data.followers)
      console.log("users:",users)
      let followers = data.followers
      followers.forEach(followerId => {
        console.log("new-story", followerId)
          if (users[followerId]) {
            console.log("new-story-id:", users[followerId])
            io.to(users[followerId]).emit('new-story', data.data);
          }
      });
    })

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
