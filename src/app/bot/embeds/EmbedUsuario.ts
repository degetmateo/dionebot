import { EmbedBuilder } from "discord.js";
import UsuarioAnilist from "../apis/anilist/modelos/AnilistUser";
import Helpers from "../Helpers";

export default class EmbedUsuario extends EmbedBuilder {
    private usuario: UsuarioAnilist;

    public static readonly LIMITE_CARACTERES_DESCRIPCION: number = 2048;
    public static readonly LIMITE_CARACTERES_CAMPO: number = 1024;

    private constructor(usuario: UsuarioAnilist) {
        super();
        this.usuario = usuario;
    }

    public static async CrearPrincipal (usuario: UsuarioAnilist): Promise<EmbedUsuario> {
        const embed = new EmbedUsuario(usuario);

        embed.establecerColor();
        embed.establecerPortada();
        embed.establecerBanner();
        await embed.establecerDescripcion();
        
        return embed;
    }

    private establecerColor (): void {
        this.setColor(this.usuario.getColor());
    }

    private async establecerDescripcion (): Promise<void> {
        const estadisticas = this.usuario.getStatistics();
        const generosCantidad = this.usuario.getGenresSortedByQuantity();
        const generosCalificacion = this.usuario.getGenresSortedByCalification();

        const generoMasConsumido = generosCantidad[0]
        const generoMenosConsumido = generosCantidad[generosCantidad.length - 1]
        const generoMejorCalificado = generosCalificacion[0]
        const generoPeorCalificado = generosCalificacion[generosCalificacion.length - 1]

        const mediaPonderadaURL = 'https://es.wikipedia.org/wiki/Media_ponderada';

        const descripcion = `
**[${this.usuario.getName()}](${this.usuario.getURL()})**
↪ Se unio el **${this.usuario.getCreationDate().toLocaleDateString()}**

**[Anime](${this.usuario.getURL()}/animelist)**
↪ Entradas: **${estadisticas.anime.count}**
↪ Episodios Vistos: **${estadisticas.anime.episodesWatched}**
↪ Tiempo Visto: **${(estadisticas.anime.minutesWatched / 60).toFixed(1)} horas**
↪ Calificación Promedio: **${estadisticas.anime.meanScore}**

**[Manga](${this.usuario.getURL()}/mangalist)**
↪ Entradas: **${estadisticas.manga.count}**
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
        const avatarURL = this.usuario.getAvatarURL();
        avatarURL ? this.setThumbnail(avatarURL) : null;
    }

    private establecerBanner (): void {
        const bannerURL = this.usuario.getBannerURL();
        bannerURL ? this.setImage(bannerURL) : null;
    }
}