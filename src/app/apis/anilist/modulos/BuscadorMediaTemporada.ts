import ErrorSinResultados from "../../../errores/ErrorSinResultados";
import AnilistAPI from "../../AnilistAPI";
import { MediaTemporada, ResultadosMedia } from "../types/Media";

export default class BuscadorAnimesTemporada {
    public static readonly CANTIDAD_RESULTADOS: number = 50;

    public static async buscarAnimesTemporada (anio: number, temporada: MediaTemporada): Promise<ResultadosMedia> {
        const query: string = this.ConsultaBuscarMediaPorTemporada(anio, temporada);
        const respuesta = await AnilistAPI.peticion(query, null);
        const resultados = respuesta.Page.media as ResultadosMedia;
        if (resultados.length <= 0) throw new ErrorSinResultados('No se han encontrado resultados.');
        return resultados;
    }

    private static ConsultaBuscarMediaPorTemporada (anio: number, temporada: MediaTemporada): string {
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
        `
    }
}