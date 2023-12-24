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
    static Crear(manga) {
        const embed = this.CrearEmbedBasico(manga)
            .setDescription(manga.obtenerDescripcion());
        return embed;
    }
    static async CrearTraducido(manga) {
        const embed = this.CrearEmbedBasico(manga)
            .setDescription(await Helpers_1.default.traducir(manga.obtenerDescripcion()));
        return embed;
    }
    static CrearEmbedBasico(manga) {
        const titulos = manga.obtenerTitulos();
        const embed = new EmbedManga()
            .setTitle(manga.obtenerTitulo())
            .setURL(manga.obtenerEnlace())
            .setThumbnail(manga.obtenerCoverImageURL())
            .setImage(manga.obtenerBannerImageURL())
            .setColor(manga.obtenerColor())
            .setFooter({ text: `${titulos.english} | ${titulos.native}` });
        const informacionCampos1 = `
            ‣ **Formato**: ${manga.obtenerFormato()}\n‣ **Estado**: ${manga.obtenerEstado()}\n‣ **Calificación**: ${manga.obtenerCalificacionPromedio()}/100\n‣ **Popularidad**: ${manga.obtenerPopularidad()}
        `;
        const fecha = manga.obtenerFechaEmision();
        const informacionCampos2 = `
            ‣ **Favoritos**: ${manga.obtenerCantidadFavoritos()}\n‣ **Emisión**: ${fecha.day}/${fecha.month}/${fecha.year}\n‣ **Capítulos**: ${manga.obtenerCapitulos()}\n‣ **Volúmenes**: ${manga.obtenerVolumenes()}
        `;
        embed
            .addFields({ name: "▾", value: informacionCampos1, inline: true }, { name: "▾", value: informacionCampos2, inline: true });
        embed.addFields({ name: "▾ Géneros", value: '`' + manga.obtenerGeneros().join('` - `') + '`', inline: false });
        return embed;
    }
}
exports.default = EmbedManga;
