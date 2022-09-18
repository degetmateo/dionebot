import { BOT } from "../objects/Bot";
import { AniUser } from "../models/AniUser";
import { Message } from "discord.js";

async function UnsetupUsuario(bot: BOT, message: Message): Promise<boolean> {
    const uRegistrados = await AniUser.find({ serverId: message.guildId });
    const uRegistrado = uRegistrados.find(u => u.discordId == message.author.id);

    try {
        await uRegistrado?.delete();
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export { UnsetupUsuario };