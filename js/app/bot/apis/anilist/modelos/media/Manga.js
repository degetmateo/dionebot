"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Media_1 = __importDefault(require("./Media"));
class Manga extends Media_1.default {
    constructor(media) {
        super(media);
    }
    obtenerCapitulos() {
        return this.media.chapters;
    }
    obtenerVolumenes() {
        return this.media.volumes;
    }
}
exports.default = Manga;
