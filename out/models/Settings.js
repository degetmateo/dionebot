"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const Model = new Schema({
    server_id: { type: String },
    prefix: { type: String },
    buff: Buffer
});
const Settings = mongoose_1.default.model('Settings', Model);
exports.Settings = Settings;
