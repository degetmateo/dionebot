"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = __importDefault(require("../../../Helpers"));
const iso_639_1_1 = __importDefault(require("iso-639-1"));
class VisualNovel {
    constructor(datos) {
        this._id = datos.id;
        this._titulo = datos.title;
        this._descripcion = Helpers_1.default.eliminarEtiquetasHTML(datos.description);
        this._codigoEstado = datos.devstatus;
        this._estado = this.getStatus();
        this._URL = `https://vndb.org/${this._id}`;
        this._imagenURL = datos.image.url;
        this._aliases = datos.aliases;
        this._fecha = new Date(datos.released);
        this._idiomas = this.getLanguagesNames(datos.languages);
        this._plataformas = datos.platforms;
        this._duracion = datos.length_minutes;
        this._calificacion = datos.rating;
        this._popularidad = datos.popularity;
    }
    getLanguagesNames(idiomas) {
        const idiomasTraducidos = new Array();
        for (let i = 0; i < idiomas.length; i++) {
            const nombreIdioma = iso_639_1_1.default.getName(idiomas[i]);
            nombreIdioma.trim() === '' ?
                idiomasTraducidos.push(idiomas[i]) :
                idiomasTraducidos.push(nombreIdioma);
        }
        return idiomasTraducidos;
    }
    getId() {
        return this._id === null ? '?' : this._id;
    }
    getTitle() {
        return this._titulo === null ? '?' : this._titulo;
    }
    getDescription() {
        return this.esDescripcionNula() ?
            'Descripcion Desconocida' : this._descripcion;
    }
    esDescripcionNula() {
        const d = this._descripcion;
        return (d.length <= 1 || d === null);
    }
    getStatus() {
        switch (this._codigoEstado) {
            case 0: return 'FINALIZADA';
            case 1: return 'EN DESARROLLO';
            case 2: return 'CANCELADA';
            default: return 'DESCONOCIDO';
        }
    }
    getStatusColor() {
        let hex = "";
        switch (this._estado) {
            case 'FINALIZADA':
                hex = "00D907";
                break;
            case 'EN DESARROLLO':
                hex = "FFF700";
                break;
            case 'CANCELADA':
                hex = "FF0000";
                break;
            case 'DESCONOCIDO':
                hex = "000000";
                break;
            default:
                hex = "000000";
                break;
        }
        return ('#' + hex);
    }
    getUrl() {
        return this._URL;
    }
    getCoverUrl() {
        return this._imagenURL;
    }
    getAliases() {
        return this._aliases;
    }
    getDate() {
        return this._fecha;
    }
    getLanguages() {
        return this._idiomas;
    }
    getPlatforms() {
        return this._plataformas;
    }
    getDuration() {
        return this._duracion;
    }
    getCalification() {
        return this._calificacion;
    }
    getPopularity() {
        return this._popularidad;
    }
}
exports.default = VisualNovel;
