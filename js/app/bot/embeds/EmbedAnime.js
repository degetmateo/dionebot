"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Helpers_1 = __importDefault(require("../Helpers"));
class EmbedAnime extends discord_js_1.EmbedBuilder {
    constructor() {
        super();
    }
    static Create(anime) {
        const embed = this.CrearEmbedBasico(anime)
            .setDescription(anime.getDescription());
        return embed;
    }
    static async CreateTranslated(anime) {
        const embed = this.CrearEmbedBasico(anime)
            .setDescription(await Helpers_1.default.traducir(anime.getDescription()));
        return embed;
    }
    static CrearEmbedBasico(anime) {
        const titulos = anime.getTitles();
        const embed = new EmbedAnime()
            .setTitle(anime.getPreferredTitle())
            .setURL(anime.getURL())
            .setThumbnail(anime.getCoverURL())
            .setImage(anime.getBannerURL())
            .setColor(anime.getColor())
            .setFooter({ text: `${titulos.english} | ${titulos.native}` });
        const informacionCampos1 = `
            ‣ **Formato**: ${anime.getFormat()}\n‣ **Estado**: ${anime.getStatus()}\n‣ **Calificación**: ${anime.getMeanScore()}/100\n‣ **Popularidad**: ${anime.getPopularity()}
        `;
        const fechaEmision = anime.getStartDate();
        const fechaString = `${fechaEmision.day}/${fechaEmision.month}/${fechaEmision.year}`;
        const informacionCampos2 = `
            ‣ **Favoritos**: ${anime.getFavourites()}\n‣ **Temporada**: ${anime.getSeason()}\n‣ **Emisión**: ${fechaString}\n‣ **Episodios**: ${anime.getEpisodes()}
        `;
        embed.addFields({ name: "▾", value: informacionCampos1, inline: true }, { name: "▾", value: informacionCampos2, inline: true });
        embed.addFields({ name: "▾ Géneros", value: '`' + anime.getGenres().join('` - `') + '`', inline: false });
        embed.addFields({ name: "▾ Estudios", value: '`' + anime.getStudios().map(e => e.node.name).join('` - `') + '`', inline: false });
        return embed;
    }
}
exports.default = EmbedAnime;
