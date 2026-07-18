import 'dotenv/config';
import express from "express"
import cookieParser from "cookie-parser";
import {createServer} from "node:http";
import {connectDB} from "./config/db.js";
import {connectToSocket} from "./controllers/socketManager.js";
import userRoutes from "./routes/users.js";
import cors from "cors";

const app = express();

app.use(express.json({limit:'1000kb'}));
app.use(cookieParser());
app.use(express.urlencoded({limit:'1000kb' , extended :true}));
const allowed_origin = [
  "http://localhost:5173",
  "https://meetspace-client.onrender.com" // Ensure NO trailing slash here
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or postman)
      if (!origin) return callback(null, true);
      
      if (allowed_origin.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // MANDATORY: This allows cookies to pass through CORS
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// connect express and socket io
const server = createServer(app);
connectToSocket(server);

app.set("port" ,(process.env.PORT || 8000))
const port = app.get("port");


app.use("/api/users", userRoutes);
app.get("/" , (req , res)=>{
    return res.json("Welecome to home page");
})

const start = async()=>{
    connectDB();
    server.listen(port  , ()=>{
        console.log("Listen on port" , port);
    })
}

start();