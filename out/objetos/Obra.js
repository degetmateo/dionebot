"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Obra = void 0;
var translate = require("translate");
var Obra = /** @class */ (function () {
    function Obra(media) {
        var _this = this;
        this.getColorEstado = function () {
            var hex = "";
            switch (_this.getEstado()) {
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
    Obra.prototype.getID = function () {
        return this.media.id == null ? "?" : this.media.id.toString();
    };
    Obra.prototype.getMalID = function () {
        return this.media.idMal == null ? "?" : this.media.idMal.toString();
    };
    Obra.prototype.getEstudios = function () {
        return this.media.studios.nodes == null ? null : this.media.studios.nodes;
    };
    Obra.prototype.getFormato = function () {
        return this.media.format == null ? "?" : this.media.format.toString();
    };
    Obra.prototype.getGeneros = function () {
        return this.media.genres == null ? ["?"] : this.media.genres;
    };
    Obra.prototype.getTipo = function () {
        return this.media.type == null ? "?" : this.media.type.toString();
    };
    Obra.prototype.getFavoritos = function () {
        return this.media.favourites == null ? "?" : this.media.favourites.toString();
    };
    Obra.prototype.getPopularidad = function () {
        return this.media.popularity == null ? "?" : this.media.popularity.toString();
    };
    Obra.prototype.getEstado = function () {
        return this.media.status == null ? "?" : this.media.status.toString();
    };
    Obra.prototype.getEpisodios = function () {
        return this.media.episodes == null ? "?" : this.media.episodes.toString();
    };
    Obra.prototype.getTemporada = function () {
        return this.media.season == null ? "?" : this.media.season.toString();
    };
    Obra.prototype.getAnioEmision = function () {
        return this.media.seasonYear == null ? "?" : this.media.seasonYear.toString();
    };
    Obra.prototype.getDuracion = function () {
        return this.media.duration == null ? "?" : this.media.duration.toString();
    };
    Obra.prototype.getCapitulos = function () {
        return this.media.chapters == null ? "?" : this.media.chapters.toString();
    };
    Obra.prototype.getVolumenes = function () {
        return this.media.volumes == null ? "?" : this.media.volumes.toString();
    };
    Obra.prototype.getPromedio = function () {
        return this.media.meanScore == null ? "?" : this.media.meanScore.toString();
    };
    Obra.prototype.getURL = function () {
        return this.media.siteUrl == null ? "?" : this.media.siteUrl.toString();
    };
    Obra.prototype.getTitulos = function () {
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
    };
    Obra.prototype.getDescripcion = function () {
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
    };
    Obra.prototype.getDescripcionTraducida = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, translate(this.media.description == null ? "?" : this.media.description.trim()
                            .split("<br>").join("")
                            .split("</br>").join("")
                            .split("<i>").join("")
                            .split("</i>").join("")
                            .split("<b>").join("")
                            .split("</b>").join("")
                            .split("&ldquo;").join("*")
                            .split("&rdquo;").join("*")
                            .split("&rsquo;").join("'"), "es")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Obra.prototype.getCoverImageURL = function () {
        return this.media.coverImage.extraLarge == null ? "?" : this.media.coverImage.extraLarge.toString();
    };
    return Obra;
}());
exports.Obra = Obra;
