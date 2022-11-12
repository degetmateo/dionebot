"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var mongoose_1 = __importDefault(require("mongoose"));
var AniuserSchema = new mongoose_1["default"].Schema({
    anilistUsername: { type: String },
    anilistId: { type: String },
    discordId: { type: String },
    serverId: { type: String },
    buff: Buffer
});
exports["default"] = mongoose_1["default"].model('Aniuser', AniuserSchema);
