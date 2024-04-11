"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = __importDefault(require("../Helpers"));
const EmbedMedia_1 = __importDefault(require("./EmbedMedia"));
class EmbedManga extends EmbedMedia_1.default {
    constructor(media) {
        super();
        this.media = media;
    }
    static Create(manga) {
        const embed = new EmbedManga(manga);
        embed.CreateBasic();
        embed.setDescription(manga.getDescription());
        embed.addInfoFields();
        return embed;
    }
    static async CreateTranslated(manga) {
        const embed = new EmbedManga(manga);
        embed.CreateBasic();
        embed.setDescription(await Helpers_1.default.traducir(manga.getDescription()));
        embed.addInfoFields();
        return embed;
    }
    addInfoFields() {
        const informacionCampos1 = `
            ‣ **Formato**: ${this.media.getFormat() || 'Desconocido'}\n‣ **Estado**: ${this.media.getStatus() || 'Desconocido'}\n‣ **Calificación**: ${this.media.getMeanScore() ? this.media.getMeanScore() + '/100' : 'Desconocida'}\n‣ **Popularidad**: ${this.media.getPopularity() || 'Desconocida'}
        `;
        const fecha = this.media.getStartDate();
        const fechaText = fecha ? `${fecha.day}/${fecha.month}/${fecha.year}` : 'Desconocida';
        const informacionCampos2 = `
            ‣ **Favoritos**: ${this.media.getFavourites() || 'Desconocidos'}\n‣ **Emisión**: ${fechaText}\n‣ **Capítulos**: ${this.media.getChapters() || 'Desconocidos'}\n‣ **Volúmenes**: ${this.media.getVolumes() || 'Desconocidos'}
        `;
        this
            .addFields({ name: "▾", value: informacionCampos1, inline: true }, { name: "▾", value: informacionCampos2, inline: true });
        const generosInfo = this.media.getGenres().length === 0 ?
            '\`Desconocidos\`' : '`' + this.media.getGenres().join('` - `') + '`';
        this.addFields({ name: "▾ Géneros", value: generosInfo, inline: false });
        return this;
    }
}
exports.default = EmbedManga;
