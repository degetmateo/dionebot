import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    anilistId: { type: String },
    discordId: { type: String },
    buff: Buffer
});

export default UserSchema;
