"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Obra = void 0;
const translate = require("translate");
class Obra {
    constructor(media) {
        this.getColorEstado = () => {
            let hex = "";
            switch (this.getEstado()) {
                case "FINISHED":
                    hex = "00D907";
                    break;
                case "RELEASING":
                    hex = "FFF700";
                    break;
                case "NOT_YET_RELEASED":
                    hex = "000000";
                    break;
                case "CANCELLED":
                    hex = "FF0000";
                    break;
                case "HIATUS":
                    hex = "FF7B00";
                    break;
            }
            return ("0x" + hex);
        };
        this.media = media;
        translate.engine = "google";
    }
    getID() {
        return this.media.id == null ? "?" : this.media.id.toString();
    }
    getMalID() {
        return this.media.idMal == null ? "?" : this.media.idMal.toString();
    }
    getEstudios() {
        return this.media.studios.nodes == null ? null : this.media.studios.nodes;
    }
    getFormato() {
        return this.media.format == null ? "?" : this.media.format.toString();
    }
    getGeneros() {
        return this.media.genres == null ? ["?"] : this.media.genres;
    }
    getTipo() {
        return this.media.type == null ? "?" : this.media.type.toString();
    }
    getFavoritos() {
        return this.media.favourites == null ? "?" : this.media.favourites.toString();
    }
    getPopularidad() {
        return this.media.popularity == null ? "?" : this.media.popularity.toString();
    }
    getEstado() {
        return this.media.status == null ? "?" : this.media.status.toString();
    }
    getEpisodios() {
        return this.media.episodes == null ? "?" : this.media.episodes.toString();
    }
    getTemporada() {
        return this.media.season == null ? "?" : this.media.season.toString();
    }
    getAnioEmision() {
        return this.media.seasonYear == null ? "?" : this.media.seasonYear.toString();
    }
    getDuracion() {
        return this.media.duration == null ? "?" : this.media.duration.toString();
    }
    getCapitulos() {
        return this.media.chapters == null ? "?" : this.media.chapters.toString();
    }
    getVolumenes() {
        return this.media.volumes == null ? "?" : this.media.volumes.toString();
    }
    getPromedio() {
        return this.media.meanScore == null ? "?" : this.media.meanScore.toString();
    }
    getURL() {
        return this.media.siteUrl == null ? "?" : this.media.siteUrl.toString();
    }
    getTitulos() {
        if (!this.media.title) {
            return { romaji: "?", english: "?", native: "?" };
        }
        if (!this.media.title.romaji) {
            this.media.title.romaji = "?";
        }
        if (!this.media.title.english) {
            this.media.title.english = "?";
        }
        if (!this.media.title.native) {
            this.media.title.native = "?";
        }
        return this.media.title;
    }
    getDescripcion() {
        return this.media.description == null ? "?" : this.media.description.trim()
            .split("<br>").join("")
            .split("</br>").join("")
            .split("<i>").join("")
            .split("</i>").join("")
            .split("<b>").join("")
            .split("</b>").join("")
            .split("&ldquo;").join("*")
            .split("&rdquo;").join("*")
            .split("&rsquo;").join("'");
    }
    async getDescripcionTraducida() {
        return await translate(this.media.description == null ? "?" : this.media.description.trim()
            .split("<br>").join("")
            .split("</br>").join("")
            .split("<i>").join("")
            .split("</i>").join("")
            .split("<b>").join("")
            .split("</b>").join("")
            .split("&ldquo;").join("*")
            .split("&rdquo;").join("*")
            .split("&rsquo;").join("'"), "es");
    }
    getCoverImageURL() {
        return this.media.coverImage.extraLarge == null ? "?" : this.media.coverImage.extraLarge.toString();
    }
}
exports.Obra = Obra;
