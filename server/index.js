import express from "express";
import dotenv from "dotenv";
import connectionDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cors from "cors";

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



app.listen(PORT, () => {
  console.log("Server started on port : " + PORT);
});