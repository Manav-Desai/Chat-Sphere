import express from "express";
import dotenv from "dotenv";
import connectionDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cors from "cors";
import { Server } from "socket.io"

dotenv.config();

connectionDB();

const app = express();
const PORT = process.env.PORT;

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

app.use("/api/user" , userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message" , messageRoutes);

app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res) => {
  return res.json({ message: "API is working fine" });
});

const server = app.listen(PORT, () => {
  console.log("Server started on port : " + PORT);
});

const io = new Server(server , {
  pingTimeout : 60000,
  cors : {
    origin : "http://localhost:5173",
  }
});

io.on("connection" , (socket) => {
  console.log("Connected to Socket io... Printing the socket obj");
  // console.log(socket);

  socket.on("setup" , (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
    console.log(userData._id);
  });

  socket.on("join chat" , (room)=>{
    socket.join(room);
    console.log("User joined room : ",room);
  });

  socket.on("typing" , (room) => socket.in(room).emit("typing"));
  socket.on("stop typing" , (room) => socket.in(room).emit("stop typing"));

  socket.on("new message" , (newMessageRecieved) => {

    let chat = newMessageRecieved.chat;

    if(!chat.users)
    {
      return console.log("chat users not defined");
    }

    chat.users.forEach( (user) => {
      if(user._id == newMessageRecieved.sender._id)
        return;
      else
        socket.in(user._id).emit("message recieved" , newMessageRecieved);
    } )

  });

  socket.off("setup" , () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  })
})