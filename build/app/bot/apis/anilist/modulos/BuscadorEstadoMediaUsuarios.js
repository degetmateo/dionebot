"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = __importDefault(require("../../../Helpers"));
const AnilistAPI_1 = __importDefault(require("../AnilistAPI"));
class BuscadorEstadoMediaUsuarios {
    static async BuscarEstadoMediaUsuarios(usuarios, mediaID) {
        const peticiones = this.ConsultasEstadoMediaUsuarios(usuarios);
        const resultados = new Array();
        for (const peticion of peticiones) {
            let respuesta;
            try {
                respuesta = await AnilistAPI_1.default.peticion(peticion, { mediaID });
            }
            catch (error) {
                const message = error.message.toLowerCase();
                if (message.includes('private user'))
                    continue;
                throw error;
            }
            for (const i in respuesta) {
                const mediaList = respuesta[i].mediaList[0];
                mediaList ? resultados.push(mediaList) : null;
            }
        }
        return resultados;
    }
    static ConsultasEstadoMediaUsuarios(usuarios) {
        const tandas = Helpers_1.default.dividirArreglo(usuarios, AnilistAPI_1.default.CANTIDAD_CONSULTAS_POR_PETICION);
        const peticiones = new Array();
        for (const tanda of tandas) {
            peticiones.push(this.ConsultaEstadoMediaUsuarios(tanda));
        }
        return peticiones;
    }
    static ConsultaEstadoMediaUsuarios(usuarios) {
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
exports.default = BuscadorEstadoMediaUsuarios;
