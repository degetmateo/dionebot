"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = __importDefault(require("../../../../Helpers"));
class Media {
    constructor(media) {
        this.media = media;
    }
    obtenerID() {
        return this.media.id;
    }
    obtenerMalID() {
        return this.media.idMal;
    }
    obtenerTituloPreferido() {
        return this.media.title.userPreferred;
    }
    obtenerTitulo() {
        return this.media.title.userPreferred || this.media.title.romaji || this.media.title.english || this.media.title.native;
    }
    obtenerColor() {
        return this.media.coverImage.color;
    }
    obtenerBannerImageURL() {
        return this.media.bannerImage;
    }
    obtenerDescripcion() {
        if (!this.media.description)
            return '?';
        return this.media.description.length <= 0 ? "?" : Helpers_1.default.eliminarEtiquetasHTML(this.media.description);
    }
    obtenerEnlace() {
        return this.media.siteUrl;
    }
    obtenerTitulos() {
        return this.media.title;
    }
    obtenerCoverImageURL() {
        return this.media.coverImage.large || this.media.coverImage.medium || this.media.coverImage.small;
    }
    obtenerFormato() {
        return this.media.format;
    }
    obtenerGeneros() {
        return this.media.genres;
    }
    obtenerCantidadFavoritos() {
        return this.media.favourites;
    }
    obtenerPopularidad() {
        return this.media.popularity;
    }
    obtenerEstado() {
        return this.media.status;
    }
    obtenerEstudios() {
        return this.media.studios.edges;
    }
    obtenerFechaEmision() {
        return this.media.startDate;
    }
    obtenerCalificacionPromedio() {
        return this.media.meanScore;
    }
}
exports.default = Media;
