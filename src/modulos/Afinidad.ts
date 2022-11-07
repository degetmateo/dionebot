import Aniuser from "../modelos/Aniuser";
import { Usuario } from "../objetos/Usuario";
import { Usuarios } from "./Usuarios";

class Afinidad {
    public static GetAfinidadUsuario = async (user_1: Usuario, uRegistrados: Array<any>) => {
        const listaUsuario_1 = await Usuarios.GetEntradas(user_1.getNombre());

        if (!listaUsuario_1) {
            return {
                error: true,
                message: "No se han encontrados entradas de ese usuario.",
                afinidades: []
            }
        }

        let animesUsuario_1 = this.FiltrarCompletados(listaUsuario_1.animeList.lists);
        animesUsuario_1 = animesUsuario_1.entries;

        if (!animesUsuario_1) {
            return {
                error: true,
                message: "",
                afinidades: []
            }
        }

        const afinidades: Array<{ username: string, afinidad: number }> = [];
    
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

            const datosUsuario = await Usuarios.GetEntradasAnime(uRegistrados[i].anilistUsername);
            let animesUsuario_2 = this.FiltrarCompletados(datosUsuario.animeList.lists);
            animesUsuario_2 = animesUsuario_2.entries;

            if (!animesUsuario_2) {
                i++;
                continue;
            }

            const sharedMedia = this.GetSharedMedia(animesUsuario_1, animesUsuario_2);
            const resultado = this.CalcularAfinidad(sharedMedia);

            afinidades.push({ username: uRegistrados[i].anilistUsername, afinidad: parseFloat(resultado.toFixed(2)) });
    
            i++;
        }

        return {
            error: false,
            message: "",
            afinidades: this.OrdenarAfinidades(afinidades)
        }
    }

    private static FiltrarCompletados(listas: Array<{ entries: Array<any>, status: string }>): any {
        return listas.find(lista => lista.status == "COMPLETED");
    }

    private static GetSharedMedia(l1: Array<{ mediaId: number, score: number }>, l2: Array<{ mediaId: number, score: number }>) {
        const sharedMedia: Array<{ id: number, scoreA: number, scoreB: number }> = [];

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

    private static CalcularAfinidad(sharedMedia: Array<{ id: number, scoreA: number, scoreB: number }>): number {
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

        return (denominador == 0 ? 0 : numerador / denominador) * 100;
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