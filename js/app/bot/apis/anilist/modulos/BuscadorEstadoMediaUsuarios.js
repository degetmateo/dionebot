"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = __importDefault(require("../../../Helpers"));
const AnilistAPI_1 = __importDefault(require("../AnilistAPI"));
class BuscadorEstadoMediaUsuarios {
    static async BuscarEstadoMediaUsuarios(mediaId, usersIds) {
        const peticiones = this.ConsultasEstadoMediaUsuarios(usersIds);
        const resultados = new Array();
        for (const peticion of peticiones) {
            let respuesta;
            try {
                respuesta = await AnilistAPI_1.default.peticion(peticion, { mediaId });
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
            query ($mediaId: Int) {
                ${usuarios.map((userId, i) => `
                    q${i}: Page (perPage: 1) {
                        mediaList(userId: ${userId}, mediaId: $mediaId) {
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
