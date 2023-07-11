import fetch from 'node-fetch';

import Anilist, { AnimeEntry, MangaEntry, MediaSearchEntry, MediaFilterTypes, MediaSeason } from 'anilist-node';
import { MediaList } from './anilist/types/MediaList';
import ErrorSinResultados from '../errores/ErrorSinResultados';
import Usuario from './anilist/Usuario';
import { PeticionAPI } from '../tipos/PeticionAPI';
import API from './API';
import { uRegistrado } from '../types';

export default class AnilistAPI extends API {
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

    public static readonly PETICION_USUARIO_TIENE_MEDIA: string = `
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

    public static async obtenerMediaListUsuario (userID: number, mediaID: number): Promise<MediaList> {
        const response = await this.peticion(this.PETICION_USUARIO_TIENE_MEDIA, { userID, mediaID });
        return response.MediaList as MediaList;   
    }

    public static async obtenerEstadoMediaUsuarios (usuarios: Array<uRegistrado>, mediaID: number):  Promise<Array<MediaList>> {
        const PETICION_ESTADO_MEDIA_USUARIOS: string = `
                query { ${usuarios.map((u, i) => `
                        q${i}: Page (perPage: 1) {
                            mediaList(userId: ${u.anilistId}, mediaId: ${mediaID}) {
                                user {
                                    name
                                }
                                id
                                mediaId
                                status
                                score(format: POINT_100)
                                progress
                                repeat
                            }
                        }
                `).join('\n')} }`;

        const respuesta: any = await this.peticion(PETICION_ESTADO_MEDIA_USUARIOS, {});
        const resultados: Array<MediaList> = new Array<MediaList>();
        
        for (const i in respuesta) {
            const mediaList = respuesta[i].mediaList[0];
            mediaList ? resultados.push(mediaList) : null;
        }

        return resultados;
    }

    private static async peticion (query: string, variables: any | undefined): Promise<any | null> {
        if (!variables) variables = {};

        const opciones: PeticionAPI = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
            body: JSON.stringify({ query, variables })
        }

        const data = await fetch(this.API_URL, opciones);

        if (!data) throw new ErrorSinResultados('No se han encontrado resultados.');

        const res = await data.json();
        
        if (res.errors) {
            const e = res.errors[0];

            if (e instanceof Error) {
                const message = e.message.toLowerCase();

                if (message.includes('not found')) {
                    throw new ErrorSinResultados('QUERY: No se han encontrado resultados.');
                }
            }

            throw e;
        }

        if (!res || !res.data) throw new ErrorSinResultados('No se han encontrado resultados.');

        return res.data;
    }

}