import { BOT } from "../objects/Bot";
import { AniUser } from "../models/AniUser";
import { Message } from "discord.js";

async function SetupUsuario(bot: BOT, username: string, message: Message): Promise<boolean> {
    const usuario = await bot.usuario(username);
        
    if (!usuario) return false;

    let uRegistrados = await AniUser.find({ serverId: message.guildId });
    let uRegistrado = uRegistrados.find(u => u.discordId == message.author.id);

    if (uRegistrado != null && uRegistrado != undefined) return false;

    const aniuser = new AniUser();
    
    aniuser.anilistUsername = usuario.getNombre();
    aniuser.anilistId = usuario.getID();
    aniuser.discordId = message.author.id;
    aniuser.serverId = message.guild?.id;

    aniuser.save((err) => {
        console.error(err);
        return false;
    });

    return true;
}

export { SetupUsuario };