import fetch from 'node-fetch';
import { MediaList } from './anilist/types/MediaList';
import ErrorSinResultados from '../errores/ErrorSinResultados';
import { PeticionAPI } from './types/PeticionAPI';
import API from './API';
import { uRegistrado } from '../types';
import { Media, MediaColeccion, MediaTemporada, MediaTipo, ResultadosMedia } from './anilist/types/Media';
import { Usuario } from './anilist/types/Usuario';
import UsuarioAnilist from './anilist/UsuarioAnilist';
import ErrorDemasiadasPeticiones from '../errores/ErrorDemasiadasPeticiones';

export default class AnilistAPI extends API {
    private static readonly API_URL: string = "https://graphql.anilist.co";
    private static readonly RESULTADOS_PAGINA: number = 10;

    public static async buscarAnime (criterio: string): Promise<ResultadosMedia> {
        const query = this.ConsultaBuscarMediaPorNombre(criterio, 'ANIME');
        const respuesta = await this.peticion(query);
        const resultados = respuesta.Page.media as ResultadosMedia;
        if (resultados.length <= 0) throw new ErrorSinResultados('No se han encontrado resultados.');
        return resultados;
    }

    public static async buscarManga (criterio: string): Promise<ResultadosMedia> {
        const query = this.ConsultaBuscarMediaPorNombre(criterio, 'MANGA');
        const respuesta = await this.peticion(query);
        const resultados = respuesta.Page.media as ResultadosMedia;
        if (resultados.length <= 0) throw new ErrorSinResultados('No se han encontrado resultados.');
        return resultados;
    }

    private static ConsultaBuscarMediaPorNombre (criterio: string, tipo: MediaTipo): string {
        return `query  {
            Page (perPage: ${this.RESULTADOS_PAGINA}) {
                media (search: "${criterio}", type: ${tipo}) {
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
            }    
        }`;
    }

    public static async obtenerAnimeID (id: number): Promise<Media> {
        const query = this.ConsultaBuscarMediaPorID(id, 'ANIME');
        const respuesta = await this.peticion(query);
        return respuesta.Media as Media;
    }

    public static async obtenerMangaID (id: number): Promise<Media> {
        const query = this.ConsultaBuscarMediaPorID(id, 'MANGA');
        const respuesta = await this.peticion(query);
        return respuesta.Media as Media;
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

    public static async obtenerAnimesTemporada (anio: number, temporada: MediaTemporada): Promise<ResultadosMedia> {
        const query: string = this.ConsultaBuscarMediaPorTemporada(anio, temporada);
        const respuesta = await this.peticion(query);
        const resultados = respuesta.Page.media as ResultadosMedia;
        if (resultados.length <= 0) throw new ErrorSinResultados('No se han encontrado resultados.');
        return resultados;
    }

    private static ConsultaBuscarMediaPorTemporada (anio: number, temporada: MediaTemporada): string {
        const RESULTADOS_POR_PAGINA: number = 50;

        return `
            query  {
                Page (perPage: ${RESULTADOS_POR_PAGINA}) {
                    media (seasonYear: ${anio}, season: ${temporada}, type:ANIME) {
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
            } 
        `
    }

    public static async obtenerUsuario (criterio: number | string): Promise<Usuario> {
        const query = this.ConsultaBuscarUsuario(criterio);
        const respuesta = await this.peticion(query);
        return respuesta.User as Usuario;
    }

    private static ConsultaBuscarUsuario (criterio: number | string): string {
        const filtro = typeof criterio === 'number' ? `id: ${criterio}` : `name: "${criterio}"`;

        return `
            query  {
                User (${filtro}) {
                    id
                    name
                    about
                    avatar {
                      large
                      medium
                    }
                    bannerImage
                    options {
                      titleLanguage
                      profileColor
                    }	
                    mediaListOptions {
                      scoreFormat
                      rowOrder
                      useLegacyLists
                      sharedTheme
                      sharedThemeEnabled
                    }
                    
                    favourites {
                      anime {
                        edges {
                          node {
                            id
                            title {
                              romaji
                              english
                              native
                              userPreferred
                            }
                          }
                        }
                      }
                      manga {
                        edges {
                          node {
                            id
                            title {
                              romaji
                              english
                              native
                              userPreferred
                            }
                          }
                        }
                      }
                      characters {
                        edges {
                          node {
                            id
                            name {
                              first
                              middle
                              last
                              full
                              native
                              userPreferred
                            }
                          }
                        }
                      }
                    }
                    statistics {
                      anime {
                        count
                        meanScore
                        standardDeviation
                        minutesWatched
                        episodesWatched
                        genres {
                          genre
                          count
                        }
                      }
                      manga {
                        count
                        meanScore
                        standardDeviation
                        chaptersRead
                        volumesRead
                        genres {
                          genre
                          count
                        }
                      }
                    }
                    siteUrl
                    createdAt
                }
            }
        `
    }

    public static async obtenerEstadoMediaUsuarios (usuarios: Array<uRegistrado>, mediaID: number):  Promise<Array<MediaList>> {
        const query: string = this.ConsultaEstadoMediaUsuarios(usuarios, mediaID);
        const respuesta = await this.peticion(query);
        const resultados: Array<MediaList> = new Array<MediaList>();
        
        for (const i in respuesta) {
            const mediaList = respuesta[i].mediaList[0];
            mediaList ? resultados.push(mediaList) : null;
        }

        return resultados;
    }

    private static ConsultaEstadoMediaUsuarios (usuarios: Array<uRegistrado>, mediaID: number): string {
        return `
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
    } 

    public static async obtenerListasCompletasUsuarios (usuarioPrincipal: UsuarioAnilist, usuarios: Array<uRegistrado>): Promise<{ user: MediaColeccion, users: Array<MediaColeccion> }> {
        const query = this.ConsultaListasCompletasUsuarios(usuarioPrincipal.obtenerID(), usuarios);
        const respuesta = await this.peticion(query);

        const mediaColeccion = new Array<MediaColeccion>();

        for (let i = 0; i < usuarios.length; i++) {
            const u = respuesta[`u${i}`];
            if (!u) continue;
            mediaColeccion.push(u);
        }

        return { user: respuesta.user as MediaColeccion, users: mediaColeccion };
    }

    private static ConsultaListasCompletasUsuarios (userID: number, usuarios: Array<uRegistrado>): string {
        return `
            query  {
                user: MediaListCollection (userId: ${userID}, type: ANIME, status: COMPLETED) {
                    user {
                        id
                        name
                    }
                    lists {
                        status,
                        entries {
                            mediaId
                            score(format: POINT_100)
                        }
                    }
                }
            
                ${usuarios.map((u, i) => `
                    u${i}: MediaListCollection (userId: ${u.anilistId}, type: ANIME, status: COMPLETED) {
                        user {
                            id
                            name
                        }
                        lists {
                            status,
                            entries {
                                mediaId
                                score(format: POINT_100)
                            }
                        }
                    }
                `).join('\n')}
            }
        `;
    }

    private static async peticion (query: string): Promise<any | null> {
        const opciones: PeticionAPI = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', },
            body: JSON.stringify({ query })
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

            const message = e.message.toLowerCase();

            if (message.includes('max query complexity')) {
                console.error(e);
                throw new ErrorDemasiadasPeticiones('Se han realizado demasiadas peticiones al servidor. Intentalo de nuevo mas tarde.');
            }

            throw new Error(message);
        }

        if (!res || !res.data) throw new ErrorSinResultados('No se han encontrado resultados.');

        return res.data;
    }

}