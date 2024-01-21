import Manga from "../apis/anilist/modelos/media/Manga";
import Helpers from "../Helpers";
import EmbedMedia from "./EmbedMedia";

export default class EmbedManga extends EmbedMedia {
    protected media: Manga;

    private constructor(media: Manga) {
        super();
        this.media = media;
    }

    public static Create (manga: Manga): EmbedManga {
        const embed = new EmbedManga(manga);

        embed.CreateBasic();
        embed.setDescription(manga.getDescription());
        embed.addInfoFields();
        
        return embed;
    }

    public static async CreateTranslated (manga: Manga): Promise<EmbedManga> {
        const embed = new EmbedManga(manga);
        
        embed.CreateBasic();
        embed.setDescription(await Helpers.traducir(manga.getDescription()));
        embed.addInfoFields();

        return embed;
    }

    private addInfoFields (): EmbedManga {
        const informacionCampos1 = `
            ‣ **Formato**: ${this.media.getFormat() || 'Desconocido'}\n‣ **Estado**: ${this.media.getStatus() || 'Desconocido'}\n‣ **Calificación**: ${this.media.getMeanScore() || '-'}/100\n‣ **Popularidad**: ${this.media.getPopularity() || 'Desconocida'}
        `;

        const fecha = this.media.getStartDate();
        const fechaText = fecha ? `${fecha.day}/${fecha.month}/${fecha.year}` : 'Desconocida';

        const informacionCampos2 = `
            ‣ **Favoritos**: ${this.media.getFavourites() || 'Desconocidos'}\n‣ **Emisión**: ${fechaText}\n‣ **Capítulos**: ${this.media.getChapters() || 'Desconocidos'}\n‣ **Volúmenes**: ${this.media.getVolumes() || 'Desconocidos'}
        `;

        this
            .addFields(
                { name: "▾", value: informacionCampos1, inline: true },
                { name: "▾", value: informacionCampos2, inline: true }
            )

        const generosInfo = this.media.getGenres().length === 0 ?
                '\`Desconocidos\`' : '`' + this.media.getGenres().join('` - `') + '`';

        this.addFields({ name: "▾ Géneros", value: generosInfo, inline: false })

        return this;
    }
}