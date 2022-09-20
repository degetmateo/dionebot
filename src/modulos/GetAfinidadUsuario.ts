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

        const sharedMedia = bot.GetSharedMedia(user1AnimeList, user2AnimeList);
        const resultado = bot.CalcularAfinidad(sharedMedia);

        afinidades.push({ username: aniuser2?.getNombre(), afinidad: resultado.toFixed(2) });

        i++;
    }

    return afinidades;
}

export { GetAfinidadUsuario };