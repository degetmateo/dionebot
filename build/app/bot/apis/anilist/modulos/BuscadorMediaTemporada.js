"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorSinResultados_1 = __importDefault(require("../../../../errores/ErrorSinResultados"));
const AnilistAPI_1 = __importDefault(require("../AnilistAPI"));
class BuscadorAnimesTemporada {
    static async buscarAnimesTemporada(anio, temporada) {
        const query = this.ConsultaBuscarMediaPorTemporada(anio, temporada);
        const respuesta = await AnilistAPI_1.default.peticion(query, null);
        const resultados = respuesta.Page.media;
        if (resultados.length <= 0)
            throw new ErrorSinResultados_1.default('No se han encontrado resultados.');
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
                id
                idMal
                title {
                    romaji
                    english
                    native
                    userPreferred
                }
                format
                status
                description
                episodes
                duration
                source
                trailer {
                    id
                    site
                    thumbnail
                }
                coverImage {
                    extraLarge
                    large
                    medium
                    color
                }
                bannerImage
                genres
                synonyms
                averageScore
                meanScore
                popularity
                favourites
                studios {
                    edges {
                        node {
                            id
                            name
                        }
                    }
                }
                siteUrl
            }
        `;
    }
}
exports.default = BuscadorAnimesTemporada;
BuscadorAnimesTemporada.CANTIDAD_RESULTADOS = 50;
