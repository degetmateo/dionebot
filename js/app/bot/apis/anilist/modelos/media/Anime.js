"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Media_1 = __importDefault(require("./Media"));
class Anime extends Media_1.default {
    constructor(media) {
        super(media);
    }
    getEpisodes() {
        return this.media.episodes;
    }
    getSeason() {
        return this.media.season;
    }
    getDuration() {
        return this.media.duration;
    }
}
exports.default = Anime;
