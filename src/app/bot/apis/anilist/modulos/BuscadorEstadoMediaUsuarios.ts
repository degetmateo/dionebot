import Helpers from "../../../Helpers";
import { uRegistrado } from "../../../types";
import AnilistAPI from "../../AnilistAPI";
import { MediaList } from "../types/MediaList";

export default class BuscadorEstadoMediaUsuarios {
    public static async BuscarEstadoMediaUsuarios (usuarios: Array<uRegistrado>, mediaID: number):  Promise<Array<MediaList>> {
        const peticiones = this.ConsultasEstadoMediaUsuarios(usuarios);
        const resultados: Array<MediaList> = new Array<MediaList>();

        for (const peticion of peticiones) {
            const respuesta = await AnilistAPI.peticion(peticion, { mediaID });

            for (const i in respuesta) {
                const mediaList = respuesta[i].mediaList[0];
                mediaList ? resultados.push(mediaList) : null;
            }
        }

        return resultados;
    }

    private static ConsultasEstadoMediaUsuarios (usuarios: Array<uRegistrado>): Array<string> {
        const tandas = Helpers.dividirArreglo(usuarios, AnilistAPI.CANTIDAD_CONSULTAS_POR_PETICION);
        const peticiones = new Array<string>();

        for (const tanda of tandas) {
            peticiones.push(this.ConsultaEstadoMediaUsuarios(tanda));
        }

        return peticiones;
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
                    id
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
}