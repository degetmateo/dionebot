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
    static Crear(anime) {
        const embed = this.CrearEmbedBasico(anime)
            .setDescription(anime.obtenerDescripcion());
        return embed;
    }
    static async CrearTraducido(anime) {
        const embed = this.CrearEmbedBasico(anime)
            .setDescription(await Helpers_1.default.traducir(anime.obtenerDescripcion()));
        return embed;
    }
    static CrearEmbedBasico(anime) {
        const titulos = anime.obtenerTitulos();
        const embed = new EmbedAnime()
            .setTitle(anime.obtenerTitulo())
            .setURL(anime.obtenerEnlace())
            .setThumbnail(anime.obtenerCoverImageURL())
            .setImage(anime.obtenerBannerImageURL())
            .setColor(anime.obtenerColor())
            .setFooter({ text: `${titulos.english} | ${titulos.native}` });
        const informacionCampos1 = `
            ‣ **Formato**: ${anime.obtenerFormato()}\n‣ **Estado**: ${anime.obtenerEstado()}\n‣ **Calificación**: ${anime.obtenerCalificacionPromedio()}/100\n‣ **Popularidad**: ${anime.obtenerPopularidad()}
        `;
        const fechaEmision = anime.obtenerFechaEmision();
        const fechaString = `${fechaEmision.day}/${fechaEmision.month}/${fechaEmision.year}`;
        const informacionCampos2 = `
            ‣ **Favoritos**: ${anime.obtenerCantidadFavoritos()}\n‣ **Temporada**: ${anime.obtenerTemporada()}\n‣ **Emisión**: ${fechaString}\n‣ **Episodios**: ${anime.obtenerEpisodios()}
        `;
        embed.addFields({ name: "▾", value: informacionCampos1, inline: true }, { name: "▾", value: informacionCampos2, inline: true });
        embed.addFields({ name: "▾ Géneros", value: '`' + anime.obtenerGeneros().join('` - `') + '`', inline: false });
        embed.addFields({ name: "▾ Estudios", value: '`' + anime.obtenerEstudios().map(e => e.node.name).join('` - `') + '`', inline: false });
        return embed;
    }
}
exports.default = EmbedAnime;
