import ErrorSinResultados from "../../../../errores/ErrorSinResultados";
import Helpers from "../../../Helpers";
import { uRegistrado } from "../../../types";
import AnilistAPI from "../AnilistAPI";
import { MediaColeccion } from "../types/Media";

export default class BuscadorListasCompletasUsuarios {
    public static async BuscarListaCompletadosUsuario (id: number): Promise<MediaColeccion> {
        const query = this.ConsultaListaCompletaUsuario(id);
        const respuesta = await AnilistAPI.peticion(query, null);
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

    public static async BuscarListasCompletadosUsuarios (usuarios: Array<uRegistrado>): Promise<Array<MediaColeccion>> {
        const querys = this.ConsultasListasCompletasUsuarios(usuarios);

        let mediaColeccionUsuarios = new Array<MediaColeccion>();

        for (const query of querys) {
            const respuesta = await AnilistAPI.peticion(query, null);
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
        const tandas = Helpers.dividirArreglo(usuarios, AnilistAPI.CANTIDAD_CONSULTAS_POR_PETICION);

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
}