"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AniUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const Model = new Schema({
    anilistUsername: { type: String },
    anilistId: { type: String },
    discordId: { type: String },
    serverId: { type: String },
    buff: Buffer
});
const AniUser = mongoose_1.default.model('AniUser', Model);
exports.AniUser = AniUser;
