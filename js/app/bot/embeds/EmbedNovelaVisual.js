"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Helpers_1 = __importDefault(require("../Helpers"));
class EmbedNovelaVisual extends discord_js_1.EmbedBuilder {
    constructor() {
        super();
    }
    static Crear(vn) {
        const embed = this.CrearEmbedBasico(vn)
            .setDescription(vn.getDescripcion());
        this.setCampoIdiomas(embed, vn.getIdiomas());
        this.setCampoPlataformas(embed, vn.getPlataformas());
        return embed;
    }
    static async CrearTraducido(vn) {
        const embed = this.CrearEmbedBasico(vn)
            .setDescription(await Helpers_1.default.traducir(vn.getDescripcion()));
        this.setCampoIdiomas(embed, await Helpers_1.default.traducirElementosArreglo(vn.getIdiomas()));
        this.setCampoPlataformas(embed, vn.getPlataformas());
        return embed;
    }
    static CrearEmbedBasico(vn) {
        const embed = new EmbedNovelaVisual()
            .setTitle(vn.getTitulo())
            .setURL(vn.getURL())
            .setThumbnail(vn.getImagenURL())
            .setFooter({ text: vn.getAliases().join(' | ') });
        const informacionCampos1 = `
            ‣ **Estado**: ${vn.getEstado()}\n‣ **Calificación**: ${vn.getCalificacion()}/100\n‣ **Popularidad**: ${vn.getPopularidad()}
        `;
        const informacionCampos2 = `
            ‣ **Fecha de Salida**: ${vn.getFecha().toLocaleDateString()}\n‣ **Duración**: ${vn.getDuracion() / 60}hrs
        `;
        embed.addFields({ name: "▾", value: informacionCampos1, inline: true }, { name: "▾", value: informacionCampos2, inline: true });
        return embed;
    }
    static setCampoIdiomas(embed, idiomas) {
        let informacionCampoIdiomas = "";
        for (let i = 0; i < idiomas.length; i++) {
            informacionCampoIdiomas += "`" + idiomas[i] + "` ";
        }
        informacionCampoIdiomas = informacionCampoIdiomas.split(' ').join(' - ').trim();
        informacionCampoIdiomas = informacionCampoIdiomas.substring(0, informacionCampoIdiomas.length - 2);
        if (!informacionCampoIdiomas || informacionCampoIdiomas.length < 0)
            informacionCampoIdiomas = "`Desconocidos`";
        embed.addFields({
            name: "▿ Idiomas",
            value: informacionCampoIdiomas,
            inline: false
        });
    }
    static setCampoPlataformas(embed, plataformas) {
        let informacionCampoPlataformas = "";
        for (let i = 0; i < plataformas.length; i++) {
            informacionCampoPlataformas += "`" + plataformas[i] + "` - ";
        }
        informacionCampoPlataformas = informacionCampoPlataformas.substring(0, informacionCampoPlataformas.length - 3);
        if (!informacionCampoPlataformas || informacionCampoPlataformas.length < 0)
            informacionCampoPlataformas = "`Desconocidos`";
        embed.addFields({
            name: "▿ Plataformas",
            value: informacionCampoPlataformas,
            inline: false
        });
    }
}
exports.default = EmbedNovelaVisual;
