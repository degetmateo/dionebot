import mongoose from "mongoose";

const AniuserSchema = new mongoose.Schema({
    anilistUsername: { type: String },
    anilistId: { type: String },
    discordId: { type: String },
    serverId: { type: String },
    buff: Buffer
});

export default mongoose.model('Aniuser', AniuserSchema);