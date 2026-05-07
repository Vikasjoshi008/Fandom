import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: {
            type: String,
            required: function () { return !this.googleId; }
        },
        age: {
            type: Number,
        },
        googleId: { type: String, default: null },
        avatar: { type: String, default: null },
    },
    { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
