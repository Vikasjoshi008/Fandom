import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

import authRoutes from './routes/auth.js';
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'true',
    credentials: true
}));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send("Fandom Clone API is running...");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
    });
