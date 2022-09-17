import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Model = new Schema({
    anilistUsername: { type: String },
    anilistId: { type: String },
    discordId: { type: String },
    serverId: { type: String },
    buff: Buffer
});

const AniUser = mongoose.model('AniUser', Model);
export { AniUser };