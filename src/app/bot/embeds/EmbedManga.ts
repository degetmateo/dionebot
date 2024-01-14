import { EmbedBuilder } from "discord.js";
import Manga from "../apis/anilist/modelos/media/Manga";
import Helpers from "../Helpers";

export default class EmbedManga extends EmbedBuilder {
    private constructor() {
        super();
    }

    public static Create (manga: Manga): EmbedManga {
        const embed = this.CrearEmbedBasico(manga)
            .setDescription(manga.getDescription());

        return embed;
    }

    public static async CreateTranslated (manga: Manga): Promise<EmbedManga> {
        const embed = this.CrearEmbedBasico(manga)
            .setDescription(await Helpers.traducir(manga.getDescription()));

        return embed;
    }

    private static CrearEmbedBasico (manga: Manga): EmbedManga {
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
            .addFields(
                { name: "▾", value: informacionCampos1, inline: true },
                { name: "▾", value: informacionCampos2, inline: true }
            )

        embed.addFields({ name: "▾ Géneros", value: '`' + manga.getGenres().join('` - `') + '`', inline: false })

        return embed;
    }
}