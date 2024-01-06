"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorSinResultados_1 = __importDefault(require("../../../../errores/ErrorSinResultados"));
const Helpers_1 = __importDefault(require("../../../Helpers"));
const AnilistAPI_1 = __importDefault(require("../AnilistAPI"));
class BuscadorListasCompletasUsuarios {
    static async BuscarListaCompletadosUsuario(id) {
        const query = this.ConsultaListaCompletaUsuario(id);
        const respuesta = await AnilistAPI_1.default.peticion(query, null);
        if (!respuesta.coleccion)
            throw new ErrorSinResultados_1.default('Ha ocurrido un error al buscar al usuario principal.');
        return respuesta.coleccion;
    }
    static ConsultaListaCompletaUsuario(id) {
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
    static async encontrarUsuarioPrivado(usuarios) {
        for (const usuario of usuarios) {
            const id = parseInt(usuario.anilistId);
            const query = this.ConsultaListaCompletaUsuario(id);
            let busqueda;
            try {
                busqueda = await AnilistAPI_1.default.peticion(query, null);
            }
            catch (error) {
                const message = error.message.toLowerCase();
                if (message.includes('private user')) {
                    const serverID = usuario.serverId;
                    const userID = usuario.discordId;
                }
            }
        }
    }
    static async BuscarListasCompletadosUsuarios(usuarios) {
        const tandas = Helpers_1.default.dividirArreglo(usuarios, AnilistAPI_1.default.CANTIDAD_CONSULTAS_POR_PETICION);
        const querys = this.ConsultasListasCompletasUsuarios(tandas);
        let mediaColeccionUsuarios = new Array();
        for (let indiceQuerys = 0; indiceQuerys < querys.length; indiceQuerys++) {
            let respuesta;
            try {
                respuesta = await AnilistAPI_1.default.peticion(querys[indiceQuerys], null);
            }
            catch (error) {
                if (error.message.toLowerCase().includes('private user')) {
                    console.error(error);
                    const tandaConUsuarioPrivado = tandas[indiceQuerys];
                    this.encontrarUsuarioPrivado(tandaConUsuarioPrivado);
                    continue;
                }
                throw error;
            }
            const coleccionParcial = new Array();
            for (let i = 0; i < usuarios.length; i++) {
                const u = respuesta[`u${i}`];
                if (!u)
                    continue;
                coleccionParcial.push(u);
            }
            mediaColeccionUsuarios = mediaColeccionUsuarios.concat(coleccionParcial);
        }
        return mediaColeccionUsuarios;
    }
    static ConsultasListasCompletasUsuarios(tandas) {
        const consultas = new Array();
        for (const i of tandas) {
            consultas.push(this.ConsultaListasCompletasUsuarios(i));
        }
        return consultas;
    }
    static ConsultaListasCompletasUsuarios(usuarios) {
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
exports.default = BuscadorListasCompletasUsuarios;
