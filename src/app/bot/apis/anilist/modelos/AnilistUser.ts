import toHex from 'colornames';
import { ColorResolvable } from 'discord.js';
import { Genero, Usuario, UsuarioEstadisticas, UsuarioGenerosFavoritosLista } from '../tipos/Usuario';
import Helpers from '../../../Helpers';

export default class AnilistUser {
    private usuario: Usuario;
    
    constructor (usuario: Usuario) {
        this.usuario = usuario;
    }

    public getId (): number {
        return this.usuario.id;
    }

    public getURL (): string {
        return this.usuario.siteUrl;
    }

    public getName (): string {
        return this.usuario.name;
    }

    public getBio (): string {
        return Helpers.eliminarEtiquetasHTML(this.usuario.about || '');
    }

    public getAvatarURL (): string {
        return this.usuario.avatar.large || this.usuario.avatar.medium;
    }

    public getBannerURL (): string {
        return this.usuario.bannerImage;
    }

    public getColor (): ColorResolvable {
        return toHex(this.usuario.options.profileColor) as ColorResolvable;
    }

    public getStatistics (): UsuarioEstadisticas {
        return this.usuario.statistics;
    }

    public getGenresSortedByQuantity (): UsuarioGenerosFavoritosLista {
        return this.getGenres().sort((a, b) => b.count - a.count);
    }

    public getGenresSortedByCalification (): UsuarioGenerosFavoritosLista {
        return this.getGenres().sort((a, b) => b.meanScore - a.meanScore);
    }

    private getGenres (): UsuarioGenerosFavoritosLista {
        const generosAnime = this.getStatistics().anime.genres;
        const generosManga = this.getStatistics().manga.genres;

        const generos = generosAnime.map(ga => {
            let gm = generosManga.find(gm => gm.genre.toLowerCase() === ga.genre.toLowerCase());
            
            if (!gm) {
                gm = {
                    genre: ga.genre,
                    count: 0,
                    meanScore: 0,
                }
            }

            const cantidad = ga.count + gm.count;
            const promedio = (ga.meanScore + gm.meanScore) / 2;
            const generoMasConsumido = this.getMostConsumedGenre();
            const promedioPonderado = Helpers.calcularPromedioPonderado(cantidad, promedio, generoMasConsumido.count);

            return { genre: ga.genre, count: cantidad, meanScore: promedioPonderado };
        })

        return generos;
    }

    private getMostConsumedGenre (): Genero {
        const generosAnime = this.getStatistics().anime.genres;
        const generosManga = this.getStatistics().manga.genres;

        let genero: Genero;

        for (const ga of generosAnime) {
            if (!genero) genero = ga;
            const gm = generosManga.find(g => g.genre === ga.genre);
            if (!gm) continue;
            const cantidad = ga.count + gm.count;
            (cantidad > genero.count) ? genero = ga : null;
        }

        return genero;
    }

    public getCreationDate (): Date {
        return new Date(this.usuario.createdAt * 1000);
    }
}