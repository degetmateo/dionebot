import { EmbedBuilder } from "discord.js";
import Anime from "../media/Anime";
import Helpers from "../helpers";

export default class EmbedAnime extends EmbedBuilder {
    private constructor() {
        super();
    }

    public static Crear(anime: Anime): EmbedAnime {
        const embed = this.CrearEmbedBasico(anime)
            .setDescription(anime.obtenerDescripcion());

        return embed;
    }

    public static async CrearTraducido(anime: Anime): Promise<EmbedAnime> {
        const embed = this.CrearEmbedBasico(anime)
            .setDescription(await Helpers.traducir(anime.obtenerDescripcion()));

        return embed;
    }

    private static CrearEmbedBasico(anime: Anime): EmbedAnime {
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

        const informacionCampos2 = `
            ‣ **Favoritos**: ${anime.obtenerCantidadFavoritos()}\n‣ **Temporada**: ${anime.obtenerTemporada()}\n‣ **Año de Emisión**: ${anime.obtenerAnioEmision()}\n‣ **Episodios**: ${anime.obtenerEpisodios()}
        `;

        embed.addFields({ name: "▾", value: informacionCampos1, inline: true },
                        { name: "▾", value: informacionCampos2, inline: true });

        embed.addFields({ name: "▾ Géneros", value: '`' + anime.obtenerGeneros().join('` - `') + '`', inline: false });
        embed.addFields({ name: "▾ Estudios", value: '`' + anime.obtenerEstudios().edges.map(e => e.node.name).join('` - `') + '`', inline: false });
        return embed;
    }
}