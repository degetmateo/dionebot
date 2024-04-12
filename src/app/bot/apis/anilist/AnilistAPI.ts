import fetch from 'node-fetch';
import { MediaList } from './tipos/MediaList';
import { PeticionAPI } from '../tipos/PeticionAPI';
import * as Types from './TiposAnilist';

import AnilistUser from './modelos/AnilistUser';

import BuscadorMedia from './modulos/BuscadorMedia';
import BuscadorAnimesTemporada from './modulos/BuscadorMediaTemporada';
import BuscadorUsuario from './modulos/BuscadorUsuario';
import BuscadorEstadoMediaUsuarios from './modulos/BuscadorEstadoMediaUsuarios';
import BuscadorListasCompletasUsuarios from './modulos/BuscadorListasCompletasUsuarios';
import Anime from './modelos/media/Anime';
import ScoreCollection from './ScoreCollection';
import { MediaCollection } from './types';
import Manga from './modelos/media/Manga';
import NoResultsException from '../../../errors/NoResultsException';
import TooManyRequestsException from '../../../errors/TooManyRequestsException';

export default class AnilistAPI {
    private static readonly API_URL: string = "https://graphql.anilist.co";
    public static readonly RESULTADOS_PAGINA: number = 10;
    public static readonly CANTIDAD_CONSULTAS_POR_PETICION: number = 10;

    private static readonly URL_AUTORIZACION: string = 'https://anilist.co/api/v2/oauth/token';

    public static async fetchAnimeById (id: number): Promise<Anime> {
        return new Anime (await BuscadorMedia.BuscarMediaPorID(id, 'ANIME'));
    }

    public static async fetchAnimeByName (name: string): Promise<Array<Anime>> {
        return (await BuscadorMedia.BuscarMediaPorNombre(name, 'ANIME')).map(r => new Anime(r));
    }

    public static async fetchMangaById (id: number): Promise<Manga> {
        return new Manga(await BuscadorMedia.BuscarMediaPorID(id, 'MANGA'));
    }

    public static async fetchMangaByName (name: string): Promise<Array<Manga>> {
        return (await BuscadorMedia.BuscarMediaPorNombre(name, 'MANGA')).map(r => new Manga(r));
    }

    public static async fetchUserById (id: number): Promise<AnilistUser> {
        const result = await BuscadorUsuario.BuscarUsuario(id);
        return result ? new AnilistUser(result) : null;
    }

    public static async fetchUserByName (name: string): Promise<AnilistUser> {
        return new AnilistUser(await BuscadorUsuario.BuscarUsuario(name));
    }

    public static async fetchUsersScores (mediaId: string, usersIds: Array<string>) {
        return new ScoreCollection(await BuscadorEstadoMediaUsuarios.BuscarEstadoMediaUsuarios(mediaId, usersIds));
    }

    public static async fetchUserPlannedAnimes (userId: string): Promise<MediaCollection> {
        const request = `
            query {                
                MediaListCollection (userId: ${userId}, type: ANIME, status: PLANNING) {
                    ...mediaListCollection
                }
            }

            fragment mediaListCollection on MediaListCollection {
                lists {
                    entries {
                        mediaId
                    }
                }
            }
        `;

        const res = await AnilistAPI.peticion(request, {});
        return res.MediaListCollection as MediaCollection;
    }

    public static async fetchUsersCompletedLists (user: AnilistUser, usersIds: Array<string>) {
        const mediaUsuario: Types.MediaColeccion = await BuscadorListasCompletasUsuarios.BuscarListaCompletadosUsuario(user.getId());
        const mediaUsuarios: Array<Types.MediaColeccion> = await BuscadorListasCompletasUsuarios.BuscarListasCompletadosUsuarios(usersIds);
        return { user: mediaUsuario, users: mediaUsuarios };
    }

    public static async fetchSeasonAnimes (year: number, season: Types.MediaSeason): Promise<Types.MediaResults> {
        return await BuscadorAnimesTemporada.buscarAnimesTemporada(year, season);
    }

    public static async buscarUsuario (criterio: number | string): Promise<Types.Usuario> {
        return await BuscadorUsuario.BuscarUsuario(criterio);
    }

    public static async buscarEstadoMediaUsuarios (mediaId: string, usersIds: Array<string>):  Promise<Array<MediaList>> {
        return await BuscadorEstadoMediaUsuarios.BuscarEstadoMediaUsuarios(mediaId, usersIds);
    }


    public static async peticion (query: string, variables: any): Promise<any | null> {
        const opciones: PeticionAPI = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
            body: JSON.stringify({ query, variables })
        }
        
        const data = await fetch(this.API_URL, opciones);
        if (!data) throw new NoResultsException('No se han encontrado resultados.');

        const res: any = await data.json();
        
        if (res.errors) {
            const e = res.errors[0];
            const message = e.message.toLowerCase();

            if (message.includes('not found')) {
                throw new NoResultsException('No se han encontrado resultados.');
            }

            if (message.includes('max query complexity')) {
                console.error(e);
                throw new TooManyRequestsException('Se han realizado demasiadas peticiones al servidor. Intentalo de nuevo mas tarde.');
            }

            throw new Error(message);
        }

        if (!res || !res.data) throw new NoResultsException('No se han encontrado resultados.');
        return res.data;
    }

    public static async obtenerTokenDeAcceso (codigo: string) {
        const opciones: PeticionAPI = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
          body: JSON.stringify({
            'grant_type': 'authorization_code',
            'client_id': process.env.CLIENTE_ANILIST_ID,
            'client_secret': process.env.CLIENTE_ANILIST_TOKEN,
            'redirect_uri': process.env.URL_REDIRECCION,
            'code': codigo,
          })
        };
        
        fetch(this.URL_AUTORIZACION, opciones)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error(err));
    }
}