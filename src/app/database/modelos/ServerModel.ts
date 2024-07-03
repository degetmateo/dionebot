import mongoose from "mongoose";
import UserSchema from "../schemes/UserSchema";

const ServerSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    premium: { type: Boolean, default: false },
    users: { type: [UserSchema] },
    buff: Buffer
});

export default mongoose.model('Server', ServerSchema);