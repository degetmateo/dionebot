import AnilistAPI from "../../AnilistAPI";
import { Usuario } from "../types/Usuario";

export default class BuscadorUsuario {
    public static async BuscarUsuario (criterio: number | string): Promise<Usuario> {
        const query = this.ConsultaBuscarUsuario(criterio);
        const respuesta = await AnilistAPI.peticion(query, null);
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
}