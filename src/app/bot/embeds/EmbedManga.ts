import { EmbedBuilder } from "discord.js";
import Manga from "../media/Manga";
import Helpers from "../Helpers";

export default class EmbedManga extends EmbedBuilder {
    private constructor() {
        super();
    }

    public static Crear(manga: Manga): EmbedManga {
        const embed = this.CrearEmbedBasico(manga)
            .setDescription(manga.obtenerDescripcion());

        return embed;
    }

    public static async CrearTraducido(manga: Manga): Promise<EmbedManga> {
        const embed = this.CrearEmbedBasico(manga)
            .setDescription(await Helpers.traducir(manga.obtenerDescripcion()));

        return embed;
    }

    private static CrearEmbedBasico(manga: Manga): EmbedManga {
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
            .addFields(
                { name: "▾", value: informacionCampos1, inline: true },
                { name: "▾", value: informacionCampos2, inline: true }
            )

        embed.addFields({ name: "▾ Géneros", value: '`' + manga.obtenerGeneros().join('` - `') + '`', inline: false })

        return embed;
    }
}