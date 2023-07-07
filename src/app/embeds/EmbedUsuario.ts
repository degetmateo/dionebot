import { EmbedBuilder } from "discord.js";
import Usuario from '../apis/anilist/Usuario';

export default class EmbedUsuario extends EmbedBuilder {
    private constructor() {
        super();
    }

    public static Crear(usuario: Usuario): EmbedUsuario {
        const estadisticas = usuario.obtenerEstadisticas();
        const bio = usuario.obtenerBio();
        const avatarURL = usuario.obtenerAvatarURL();
        const bannerURL = usuario.obtenerBannerURL();
        const personajesFavoritos = usuario.obtenerPersonajesFavoritos();

        const embed = new EmbedBuilder()
            .setTitle(usuario.obtenerNombre())
            .setURL(usuario.obtenerURL())
            .setColor(usuario.obtenerColor())
            .addFields(
                { 
                    name: "Animes",
                    value: `
                    Se vió **\`${estadisticas.anime.count}\`** animes.
                    Su nota promedio es de **\`${estadisticas.anime.meanScore}\`**.
                    Sus días de animes vistos son **\`${((estadisticas.anime.minutesWatched / 60) / 24).toFixed()}\`**.
                    La cantidad de episodios que vió es de **\`${estadisticas.anime.episodesWatched}\`**.
                    Su desviación estándar es de **\`${estadisticas.anime.standardDeviation}\`**.
                    Sus géneros preferidos son:
                    **\`${usuario.obtenerGenerosPreferidosAnime(5).map(g => g.genre).join('`** - **`')}\`**
                    Sus animes favoritos son:
                    **\`${usuario.obtenerAnimesFavoritos().map(anime => anime.title.romaji || anime.title.english || anime.title.native || 'Desconocidos').join('`** - **`')}\`**
                    `,
                    inline: false
                },
                { 
                    name: "Mangas",
                    value: `
                    Se leyó **\`${estadisticas.manga.count}\`** mangas.
                    Su nota promedio es de **\`${estadisticas.manga.meanScore}\`**.
                    Su cantidad de capítulos leídos es de **\`${estadisticas.manga.chaptersRead}\`**.
                    Su cantidad de volúmenes leídos es de **\`${estadisticas.manga.volumesRead}\`**.
                    Su desviación estándar es de **\`${estadisticas.manga.standardDeviation}\`**.
                    Sus géneros preferidos son:
                    **\`${usuario.obtenerGenerosPreferidosManga(5).map(g => g.genre).join('`** - **`')}\`**
                    Sus mangas favoritos son:
                    **\`${usuario.obtenerMangasFavoritos().map(manga => manga.title.romaji || manga.title.english || manga.title.native || 'Desconocidos').join('`** - **`')}\`**
                    `,
                    inline: false
                }
            );

        bio ? embed.setDescription(usuario.obtenerBio()) : null;
        avatarURL ? embed.setThumbnail(usuario.obtenerAvatarURL()) : null;
        bannerURL ? embed.setImage(usuario.obtenerBannerURL()) : null;
        
        (personajesFavoritos && personajesFavoritos.length > 0) ?
            embed.addFields({
                name: 'Personajes Favoritos',
                value: `
                **\`${usuario.obtenerPersonajesFavoritos().map(p => p.name || 'Desconocidos').join('`** - **`')}\`**
                `,
                inline: false
            }) : null;

        return embed;
    }
}