import { EmbedBuilder } from "discord.js";
import Anime from "../apis/anilist/modelos/media/Anime";
import Helpers from "../Helpers";

export default class EmbedAnime extends EmbedBuilder {
    private constructor() {
        super();
    }

    public static Create (anime: Anime): EmbedAnime {
        const embed = this.CrearEmbedBasico(anime)
            .setDescription(anime.getDescription());

        return embed;
    }

    public static async CreateTranslated (anime: Anime): Promise<EmbedAnime> {
        const embed = this.CrearEmbedBasico(anime)
            .setDescription(await Helpers.traducir(anime.getDescription()));

        return embed;
    }

    private static CrearEmbedBasico(anime: Anime): EmbedAnime {
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

        embed.addFields({ name: "▾", value: informacionCampos1, inline: true },
                        { name: "▾", value: informacionCampos2, inline: true });

        embed.addFields({ name: "▾ Géneros", value: '`' + anime.getGenres().join('` - `') + '`', inline: false });
        embed.addFields({ name: "▾ Estudios", value: '`' + anime.getStudios().map(e => e.node.name).join('` - `') + '`', inline: false });
        return embed;
    }
}