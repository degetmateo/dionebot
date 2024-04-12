import NoResultsException from "../../../../errors/NoResultsException";
import Helpers from "../../../Helpers";
import AnilistAPI from "../AnilistAPI";
import { MediaColeccion } from "../tipos/TiposMedia";

export default class BuscadorListasCompletasUsuarios {
    public static async BuscarListaCompletadosUsuario (id: number): Promise<MediaColeccion> {
        const query = this.ConsultaListaCompletaUsuario(id);
        const respuesta = await AnilistAPI.peticion(query, null);
        if (!respuesta.coleccion) throw new NoResultsException('Ha ocurrido un error al buscar al usuario principal.');
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

    private static async encontrarUsuarioPrivado (usersIds: string[]) {
        for (const userId of usersIds) {
            const id = parseInt(userId);
            const query = this.ConsultaListaCompletaUsuario(id);
            let busqueda;
            try {
                busqueda = await AnilistAPI.peticion(query, null);
            } catch (error) {
                const message = error.message.toLowerCase();
                if (message.includes('private user')) {

                    

                }
            }

        }
    }

    public static async BuscarListasCompletadosUsuarios (usersIds: Array<string>): Promise<Array<MediaColeccion>> {
        const tandas = Helpers.dividirArreglo(usersIds, AnilistAPI.CANTIDAD_CONSULTAS_POR_PETICION);
        const querys = this.ConsultasListasCompletasUsuarios(tandas);

        let mediaColeccionUsuarios = new Array<MediaColeccion>();

        for (let indiceQuerys = 0; indiceQuerys < querys.length; indiceQuerys++) {
            let respuesta;
            
            try {
                respuesta = await AnilistAPI.peticion(querys[indiceQuerys], null);
            } catch (error) {
                if (error.message.toLowerCase().includes('private user')) {
                    console.error(error);
                    const tandaConUsuarioPrivado = tandas[indiceQuerys];
                    this.encontrarUsuarioPrivado(tandaConUsuarioPrivado);
                    continue;
                }

                throw error;
            }

            const coleccionParcial = new Array<MediaColeccion>();

            for (let i = 0; i < usersIds.length; i++) {
                const u = respuesta[`u${i}`];
                if (!u) continue;
                coleccionParcial.push(u);
            }

            mediaColeccionUsuarios = mediaColeccionUsuarios.concat(coleccionParcial);
        }

        return mediaColeccionUsuarios;
    }

    private static ConsultasListasCompletasUsuarios (tandas: string[][]): Array<string> {
        const consultas: Array<string> = new Array<string>();
        
        for (const i of tandas) {
            consultas.push(this.ConsultaListasCompletasUsuarios(i));
        }

        return consultas;
    }

    private static ConsultaListasCompletasUsuarios (usersIds: Array<string>): string {
        return `
            query {                
                ${usersIds.map((id, i) => `
                    u${i}: MediaListCollection (userId: ${id}, type: ANIME, status: COMPLETED) {
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
}