import NoResultsException from "../../../../errors/NoResultsException";
import AnilistAPI from "../AnilistAPI";
import { MediaSeason, MediaResults } from "../tipos/TiposMedia";

export default class BuscadorAnimesTemporada {
    public static readonly CANTIDAD_RESULTADOS: number = 50;

    public static async buscarAnimesTemporada (anio: number, temporada: MediaSeason): Promise<MediaResults> {
        const query: string = this.ConsultaBuscarMediaPorTemporada(anio, temporada);
        const respuesta = await AnilistAPI.peticion(query, null);
        const resultados = respuesta.Page.media as MediaResults;
        if (resultados.length <= 0) throw new NoResultsException('No se han encontrado resultados.');
        return resultados;
    }

    private static ConsultaBuscarMediaPorTemporada (anio: number, temporada: MediaSeason): string {
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
        `
    }
}