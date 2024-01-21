"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Helpers_1 = __importDefault(require("../Helpers"));
class EmbedMedia extends discord_js_1.EmbedBuilder {
    CreateBasic() {
        return this
            .setTitle(this.media.getTitles().userPreferred)
            .setURL(this.media.getURL())
            .setThumbnail(this.media.getCoverURL())
            .setImage(this.media.getBannerURL())
            .setColor(this.media.getColor())
            .setTitles();
    }
    setTitles() {
        const titles = this.media.getTitles();
        let listTitles = [];
        if (titles.romaji)
            listTitles.push(titles.romaji);
        if (titles.english)
            listTitles.push(titles.english);
        if (titles.native)
            listTitles.push(titles.native);
        listTitles = Helpers_1.default.eliminarElementosRepetidos(listTitles);
        return this.setFooter({ text: listTitles.join(' | ') });
    }
}
exports.default = EmbedMedia;
