"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Afinidad = void 0;
const Usuario_1 = require("../modelos/Usuario");
const Usuarios_1 = require("./Usuarios");
class Afinidad {
    static FiltrarCompletados(listas) {
        return listas.find(lista => lista.status == "COMPLETED");
    }
    static GetSharedMedia(l1, l2) {
        const sharedMedia = [];
        for (let i = 0; i < l1.length; i++) {
            const mediaID_1 = l1[i].mediaId;
            const mediaScore_1 = l1[i].score;
            if (mediaScore_1 == 0) {
                continue;
            }
            const media_2 = l2.find(e => e.mediaId == mediaID_1);
            if (!media_2 || media_2.score == 0) {
                continue;
            }
            sharedMedia.push({ id: mediaID_1, scoreA: mediaScore_1, scoreB: media_2.score });
        }
        return sharedMedia;
    }
    /**
     * Método que calcula el coeficiente de correlación personal entre dos usuarios.
     * Basado en:
     * https://en.wikipedia.org/wiki/Pearson_correlation_coefficient
     * https://github.com/AlexanderColen/Annie-May-Discord-Bot/blob/default/Annie/Utility/AffinityUtility.cs
     * @param sharedMedia Arreglo con la media compartida por los dos usuarios.
     * @returns Porcentaje de la afinidad.
     */
    static CalcularAfinidad(sharedMedia) {
        const scoresA = sharedMedia.map(media => media.scoreA);
        const scoresB = sharedMedia.map(media => media.scoreB);
        const ma = this.CalcularPromedioLista(scoresA);
        const mb = this.CalcularPromedioLista(scoresB);
        const am = scoresA.map(score => score - ma);
        const bm = scoresB.map(score => score - mb);
        const sa = am.map(x => Math.pow(x, 2));
        const sb = bm.map(x => Math.pow(x, 2));
        const numerador = this.SumarLista(this.zip(am, bm).map(tupla => tupla[0] * tupla[1]));
        const denominador = Math.sqrt(this.SumarLista(sa) * this.SumarLista(sb));
        return (denominador == 0 ? 0 : numerador / denominador) * 100;
    }
    static OrdenarAfinidades(afinidades) {
        return afinidades.sort((a, b) => {
            if (a.afinidad < b.afinidad) {
                return 1;
            }
            if (a.afinidad > b.afinidad) {
                return -1;
            }
            return 0;
        });
    }
    static SumarLista(lista) {
        let suma = 0;
        for (let i = 0; i < lista.length; i++) {
            suma += lista[i];
        }
        return suma;
    }
    static CalcularPromedioLista(lista) {
        return this.SumarLista(lista) / lista.length;
    }
}
exports.Afinidad = Afinidad;
_a = Afinidad;
Afinidad.GetAfinidadUsuario = (user_1, uRegistrados) => __awaiter(void 0, void 0, void 0, function* () {
    const listaUsuario_1 = yield Usuarios_1.Usuarios.GetEntradas(user_1.getNombre());
    const serverID = uRegistrados[0].serverId;
    if (!listaUsuario_1) {
        return {
            error: true,
            message: "No se han encontrados entradas de ese usuario.",
            afinidades: []
        };
    }
    let animesUsuario_1 = _a.FiltrarCompletados(listaUsuario_1.animeList.lists);
    animesUsuario_1 = animesUsuario_1.entries;
    if (!animesUsuario_1) {
        return {
            error: true,
            message: "",
            afinidades: []
        };
    }
    const afinidades = [];
    let i = 0;
    while (i < uRegistrados.length) {
        if (uRegistrados[i].anilistUsername == user_1.getNombre()) {
            i++;
            continue;
        }
        if (!uRegistrados[i].anilistUsername) {
            continue;
        }
        const responseUser = yield Usuarios_1.Usuarios.BuscarUsuario(serverID, uRegistrados[i].anilistUsername);
        if (!responseUser) {
            return {
                error: true,
                message: "",
                afinidades: []
            };
        }
        const user_2 = new Usuario_1.Usuario(responseUser);
        const animesUsuario_2 = yield _a.GetCompletedMedia(user_2);
        if (!animesUsuario_2) {
            return {
                error: true,
                message: "",
                afinidades: []
            };
        }
        const sharedMedia = _a.GetSharedMedia(animesUsuario_1, animesUsuario_2);
        const resultado = _a.CalcularAfinidad(sharedMedia);
        afinidades.push({ username: user_2 == null ? "" : user_2.getNombre(), afinidad: parseFloat(resultado.toFixed(2)) });
        i++;
    }
    return {
        error: false,
        message: "",
        afinidades: _a.OrdenarAfinidades(afinidades)
    };
});
Afinidad.GetCompletedMedia = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const listaUsuario_2 = yield Usuarios_1.Usuarios.GetEntradas(user.getNombre());
    let animesUsuario_2 = _a.FiltrarCompletados(listaUsuario_2.animeList.lists);
    return animesUsuario_2 = animesUsuario_2 == undefined ? null : animesUsuario_2.entries;
});
Afinidad.zip = (a, b) => a.map((k, i) => [k, b[i]]);
