import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import { userRoutes } from "./routes/userRoutes.js"
import { postRoutes } from "./routes/postRoutes.js"
import { notificationRoutes } from "./routes/notificationRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import { app, server } from "./lib/socket.js";

// Load environment variables
dotenv.config();


// Initialize Express
// const app = express();
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.get('/',(req,res)=>{
    res.write("Server is running.....")
    res.end()
})
// Use routes
app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/api', notificationRoutes);
app.use('/api', messageRoutes)

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});