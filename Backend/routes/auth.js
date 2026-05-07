import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();


// SIGNUP
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password, age } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPassword, age });
        await newUser.save();
        res.status(201).json({ message: "User created!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
        throw new CustomError("Try again later...");
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Check your login credentials and retry again." });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.status(200).json({ token, user: { username: user.username, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture, sub } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                username: name.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
                email: email,
                googleId: sub,
                avatar: picture,
            });
            await user.save();
        }

        const appToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            token: appToken,
            user: {
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (err) {
        console.error("Google Auth Error:", err);
        res.status(500).json({ message: "Google Authentication failed" });
    }
});

export default router;
