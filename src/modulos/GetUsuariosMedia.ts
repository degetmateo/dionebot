import { BOT } from "../objects/Bot";
import { Obra } from "../objects/Obra";
import { AniUser } from "../models/AniUser";

async function GetUsuariosMedia(bot: BOT, serverID: any, media: Obra): Promise<any> {
    const uRegistrados = await AniUser.find({ serverId: serverID });
    const uMedia = [];

    for (let i = 0; i < uRegistrados.length; i++) {
        const uLista = await bot.buscarMediaUsuario(uRegistrados[i].anilistId, media.getID());

        if (uLista != null) {
            uLista.username = uRegistrados[i].anilistUsername;
            uLista.discordId = uRegistrados[i].discordId;
            uMedia.push(uLista);
        }
    }

    const uMapeados = [];

    for (let i = 0; i < uMedia.length; i++) {
        if (parseFloat(uMedia[i].score.toString()) <= 10) {
            uMedia[i].score = parseFloat((uMedia[i].score * 10).toString());
        }

        const u = {
            name: uMedia[i].username,
            status: uMedia[i].status,
            progress: uMedia[i].progress,
            score: parseFloat(uMedia[i].score.toString())
        }

        uMapeados.push(u);
    }

    return uMapeados;
}

export { GetUsuariosMedia };