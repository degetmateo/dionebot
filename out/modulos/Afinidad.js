"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Afinidad = void 0;
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
            const media_2 = l2.find(e => e.mediaId == mediaID_1);
            if (!media_2) {
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
        return (numerador <= 0 || denominador <= 0 ? 0 : numerador / denominador) * 100;
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
Afinidad.GetAfinidadUsuario = async (user_1, uRegistrados) => {
    const listaUsuario_1 = await Usuarios_1.Usuarios.GetEntradas(user_1.getNombre());
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
            i++;
            continue;
        }
        const datosUsuario = await Usuarios_1.Usuarios.GetEntradasAnime(uRegistrados[i].anilistUsername);
        let animesUsuario_2 = _a.FiltrarCompletados(datosUsuario.animeList.lists);
        animesUsuario_2 = animesUsuario_2.entries;
        if (!animesUsuario_2) {
            i++;
            continue;
        }
        const sharedMedia = _a.GetSharedMedia(animesUsuario_1, animesUsuario_2);
        const resultado = _a.CalcularAfinidad(sharedMedia);
        afinidades.push({ username: uRegistrados[i].anilistUsername, afinidad: parseFloat(resultado.toFixed(2)) });
        i++;
        await _a.sleep(1000);
    }
    return {
        error: false,
        message: "",
        afinidades: _a.OrdenarAfinidades(afinidades)
    };
};
Afinidad.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
Afinidad.zip = (a, b) => a.map((k, i) => [k, b[i]]);
