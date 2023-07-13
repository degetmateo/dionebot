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
import Helpers from '../helpers';

export default class AnilistAPI extends API {
    private static readonly API_URL: string = "https://graphql.anilist.co";
    private static readonly RESULTADOS_PAGINA: number = 10;

    public static async buscarAnime (criterio: string): Promise<ResultadosMedia> {
        const query = this.ConsultaBuscarMediaPorNombre(criterio, 'ANIME');
        const respuesta = await this.peticion(query, null);
        const resultados = respuesta.Page.media as ResultadosMedia;
        if (resultados.length <= 0) throw new ErrorSinResultados('No se han encontrado resultados.');
        return resultados;
    }

    public static async buscarManga (criterio: string): Promise<ResultadosMedia> {
        const query = this.ConsultaBuscarMediaPorNombre(criterio, 'MANGA');
        const respuesta = await this.peticion(query, null);
        const resultados = respuesta.Page.media as ResultadosMedia;
        if (resultados.length <= 0) throw new ErrorSinResultados('No se han encontrado resultados.');
        return resultados;
    }

    private static ConsultaBuscarMediaPorNombre (criterio: string, tipo: MediaTipo): string {
        return `
            query  {
                Page (perPage: ${this.RESULTADOS_PAGINA}) {
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

    public static async obtenerAnimeID (id: number): Promise<Media> {
        const query = this.ConsultaBuscarMediaPorID(id, 'ANIME');
        const respuesta = await this.peticion(query, null);
        return respuesta.Media as Media;
    }

    public static async obtenerMangaID (id: number): Promise<Media> {
        const query = this.ConsultaBuscarMediaPorID(id, 'MANGA');
        const respuesta = await this.peticion(query, null);
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
        const respuesta = await this.peticion(query, null);
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
        `
    }

    public static async obtenerUsuario (criterio: number | string): Promise<Usuario> {
        const query = this.ConsultaBuscarUsuario(criterio);
        const respuesta = await this.peticion(query, null);
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
        const query: string = this.ConsultaEstadoMediaUsuarios(usuarios);
        const respuesta = await this.peticion(query, { mediaID });
        const resultados: Array<MediaList> = new Array<MediaList>();
        
        for (const i in respuesta) {
            const mediaList = respuesta[i].mediaList[0];
            mediaList ? resultados.push(mediaList) : null;
        }

        return resultados;
    }

    private static ConsultaEstadoMediaUsuarios (usuarios: Array<uRegistrado>): string {
        return `
            query ($mediaID: Int) {
                ${usuarios.map((u, i) => `
                    q${i}: Page (perPage: 1) {
                        mediaList(userId: ${u.anilistId}, mediaId: $mediaID) {
                            ...mediaList
                        }
                    }
                `).join('\n')}
            }
            
            fragment mediaList on MediaList {
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
        `;
    } 

    public static async obtenerListasCompletasUsuarios (usuario: UsuarioAnilist, usuarios: Array<uRegistrado>): Promise<{ user: MediaColeccion, users: Array<MediaColeccion> }> {
        const mediaUsuario: MediaColeccion = await this.obtenerListaCompletadosUsuario(usuario.obtenerID());
        const mediaUsuarios: Array<MediaColeccion> = await this.obtenerListaCompletadosUsuarios(usuarios);
        return { user: mediaUsuario, users: mediaUsuarios };
    }

    private static async obtenerListaCompletadosUsuario (id: number): Promise<MediaColeccion> {
        const query = this.ConsultaListaCompletaUsuario(id);
        const respuesta = await this.peticion(query, null);
        if (!respuesta.coleccion) throw new ErrorSinResultados('Ha ocurrido un error al buscar al usuario principal.');
        return respuesta.coleccion as MediaColeccion;
    }

    private static ConsultaListaCompletaUsuario (id: number): string {
        return `
            query {
                coleccion: MediaListCollection (userId: ${id}, type: ANIME, status: COMPLETED) {
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
            }
        `;
    }

    private static async obtenerListaCompletadosUsuarios (usuarios: Array<uRegistrado>): Promise<Array<MediaColeccion>> {
        const querys = this.ConsultasListasCompletasUsuarios(usuarios);

        let mediaColeccionUsuarios = new Array<MediaColeccion>();

        for (const query of querys) {
            const respuesta = await this.peticion(query, null);
            const coleccionParcial = new Array<MediaColeccion>();

            for (let i = 0; i < usuarios.length; i++) {
                const u = respuesta[`u${i}`];
                if (!u) continue;
                coleccionParcial.push(u);
            }

            mediaColeccionUsuarios = mediaColeccionUsuarios.concat(coleccionParcial);
        }

        return mediaColeccionUsuarios;
    }

    private static ConsultasListasCompletasUsuarios (usuarios: Array<uRegistrado>): Array<string> {
        const consultas: Array<string> = new Array<string>();
        const tandas = Helpers.dividirArreglo(usuarios, 5);

        for (const i of tandas) {
            consultas.push(this.ConsultaListasCompletasUsuarios(i));
        }

        return consultas;
    }

    private static ConsultaListasCompletasUsuarios (usuarios: Array<uRegistrado>): string {
        return `
            query {                
                ${usuarios.map((u, i) => `
                    u${i}: MediaListCollection (userId: ${u.anilistId}, type: ANIME, status: COMPLETED) {
                        ...mediaListCollection
                    }
                `).join('\n')}
            }

            fragment mediaListCollection on MediaListCollection {
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
        `;
    }

    private static async peticion (query: string, variables: any): Promise<any | null> {
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