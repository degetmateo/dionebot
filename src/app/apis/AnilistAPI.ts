import Anilist, { AnimeEntry, MangaEntry, MediaSearchEntry, MediaFilterTypes, MediaSeason, UserStatsProfile } from 'anilist-node';
import ErrorSinResultados from '../errores/ErrorSinResultados';
import Usuario from './anilist/Usuario';

export default class AnilistAPI {
    private static readonly API_URL: string = "https://graphql.anilist.co";
    public static readonly API: Anilist = new Anilist();
    private static readonly RESULTADOS_PAGINA: number = 10;

    public static async buscarAnime (criterio: string): Promise<MediaSearchEntry> {
        return await this.API.searchEntry.anime(criterio, undefined, 1, AnilistAPI.RESULTADOS_PAGINA);
    }

    public static async buscarManga (criterio: string): Promise<MediaSearchEntry> {
        return await this.API.searchEntry.manga(criterio, undefined, 1, AnilistAPI.RESULTADOS_PAGINA);
    }

    public static async obtenerAnimeID (id: number): Promise<AnimeEntry> {
        try {
            return await this.API.media.anime(id);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.toLowerCase().includes('not found')) {
                    throw new ErrorSinResultados('No se han encontrado resultados.');
                }
            }

            throw error;
        }
    }

    public static async obtenerMangaID (id: number): Promise<MangaEntry> {
        try {
            return await this.API.media.manga(id);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.toLowerCase().includes('not found')) {
                    throw new ErrorSinResultados('No se han encontrado resultados.');
                }
            }

            throw error;
        }
    }

    public static async obtenerAnimesTemporada (anio: number, temporada: string): Promise<MediaSearchEntry> {
        const filtros: MediaFilterTypes = { seasonYear: anio, season: temporada as MediaSeason };
        const resultados: MediaSearchEntry = await this.API.searchEntry.anime(undefined, filtros, undefined, 50);
        if (!resultados.media || resultados.media.length <= 0) throw new ErrorSinResultados('No se han encontrado resultados.');
        return resultados;
    }

    public static async obtenerUsuario (criterio: number | string): Promise<Usuario> {
        try {
            return new Usuario(await this.API.user.all(criterio));
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.toLowerCase().includes('not found')) {
                    throw new ErrorSinResultados('No se han encontrado resultados.');
                }
            }

            throw error;
        }
    }

    public static obtenerListaAnimeUsuario = async (userID: string | number, mediaID: string | number ): Promise<any> => {
        try {
            const variables = { userID, mediaID };
            const response = await this.request(QUERY_MEDIA, variables);
            return (response == null) ? null : response;   
        } catch (error) {
            throw error;
        }
    }

    public static async request(query: string, variables: any): Promise<any> {
        const opciones = {
            method: 'POST',
            
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            
            body: JSON.stringify({ query, variables })
        };

        const data = await fetch(this.API_URL, opciones);

        if (!data) return null;

        const res = await data.json();
        
        if (!res || !res.data) return null;

        return res.data;
    }
}

const QUERY_MEDIA = `
    query ($userID: Int, $mediaID: Int) {
        MediaList(userId: $userID, mediaId: $mediaID) {
            id
            mediaId
            status
            score(format: POINT_100)
            progress
            repeat
        }
    }
`;

const BUSQUEDA_LISTA_ANIMES = `
    query ($id: String) {
        animeList: MediaListCollection(userId: $id, type: ANIME) {
            lists {
                entries {
                    mediaId,
                    score(format: POINT_100)
                }
                status
            }
        }
    }
`;