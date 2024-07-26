"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmbedMedia_1 = __importDefault(require("./EmbedMedia"));
class EmbedAnime extends EmbedMedia_1.default {
    constructor(media) {
        super();
        this.media = media;
    }
    static Create(anime) {
        const embed = new EmbedAnime(anime);
        embed.CreateBasic();
        embed.setDescription(anime.getDescription());
        embed.addInfoFields();
        return embed;
    }
    addInfoFields() {
        const informacionCampos1 = `
            ‣ **Formato**: ${this.media.getFormat() || 'Desconocido'}\n‣ **Estado**: ${this.media.getStatus() || 'Desconocido'}\n‣ **Calificación**: ${this.media.getMeanScore() ? this.media.getMeanScore() + '/100' : 'Desconocida'}\n‣ **Popularidad**: ${this.media.getPopularity() || 'Desconocida'}
        `;
        const fechaEmision = this.media.getStartDate();
        const fechaString = `${fechaEmision.day}/${fechaEmision.month}/${fechaEmision.year}`;
        const informacionCampos2 = `
            ‣ **Favoritos**: ${this.media.getFavourites() || 'Desconocido'}\n‣ **Temporada**: ${this.media.getSeason() || 'Desconocida'}\n‣ **Emisión**: ${fechaString || 'Desconocida'}\n‣ **Episodios**: ${this.media.getEpisodes() || 'Desconocidos'}
        `;
        this.addFields({ name: "▾", value: informacionCampos1, inline: true }, { name: "▾", value: informacionCampos2, inline: true });
        const valueGenres = this.media.getGenres().length >= 1 ?
            '`' + this.media.getGenres().join('` - `') + '`' : '`Desconocidos`';
        const valueStudios = this.media.getStudios().length >= 1 ?
            '`' + this.media.getStudios().map(e => e.node.name).join('` - `') + '`' : '`Desconocidos`';
        this.addFields({ name: "▾ Géneros", value: valueGenres, inline: false });
        this.addFields({ name: "▾ Estudios", value: valueStudios, inline: false });
        return this;
    }
}
exports.default = EmbedAnime;
