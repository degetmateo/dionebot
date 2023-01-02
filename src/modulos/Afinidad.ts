import { Usuario } from "../objetos/Usuario";
import { Usuarios } from "./Usuarios";
import { sharedMedia, uRegistrado } from "../types";

class Afinidad {
    public static GetAfinidadUsuario = async (user_1: Usuario, uRegistrados: Array<uRegistrado>) => {
        const listaUsuario_1 = await Usuarios.GetEntradasAnime(user_1.getNombre());

        if (!listaUsuario_1 || !listaUsuario_1.animeList || !listaUsuario_1.animeList.lists || !listaUsuario_1.animeList.lists.entries) {
            throw new Error(`No se han encontrado entradas para el usuario ${user_1.getNombre()}`);
        }

        const listaCompletados_1 = listaUsuario_1.animeList.lists.find((f: any) => f.status === "COMPLETED");

        if (!listaCompletados_1) {
            throw new Error(`No se han encontrado entradas para el usuario ${user_1.getNombre()}`);
        }

        const animesCompletados_1 = listaCompletados_1.entries;

        if (!animesCompletados_1) {
            throw new Error(`No se han encontrado entradas para el usuario ${user_1.getNombre()}`);
        }

        const afinidades: Array<{ username: string, afinidad: number }> = [];

        for (let i = 0; i < uRegistrados.length; i++) {
            if (uRegistrados[i].anilistUsername == user_1.getNombre()) {
                continue;
            }
    
            if (!uRegistrados[i].anilistUsername) {
                continue;
            }

            const datosUsuario = await Usuarios.GetEntradasAnime(uRegistrados[i].anilistUsername);

            if (!datosUsuario || !datosUsuario.animeList || !datosUsuario.animeList.lists) {
                continue;
            }

            const listaCompletados_2 = datosUsuario.animeList.lists.find((f: any) => f.status === "COMPLETED");
            
            if (!listaCompletados_2) {
                continue;
            } 
            
            const animesCompletados_2 = listaCompletados_2.entries;

            if (!animesCompletados_2) {
                continue;
            }

            console.log(datosUsuario)

            const sharedMedia = this.GetSharedMedia(animesCompletados_1, animesCompletados_2);
            const resultado = this.CalcularAfinidad(sharedMedia);

            afinidades.push({ username: uRegistrados[i].anilistUsername, afinidad: parseFloat(resultado.toFixed(2)) });
        }

        return this.OrdenarAfinidades(afinidades);
    }

    private static sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    private static GetSharedMedia(l1: Array<{ mediaId: number, score: number }>, l2: Array<{ mediaId: number, score: number }>) {
        const sharedMedia: Array<sharedMedia> = [];

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

    private static CalcularAfinidad(sharedMedia: Array<sharedMedia>): number {
        const scoresA: Array<number> = sharedMedia.map(media => media.scoreA);
        const scoresB: Array<number> = sharedMedia.map(media => media.scoreB);

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

    private static zip = (a: Array<number>, b: Array<number>) => a.map((k, i) => [k, b[i]]);

    private static OrdenarAfinidades(afinidades: Array<{ username: string, afinidad: number }>): Array<{ username: string, afinidad: number }> {
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

    private static SumarLista(lista: Array<number>): number {
        let suma: number = 0;

        for (let i = 0; i < lista.length; i++) {
            suma += lista[i];
        }

        return suma;
    }

    private static CalcularPromedioLista(lista: Array<number>): number {
        return this.SumarLista(lista) / lista.length;
    }
}

export { Afinidad };