import Anilist, { AnimeEntry, MangaEntry, MediaSearchEntry, MediaFilterTypes, MediaSeason, UserStatsProfile } from 'anilist-node';
import ErrorSinResultados from '../errores/ErrorSinResultados';
import Usuario from './anilist/Usuario';

export default class AnilistAPI {
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
}