import express from 'express';
import dotenv from "dotenv";
import { conn } from './database/db.js';

dotenv.config();

// Initialize Express app
const app = express();
//using middlewares

app.use(express.json());
const PORT = process.env.PORT;

 conn();

app.get("/" , (req,res)=>{
    res.send("server is working")
})

app.use("/uploads",express.static("uploads"))

//importing routes
import userRoutes from './routes/user.js'
import courseRoutes from './routes/course.js'
import adminRoutes from './routes/admin.js'

//using routes
app.use("/api" ,userRoutes);
app.use("/api" ,courseRoutes)
app.use("/api" ,adminRoutes)


app.listen(3000,()=>{
  console.log(`server running @ http://localhost:3000`)
})