import { EmbedBuilder } from "discord.js";
import Helpers from "../Helpers";
import AnilistUser from "../apis/anilist/modelos/AnilistUser";

export default class EmbedUser extends EmbedBuilder {
    private user: AnilistUser;

    public static readonly LIMITE_CARACTERES_DESCRIPCION: number = 2048;
    public static readonly LIMITE_CARACTERES_CAMPO: number = 1024;

    private constructor(user: AnilistUser) {
        super();
        this.user = user;
    }

    public static Create (user: AnilistUser): EmbedUser {
        const embed = new EmbedUser(user);

        embed.establecerColor();
        embed.establecerPortada();
        embed.establecerBanner();
        embed.establecerDescripcion();
        
        return embed;
    }

    private establecerColor (): void {
        this.setColor(this.user.getColor());
    }

    private establecerDescripcion (): void {
        const estadisticas = this.user.getStatistics();
        const generosCantidad = this.user.getGenresSortedByQuantity();
        const generosCalificacion = this.user.getGenresSortedByCalification();

        const generoMasConsumido = generosCantidad[0] || { genre: 'Desconocido', count: '-', meanScore: 0 }
        const generoMenosConsumido = generosCantidad[generosCantidad.length - 1] || { genre: 'Desconocido', count: '-', meanScore: 0 }
        const generoMejorCalificado = generosCalificacion[0] || { genre: 'Desconocido', count: '-', meanScore: 0 }
        const generoPeorCalificado = generosCalificacion[generosCalificacion.length - 1] || { genre: 'Desconocido', count: '-', meanScore: 0 }

        const mediaPonderadaURL = 'https://es.wikipedia.org/wiki/Media_ponderada';

        const descripcion = `
**[${this.user.getName()}](${this.user.getURL()})**
↪ Se unio el **${this.user.getCreationDate().toLocaleDateString()}**

**[Anime](${this.user.getURL()}/animelist)**
↪ Cantidad: **${estadisticas.anime.count}**
↪ Episodios Vistos: **${estadisticas.anime.episodesWatched}**
↪ Tiempo Visto: **${(estadisticas.anime.minutesWatched / 60).toFixed(1)} horas**
↪ Calificación Promedio: **${estadisticas.anime.meanScore}**

**[Manga](${this.user.getURL()}/mangalist)**
↪ Cantidad: **${estadisticas.manga.count}**
↪ Capítulos Leídos: **${estadisticas.manga.chaptersRead}**
↪ Volúmenes Leídos: **${estadisticas.manga.volumesRead}**
↪ Calificación Promedio: **${estadisticas.manga.meanScore}**

**Tendencias**
↪ Más consumido: **${Helpers.capitalizarTexto(generoMasConsumido.genre)} [${generoMasConsumido.count}]**
↪ Menos consumido: **${Helpers.capitalizarTexto(generoMenosConsumido.genre)} [${generoMenosConsumido.count}]**
↪ [Mejor](${mediaPonderadaURL}) calificado: **${Helpers.capitalizarTexto(generoMejorCalificado.genre)} [${generoMejorCalificado.meanScore.toFixed(2)}]** 
↪ [Peor](${mediaPonderadaURL}) calificado: **${Helpers.capitalizarTexto(generoPeorCalificado.genre)} [${generoPeorCalificado.meanScore.toFixed(2)}]**
        `;

        this.setDescription(descripcion);
    }

    private establecerPortada (): void {
        const avatarURL = this.user.getAvatarURL();
        avatarURL ? this.setThumbnail(avatarURL) : null;
    }

    private establecerBanner (): void {
        const bannerURL = this.user.getBannerURL();
        bannerURL ? this.setImage(bannerURL) : null;
    }
}