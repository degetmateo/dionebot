import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Model = new Schema({
    server_id: { type: String },
    prefix: { type: String }, 
    buff: Buffer
});

const Settings = mongoose.model('Settings', Model);
export { Settings };