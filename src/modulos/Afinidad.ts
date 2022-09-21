import { BOT } from "../objects/Bot";
import { Usuario } from "../objects/Usuario";

class Afinidad {
    public static async GetAfinidadUsuario(bot: BOT, aniuser1: Usuario, uRegistrados: Array<any>) {
        const userList1 = await bot.buscarListaUsuario(aniuser1?.getNombre());

        let user1AnimeList = this.FiltrarCompletados(userList1.animeList.lists);
        user1AnimeList = user1AnimeList == undefined ? null : user1AnimeList.entries;

        const afinidades: Array<{ username: string, afinidad: number }> = [];
    
        let i = 0;
        while (i < uRegistrados.length) {
            if (uRegistrados[i].anilistUsername == aniuser1.getNombre()) {
                i++;
                continue;
            }
    
            const aniuser2 = await bot.usuario(uRegistrados[i].serverId, uRegistrados[i].anilistUsername || "");

            const userList2 = await bot.buscarListaUsuario(aniuser2 == null ? "" : aniuser2.getNombre());
            
            let user2AnimeList = this.FiltrarCompletados(userList2.animeList.lists);
            user2AnimeList = user2AnimeList == undefined ? null : user2AnimeList.entries;

            const sharedMedia = await this.GetSharedMedia(user1AnimeList, user2AnimeList);

            const resultado = this.CalcularAfinidad(sharedMedia);

            afinidades.push({ username: aniuser2 == null ? "" : aniuser2.getNombre(), afinidad: parseFloat(resultado.toFixed(2)) });
    
            i++;
        }
    
        return this.OrdenarAfinidades(afinidades);
    }

    public static FiltrarCompletados(listas: Array<{ entries: Array<any>, status: string }>): any {
        return listas.find(lista => lista.status == "COMPLETED");
    }

    public static async GetSharedMedia(l1: Array<{ mediaId: number, score: number }>, l2: Array<{ mediaId: number, score: number }>) {
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

    public static CalcularAfinidad(sharedMedia: Array<{ id: number, scoreA: number, scoreB: number }>): number {
        const scoresA: Array<number> = sharedMedia.map(media => media.scoreA);
        const scoresB: Array<number> = sharedMedia.map(media => media.scoreB);

        const ma = this.CalcularPromedioLista(scoresA);
        const mb = this.CalcularPromedioLista(scoresB);

        const am = scoresA.map(score => score - ma);
        const bm = scoresB.map(score => score - mb);

        const sa = am.map(x => Math.pow(x, 2));
        const sb = bm.map(x => Math.pow(x, 2));

        const zip = (a: Array<number>, b: Array<number>) => a.map((k, i) => [k, b[i]]);

        const numerador = this.SumarLista(zip(am, bm).map(tupla => tupla[0] * tupla[1]));
        const denominador = Math.sqrt(this.SumarLista(sa) * this.SumarLista(sb));

        return (denominador == 0 ? 0 : numerador / denominador) * 100;
    }

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