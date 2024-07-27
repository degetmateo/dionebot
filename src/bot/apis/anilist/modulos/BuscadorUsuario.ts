import AnilistAPI from "../AnilistAPI";
import { Usuario } from "../tipos/Usuario";

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
                      profileColor
                    }
                    statistics {
                      anime {
                        count
                        meanScore
                        minutesWatched
                        episodesWatched
                        genres {
                          genre
                          count
                          meanScore
                        }
                      }
                      manga {
                        count
                        meanScore
                        chaptersRead
                        volumesRead
                        genres {
                          genre
                          count
                          meanScore
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