"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Helpers_1 = __importDefault(require("../Helpers"));
class EmbedManga extends discord_js_1.EmbedBuilder {
    constructor() {
        super();
    }
    static Create(manga) {
        const embed = this.CrearEmbedBasico(manga)
            .setDescription(manga.getDescription());
        return embed;
    }
    static async CreateTranslated(manga) {
        const embed = this.CrearEmbedBasico(manga)
            .setDescription(await Helpers_1.default.traducir(manga.getDescription()));
        return embed;
    }
    static CrearEmbedBasico(manga) {
        const titulos = manga.getTitles();
        const embed = new EmbedManga()
            .setTitle(manga.getPreferredTitle())
            .setURL(manga.getURL())
            .setThumbnail(manga.getCoverURL())
            .setImage(manga.getBannerURL())
            .setColor(manga.getColor())
            .setFooter({ text: `${titulos.english} | ${titulos.native}` });
        const informacionCampos1 = `
            ‣ **Formato**: ${manga.getFormat()}\n‣ **Estado**: ${manga.getStatus()}\n‣ **Calificación**: ${manga.getMeanScore()}/100\n‣ **Popularidad**: ${manga.getPopularity()}
        `;
        const fecha = manga.getStartDate();
        const informacionCampos2 = `
            ‣ **Favoritos**: ${manga.getFavourites()}\n‣ **Emisión**: ${fecha.day}/${fecha.month}/${fecha.year}\n‣ **Capítulos**: ${manga.getChapters()}\n‣ **Volúmenes**: ${manga.getVolumes()}
        `;
        embed
            .addFields({ name: "▾", value: informacionCampos1, inline: true }, { name: "▾", value: informacionCampos2, inline: true });
        embed.addFields({ name: "▾ Géneros", value: '`' + manga.getGenres().join('` - `') + '`', inline: false });
        return embed;
    }
}
exports.default = EmbedManga;
