import toHex from 'colornames';
import { ColorResolvable } from 'discord.js';
import { Genero, Usuario, UsuarioEstadisticas, UsuarioGenerosFavoritosLista } from '../types/Usuario';
import Helpers from '../../../Helpers';

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

    public obtenerGenerosOrdenadosPorCantidad (): UsuarioGenerosFavoritosLista {
        return this.obtenerGeneros().sort((a, b) => b.count - a.count);
    }

    private obtenerGeneros (): UsuarioGenerosFavoritosLista {
        const generosAnime = this.obtenerEstadisticas().anime.genres;
        const generosManga = this.obtenerEstadisticas().manga.genres;

        const generos = generosAnime.map(ga => {
            let gm = generosManga.find(gm => gm.genre.toLowerCase() === ga.genre.toLowerCase());
            
            if (!gm) {
                gm = {
                    genre: ga.genre,
                    count: 0,
                }
            }

            const cantidad = ga.count + gm.count;
            return { genre: ga.genre, count: cantidad };
        })

        return generos;
    }

    public obtenerFechaCreacion (): Date {
        return new Date(this.usuario.createdAt * 1000);
    }
}