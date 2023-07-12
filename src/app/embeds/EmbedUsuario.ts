import { EmbedBuilder } from "discord.js";
import Usuario from '../apis/anilist/UsuarioAnilist';

export default class EmbedUsuario extends EmbedBuilder {
    private usuario: Usuario;

    public static readonly LIMITE_CARACTERES_DESCRIPCION: number = 2048;
    public static readonly LIMITE_CARACTERES_CAMPO: number = 1024;

    private constructor(usuario: Usuario) {
        super();
        this.usuario = usuario;
    }

    public static CrearPrincipal (usuario: Usuario): EmbedUsuario {
        const embed = new EmbedUsuario(usuario);

        embed.establecerTitulo();
        embed.establecerDescripcion();
        embed.establecerColor();
        embed.establecerPortada();
        embed.establecerBanner();
        embed.establecerCampoInformacionBasicaAnime();
        embed.establecerCampoGenerosFavoritosAnime();
        embed.establecerCampoInformacionBasicaManga();
        embed.establecerCampoGenerosFavoritosManga();
        
        return embed;
    }

    public static CrearInformacionAnime (usuario: Usuario): EmbedUsuario {
        const embed = new EmbedUsuario(usuario);

        embed.establecerTitulo();
        embed.establecerPortada();
        embed.establecerColor();
        embed.establecerCampoAnimesFavoritos();

        return embed;
    }

    public static CrearInformacionManga (usuario: Usuario): EmbedUsuario {
        const embed = new EmbedUsuario(usuario);

        embed.establecerTitulo();
        embed.establecerPortada();
        embed.establecerColor();
        embed.establecerCampoMangasFavoritos();

        return embed;
    }

    public static CrearInformacionFavoritosExtra (usuario: Usuario): EmbedUsuario {
        const embed = new EmbedUsuario(usuario);

        embed.establecerTitulo();
        embed.establecerPortada();
        embed.establecerColor();
        embed.establecerCampoPersonajesFavoritos();

        return embed;
    }

    private establecerTitulo (): void {
        this.setTitle(this.usuario.obtenerNombre());
        this.setURL(this.usuario.obtenerURL());
    }

    private establecerColor (): void {
        this.setColor(this.usuario.obtenerColor());
    }

    private establecerDescripcion (): void {
        const bio = this.usuario.obtenerBio();
        if (!bio || bio.length < 1) return;
        (bio.length < EmbedUsuario.LIMITE_CARACTERES_DESCRIPCION) ?
            this.setDescription(bio) :
            this.setDescription(bio.slice(0, EmbedUsuario.LIMITE_CARACTERES_DESCRIPCION - 4)  + '\n...');
    }

    private establecerPortada (): void {
        const avatarURL = this.usuario.obtenerAvatarURL();
        avatarURL ? this.setThumbnail(avatarURL) : null;
    }

    private establecerBanner (): void {
        const bannerURL = this.usuario.obtenerBannerURL();
        bannerURL ? this.setImage(bannerURL) : null;
    }

    private establecerCampoInformacionBasicaAnime (): void {
        let informacion = '';
        const estadisticas = this.usuario.obtenerEstadisticas();

        informacion =
        `
Se vió **\`${estadisticas.anime.count}\`** animes.
Su nota promedio es de **\`${estadisticas.anime.meanScore}\`**.
Sus días de animes vistos son **\`${((estadisticas.anime.minutesWatched / 60) / 24).toFixed()}\`**.
La cantidad de episodios que vió es de **\`${estadisticas.anime.episodesWatched}\`**.
Su desviación estándar es de **\`${estadisticas.anime.standardDeviation}\`**.`;

        informacion.length <= EmbedUsuario.LIMITE_CARACTERES_CAMPO ? this.addFields({ name: 'Animes', value: informacion }) : null;
    }

    private establecerCampoGenerosFavoritosAnime (): void {
        const informacion: string = `**\`${this.usuario.obtenerGenerosPreferidosAnime(5).map(g => g.genre).join('`** - **`')}\`**`;
        informacion.length <= EmbedUsuario.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Generos Favoritos de Anime', value: informacion }) :
            this.addFields({ name: 'Generos Favoritos de Anime', value: informacion.slice(0, EmbedUsuario.LIMITE_CARACTERES_CAMPO - 4) + '\n...' });
    }

    private establecerCampoGenerosFavoritosManga (): void {
        const informacion: string = `**\`${this.usuario.obtenerGenerosPreferidosManga(5).map(g => g.genre).join('`** - **`')}\`**`;
        informacion.length <= EmbedUsuario.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Generos Favoritos de Manga', value: informacion }) : 
            this.addFields({ name: 'Generos Favoritos de Manga', value: informacion.slice(0, EmbedUsuario.LIMITE_CARACTERES_CAMPO - 4) + '\n...' });   
    }

    private establecerCampoAnimesFavoritos (): void {
        let informacion = `▸ ${this.usuario.obtenerAnimesFavoritos().map(anime => anime.node.title.romaji || anime.node.title.english || anime.node.title.native || 'Desconocidos').join('\n▸ ')}`;

        informacion.length <= EmbedUsuario.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Animes Favoritos', value: informacion }) : 
            this.addFields({ name: 'Animes Favoritos', value: informacion.slice(0, EmbedUsuario.LIMITE_CARACTERES_CAMPO - 4) + '\n...' });
    }

    private establecerCampoInformacionBasicaManga (): void {
        let informacion = '';
        const estadisticas = this.usuario.obtenerEstadisticas();

        informacion =
        `
Se leyó **\`${estadisticas.manga.count}\`** mangas.
Su nota promedio es de **\`${estadisticas.manga.meanScore}\`**.
Su cantidad de capítulos leídos es de **\`${estadisticas.manga.chaptersRead}\`**.
Su cantidad de volúmenes leídos es de **\`${estadisticas.manga.volumesRead}\`**.
Su desviación estándar es de **\`${estadisticas.manga.standardDeviation}\`**.`

        informacion.length <= EmbedUsuario.LIMITE_CARACTERES_CAMPO ? this.addFields({ name: 'Mangas', value: informacion }) : null;
    }

    private establecerCampoMangasFavoritos (): void {
        let informacion = `▸ ${this.usuario.obtenerMangasFavoritos().map(manga => manga.node.title.romaji || manga.node.title.english || manga.node.title.native || 'Desconocidos').join('\n▸ ')}`;

        informacion.length <= EmbedUsuario.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Mangas Favoritos', value: informacion }) : 
            this.addFields({ name: 'Mangas Favoritos', value: informacion.slice(0, EmbedUsuario.LIMITE_CARACTERES_CAMPO - 4) + '\n...' });
    }

    private establecerCampoPersonajesFavoritos (): void  {
        let informacion = `▸ ${this.usuario.obtenerPersonajesFavoritos().map(p => p.node.name || 'Desconocidos').join('\n▸ ')}`;

        informacion.length <= EmbedUsuario.LIMITE_CARACTERES_CAMPO ?
            this.addFields({ name: 'Personajes Favoritos', value: informacion }) : 
            this.addFields({ name: 'Personajes Favoritos', value: informacion.slice(0, EmbedUsuario.LIMITE_CARACTERES_CAMPO - 4) + '\n...' });
    }
}