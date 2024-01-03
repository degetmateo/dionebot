import Helpers from "../../../Helpers";
import AnilistAPI from "../AnilistAPI";
import { MediaList } from "../tipos/MediaList";

export default class BuscadorEstadoMediaUsuarios {
    public static async BuscarEstadoMediaUsuarios (mediaId: string, usersIds: Array<string>):  Promise<Array<MediaList>> {
        const peticiones = this.ConsultasEstadoMediaUsuarios(usersIds);
        const resultados: Array<MediaList> = new Array<MediaList>();

        for (const peticion of peticiones) {
            let respuesta: { [x: string]: { mediaList: any[]; }; };
            
            try {
                respuesta = await AnilistAPI.peticion(peticion, { mediaId });
            } catch (error) {
                const message = error.message.toLowerCase();
                if (message.includes('private user')) continue;
                throw error;   
            }
                
            for (const i in respuesta) {
                const mediaList = respuesta[i].mediaList[0];
                mediaList ? resultados.push(mediaList) : null;
            }
        }

        return resultados;
    }

    private static ConsultasEstadoMediaUsuarios (usuarios: Array<string>): Array<string> {
        const tandas = Helpers.dividirArreglo(usuarios, AnilistAPI.CANTIDAD_CONSULTAS_POR_PETICION);
        const peticiones = new Array<string>();

        for (const tanda of tandas) {
            peticiones.push(this.ConsultaEstadoMediaUsuarios(tanda));
        }

        return peticiones;
    }

    private static ConsultaEstadoMediaUsuarios (usuarios: Array<string>): string {
        return `
            query ($mediaID: Int) {
                ${usuarios.map((userId, i) => `
                    q${i}: Page (perPage: 1) {
                        mediaList(userId: ${userId}, mediaId: $mediaID) {
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