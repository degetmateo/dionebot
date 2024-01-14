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
    getId() {
        return this.media.id;
    }
    getMalId() {
        return this.media.idMal;
    }
    getPreferredTitle() {
        return this.media.title.userPreferred;
    }
    getTitle() {
        return this.media.title.userPreferred || this.media.title.romaji || this.media.title.english || this.media.title.native;
    }
    getColor() {
        return this.media.coverImage.color;
    }
    getBannerURL() {
        return this.media.bannerImage;
    }
    getDescription() {
        if (!this.media.description)
            return '?';
        return this.media.description.length <= 0 ? "?" : Helpers_1.default.eliminarEtiquetasHTML(this.media.description);
    }
    getURL() {
        return this.media.siteUrl;
    }
    getTitles() {
        return this.media.title;
    }
    getCoverURL() {
        return this.media.coverImage.large || this.media.coverImage.medium || this.media.coverImage.small;
    }
    getFormat() {
        return this.media.format;
    }
    getGenres() {
        return this.media.genres;
    }
    getFavourites() {
        return this.media.favourites;
    }
    getPopularity() {
        return this.media.popularity;
    }
    getStatus() {
        return this.media.status;
    }
    getStudios() {
        return this.media.studios.edges;
    }
    getStartDate() {
        return this.media.startDate;
    }
    getMeanScore() {
        return this.media.meanScore;
    }
}
exports.default = Media;
