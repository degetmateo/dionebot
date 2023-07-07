import { UserStatsProfile, UserStats, AnimeUserGenres, MangaUserGenres, MediaRelation, PersonRelation } from 'anilist-node';
import toHex from 'colornames';
import Helpers from '../../helpers';
import { ColorResolvable } from 'discord.js';

export default class Usuario {
    private usuario: UserStatsProfile;
    
    constructor (usuario: UserStatsProfile) {
        this.usuario = usuario;
    }

    public obtenerID (): number {
        return this.usuario.id;
    }

    public obtenerURL (): string {
        return this.usuario.siteUrl;
    }

    public obtenerNombre (): string {
        return this.usuario.name;
    }

    public obtenerBio (): string {
        return Helpers.eliminarEtiquetasHTML(this.usuario.about || '');
    }

    public obtenerAvatarURL (): string {
        return this.usuario.avatar.large || this.usuario.avatar.medium;
    }

    public obtenerBannerURL (): string {
        return this.usuario.bannerImage;
    }

    public obtenerColor (): ColorResolvable {
        return toHex(this.usuario.options.profileColor) as ColorResolvable;
    }

    public obtenerEstadisticas (): UserStats {
        return this.usuario.statistics;
    }

    public obtenerGenerosPreferidosAnime (cantidad: number | null): Array<AnimeUserGenres> {
        const generos = this.obtenerEstadisticas().anime.genres;
        const generosOrdenados = generos.sort((a: AnimeUserGenres, b: AnimeUserGenres) => b.count - a.count);
        return cantidad ? generosOrdenados.slice(0, cantidad) : generosOrdenados;
    }

    public obtenerGenerosPreferidosManga (cantidad: number | null): Array<MangaUserGenres> {
        const generos = this.obtenerEstadisticas().manga.genres;
        const generosOrdenados = generos.sort((a: MangaUserGenres, b: MangaUserGenres) => b.count - a.count);
        return cantidad ? generosOrdenados.slice(0, cantidad) : generosOrdenados;
    }

    public obtenerAnimesFavoritos (): Array<MediaRelation> {
        return this.usuario.favourites.anime;
    }

    public obtenerMangasFavoritos (): Array<MediaRelation> {
        return this.usuario.favourites.manga;
    }

    public obtenerPersonajesFavoritos (): Array<PersonRelation> {
        const favoritos: any = this.usuario.favourites; 
        return favoritos.characters;
    }
}