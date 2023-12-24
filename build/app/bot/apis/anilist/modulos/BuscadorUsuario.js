"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnilistAPI_1 = __importDefault(require("../AnilistAPI"));
class BuscadorUsuario {
    static async BuscarUsuario(criterio) {
        const query = this.ConsultaBuscarUsuario(criterio);
        const respuesta = await AnilistAPI_1.default.peticion(query, null);
        return respuesta.User;
    }
    static ConsultaBuscarUsuario(criterio) {
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
        `;
    }
}
exports.default = BuscadorUsuario;
