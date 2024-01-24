
import ErrorSinResultados from "../../../../errores/ErrorSinResultados";
import AnilistAPI from "../AnilistAPI";
import { Media, MediaTipo, MediaResults } from "../tipos/TiposMedia";

export default class BuscadorMedia {
    public static async BuscarMediaPorID (id: number, tipo: MediaTipo): Promise<Media> {
        const query = this.ConsultaBuscarMediaPorID(id, tipo);
        const respuesta = await AnilistAPI.peticion(query, null);
        return respuesta.Media as Media;
    }

    public static async BuscarMediaPorNombre (criterio: string, tipo: MediaTipo): Promise<MediaResults> {
        const query = this.ConsultaBuscarMediaPorNombre(criterio, tipo);
        const respuesta = await AnilistAPI.peticion(query, null);
        const resultados = respuesta.Page.media as MediaResults;
        if (resultados.length <= 0) throw new ErrorSinResultados('No se han encontrado resultados.');
        return resultados;
    }

    private static ConsultaBuscarMediaPorNombre (criterio: string, tipo: MediaTipo): string {
        return `
            query  {
                Page (perPage: ${AnilistAPI.RESULTADOS_PAGINA}) {
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

    private static ConsultaBuscarMediaPorID (id: number, tipo: MediaTipo) {
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
        `
    }
}