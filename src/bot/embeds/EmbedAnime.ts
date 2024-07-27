import Anime from "../apis/anilist/modelos/media/Anime";
import Helpers from "../Helpers";
import EmbedMedia from "./EmbedMedia";

export default class EmbedAnime extends EmbedMedia {
    protected media: Anime;

    private constructor(media: Anime) {
        super();
        this.media = media;
    }

    public static Create (anime: Anime): EmbedAnime {
        const embed = new EmbedAnime(anime);

        embed.CreateBasic();
        embed.setDescription(anime.getDescription());
        embed.addInfoFields();
        
        return embed;
    }

    private addInfoFields (): EmbedAnime {
        const informacionCampos1 = `
            ‣ **Formato**: ${this.media.getFormat() || 'Desconocido'}\n‣ **Estado**: ${this.media.getStatus() || 'Desconocido'}\n‣ **Calificación**: ${this.media.getMeanScore() ? this.media.getMeanScore() + '/100' : 'Desconocida'}\n‣ **Popularidad**: ${this.media.getPopularity() || 'Desconocida'}
        `;

        const fechaEmision = this.media.getStartDate();
        const fechaString = `${fechaEmision.day}/${fechaEmision.month}/${fechaEmision.year}`;

        const informacionCampos2 = `
            ‣ **Favoritos**: ${this.media.getFavourites() || 'Desconocido'}\n‣ **Temporada**: ${this.media.getSeason() || 'Desconocida'}\n‣ **Emisión**: ${fechaString || 'Desconocida'}\n‣ **Episodios**: ${this.media.getEpisodes() || 'Desconocidos'}
        `;

        this.addFields({ name: "▾", value: informacionCampos1, inline: true },
                        { name: "▾", value: informacionCampos2, inline: true });

        const valueGenres = this.media.getGenres().length >= 1 ?
            '`' + this.media.getGenres().join('` - `') + '`' : '`Desconocidos`';
        
        const valueStudios = this.media.getStudios().length >= 1 ?
            '`' + this.media.getStudios().map(e => e.node.name).join('` - `') + '`' : '`Desconocidos`';

        this.addFields({ name: "▾ Géneros", value: valueGenres, inline: false });
        this.addFields({ name: "▾ Estudios", value: valueStudios, inline: false });

        return this;
    }
}