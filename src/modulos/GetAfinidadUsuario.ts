import { BOT } from "../objects/Bot";

async function GetAfinidadUsuario(bot: BOT, aniuser1: any, uRegistrados: Array<any>) {
    const userList1 = await bot.buscarListaUsuario(aniuser1?.getNombre());
    const user1AnimeList = userList1.animeList.lists[0].entries;

    let afinidades = [];

    let i = 0;
    while (i < uRegistrados.length) {
        if (uRegistrados[i].anilistUsername == aniuser1.getNombre()) {
            i++;
            continue;
        }

        const aniuser2 = await bot.usuario(uRegistrados[i].anilistUsername || "");
        const userList2 = await bot.buscarListaUsuario(aniuser2?.getNombre());
        const user2AnimeList = userList2.animeList.lists[0].entries;

        const resultado = await bot.calcularAfinidad(user1AnimeList, user2AnimeList);

        afinidades.push({ username: aniuser2?.getNombre(), afinidad: resultado });

        i++;
    }

    return afinidades;
}

export { GetAfinidadUsuario };