import { EmbedBuilder } from "discord.js";
import UsuarioAnilist from "../apis/anilist/modelos/UsuarioAnilist";
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
        this.setColor(this.usuario.obtenerColor());
    }

    private async establecerDescripcion (): Promise<void> {
        const estadisticas = this.usuario.obtenerEstadisticas();
        const generos = this.usuario.obtenerGenerosOrdenadosPorCantidad();

        const descripcion = `
**[${this.usuario.obtenerNombre()}](${this.usuario.obtenerURL()})**
↪ Se unio el **${this.usuario.obtenerFechaCreacion().toLocaleDateString()}**

**[Anime](${this.usuario.obtenerURL()}/animelist)**
↪ Entradas: **${estadisticas.anime.count}**
↪ Episodios Vistos: **${estadisticas.anime.episodesWatched}**
↪ Tiempo Visto: **${(estadisticas.anime.minutesWatched / 60).toFixed(1)} horas**
↪ Calificación Promedio: **${estadisticas.anime.meanScore}**

**[Manga](${this.usuario.obtenerURL()}/mangalist)**
↪ Entradas: **${estadisticas.manga.count}**
↪ Capítulos Leídos: **${estadisticas.manga.chaptersRead}**
↪ Volúmenes Leídos: **${estadisticas.manga.volumesRead}**
↪ Calificación Promedio: **${estadisticas.manga.meanScore}**

**Tendencias**
↪ Género más consumido: **${Helpers.capitalizarTexto(await Helpers.traducir(generos[0].genre))}**
↪ Género menos consumido: **${Helpers.capitalizarTexto(await Helpers.traducir(generos[generos.length - 1].genre))}**
        `;

        this.setDescription(descripcion);
    }

    private establecerPortada (): void {
        const avatarURL = this.usuario.obtenerAvatarURL();
        avatarURL ? this.setThumbnail(avatarURL) : null;
    }

    private establecerBanner (): void {
        const bannerURL = this.usuario.obtenerBannerURL();
        bannerURL ? this.setImage(bannerURL) : null;
    }
}