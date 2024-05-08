"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NoResultsException_1 = __importDefault(require("../../../../errors/NoResultsException"));
const AnilistAPI_1 = __importDefault(require("../AnilistAPI"));
class BuscadorAnimesTemporada {
    static async buscarAnimesTemporada(anio, temporada) {
        const query = this.ConsultaBuscarMediaPorTemporada(anio, temporada);
        const respuesta = await AnilistAPI_1.default.peticion(query, null);
        const resultados = respuesta.Page.media;
        if (resultados.length <= 0)
            throw new NoResultsException_1.default('No se han encontrado resultados.');
        return resultados;
    }
    static ConsultaBuscarMediaPorTemporada(anio, temporada) {
        return `
            query  {
                Page (perPage: ${this.CANTIDAD_RESULTADOS}) {
                    media (seasonYear: ${anio}, season: ${temporada}, type:ANIME) {
                        ...media
                    }
                }
            }

            fragment media on Media {
                title {
                    romaji
                    english
                    native
                    userPreferred
                }
                siteUrl
            }
        `;
    }
}
BuscadorAnimesTemporada.CANTIDAD_RESULTADOS = 50;
exports.default = BuscadorAnimesTemporada;
