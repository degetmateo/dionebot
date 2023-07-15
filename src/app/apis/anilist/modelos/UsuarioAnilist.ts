import toHex from 'colornames';
import Helpers from '../../../helpers';
import { ColorResolvable } from 'discord.js';
import { Usuario, UsuarioCharFavLista, UsuarioEstadisticas, UsuarioGenerosFavoritosLista, UsuarioMediaFavLista } from '../types/Usuario';

export default class UsuarioAnilist {
    private usuario: Usuario;
    
    constructor (usuario: Usuario) {
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

    public obtenerEstadisticas (): UsuarioEstadisticas {
        return this.usuario.statistics;
    }

    public obtenerGenerosPreferidosAnime (cantidad: number | null): UsuarioGenerosFavoritosLista {
        const generos = this.obtenerEstadisticas().anime.genres;
        const generosOrdenados = generos.sort((a, b) => b.count - a.count);
        return cantidad ? generosOrdenados.slice(0, cantidad) : generosOrdenados;
    }

    public obtenerGenerosPreferidosManga (cantidad: number | null): UsuarioGenerosFavoritosLista {
        const generos = this.obtenerEstadisticas().manga.genres;
        const generosOrdenados = generos.sort((a, b) => b.count - a.count);
        return cantidad ? generosOrdenados.slice(0, cantidad) : generosOrdenados;
    }

    public obtenerAnimesFavoritos (): UsuarioMediaFavLista {
        return this.usuario.favourites.anime.edges;
    }

    public obtenerMangasFavoritos (): UsuarioMediaFavLista {
        return this.usuario.favourites.manga.edges;
    }

    public obtenerPersonajesFavoritos (): UsuarioCharFavLista {
        return this.usuario.favourites.characters.edges; 
    }
}