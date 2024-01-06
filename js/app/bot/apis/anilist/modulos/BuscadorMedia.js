"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorSinResultados_1 = __importDefault(require("../../../../errores/ErrorSinResultados"));
const AnilistAPI_1 = __importDefault(require("../AnilistAPI"));
class BuscadorMedia {
    static async BuscarMediaPorID(id, tipo) {
        const query = this.ConsultaBuscarMediaPorID(id, tipo);
        const respuesta = await AnilistAPI_1.default.peticion(query, null);
        return respuesta.Media;
    }
    static async BuscarMediaPorNombre(criterio, tipo) {
        const query = this.ConsultaBuscarMediaPorNombre(criterio, tipo);
        const respuesta = await AnilistAPI_1.default.peticion(query, null);
        const resultados = respuesta.Page.media;
        if (resultados.length <= 0)
            throw new ErrorSinResultados_1.default('No se han encontrado resultados.');
        return resultados;
    }
    static ConsultaBuscarMediaPorNombre(criterio, tipo) {
        return `
            query  {
                Page (perPage: ${AnilistAPI_1.default.RESULTADOS_PAGINA}) {
                    media (search: "${criterio}", type: ${tipo}) {
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
                type
                format
                status
                description
                startDate {
                    year
                    month
                    day
                }
                endDate {
                    year
                    month
                    day
                }
                season
                episodes
                duration
                chapters
                volumes
                source
                trailer {
                    id
                    site
                    thumbnail
                }
                updatedAt
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
    static ConsultaBuscarMediaPorID(id, tipo) {
        return `
            query  {
                Media (id: ${id}, type: ${tipo}) {
                    id idMal
                    title {
                        romaji
                        english
                        native
                        userPreferred
                    }
                    type
                    format
                    status
                    description
                    startDate {
                        year
                        month
                        day
                    }
                    endDate {
                        year
                        month
                        day
                    }
                    season
                    episodes
                    duration
                    chapters
                    volumes
                    source
                    trailer {
                        id
                        site
                        thumbnail
                    }
                    updatedAt
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
            }
        `;
    }
}
exports.default = BuscadorMedia;
