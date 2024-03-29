"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema_1 = __importDefault(require("../schemes/UserSchema"));
const ServerSchema = new mongoose_1.default.Schema({
    id: { type: String, unique: true },
    premium: { type: Boolean, default: false },
    users: { type: [UserSchema_1.default] },
    buff: Buffer
});
exports.default = mongoose_1.default.model('Server', ServerSchema);
