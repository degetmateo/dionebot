"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colornames_1 = __importDefault(require("colornames"));
const Helpers_1 = __importDefault(require("../../../Helpers"));
class AnilistUser {
    constructor(usuario) {
        this.usuario = usuario;
    }
    getId() {
        return this.usuario.id;
    }
    getURL() {
        return this.usuario.siteUrl;
    }
    getName() {
        return this.usuario.name;
    }
    getBio() {
        return Helpers_1.default.eliminarEtiquetasHTML(this.usuario.about || '');
    }
    getAvatarURL() {
        return this.usuario.avatar.large || this.usuario.avatar.medium;
    }
    getBannerURL() {
        return this.usuario.bannerImage;
    }
    getColor() {
        return (0, colornames_1.default)(this.usuario.options.profileColor);
    }
    getStatistics() {
        return this.usuario.statistics;
    }
    getGenresSortedByQuantity() {
        return this.getGenres().sort((a, b) => b.count - a.count);
    }
    getGenresSortedByCalification() {
        return this.getGenres().sort((a, b) => b.meanScore - a.meanScore);
    }
    getGenres() {
        const generosAnime = this.getStatistics().anime.genres;
        const generosManga = this.getStatistics().manga.genres;
        const generos = generosAnime.map(ga => {
            let gm = generosManga.find(gm => gm.genre.toLowerCase() === ga.genre.toLowerCase());
            if (!gm) {
                gm = {
                    genre: ga.genre,
                    count: 0,
                    meanScore: 0,
                };
            }
            const cantidad = ga.count + gm.count;
            const promedio = (ga.meanScore + gm.meanScore) / 2;
            const generoMasConsumido = this.getMostConsumedGenre();
            const promedioPonderado = Helpers_1.default.calcularPromedioPonderado(cantidad, promedio, generoMasConsumido.count);
            return { genre: ga.genre, count: cantidad, meanScore: promedioPonderado };
        });
        return generos;
    }
    getMostConsumedGenre() {
        const generosAnime = this.getStatistics().anime.genres;
        const generosManga = this.getStatistics().manga.genres;
        let genero;
        for (const ga of generosAnime) {
            if (!genero)
                genero = ga;
            const gm = generosManga.find(g => g.genre === ga.genre);
            if (!gm)
                continue;
            const cantidad = ga.count + gm.count;
            (cantidad > genero.count) ? genero = ga : null;
        }
        return genero;
    }
    getCreationDate() {
        return new Date(this.usuario.createdAt * 1000);
    }
}
exports.default = AnilistUser;
