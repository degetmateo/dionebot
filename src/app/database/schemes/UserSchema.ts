import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    anilistId: { type: String, unique: true },
    discordId: { type: String, unique: true },
    buff: Buffer
});

export default UserSchema;