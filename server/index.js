import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import { userRoutes } from "./routes/userRoutes.js"
import { postRoutes } from "./routes/postRoutes.js"
import { notificationRoutes } from "./routes/notificationRoutes.js"

// Load environment variables
dotenv.config();


// Initialize Express
const app = express();
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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});