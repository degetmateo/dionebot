import { BOT } from "../objects/Bot";
import { AniUser } from "../models/AniUser";
import { Message } from "discord.js";

class Setup {
    public static async SetupUsuario(bot: BOT, username: string, message: Message): Promise<boolean> {
        const usuario = await bot.usuario(message.guild == null ? "" : message.guild.id, username);
            
        if (!usuario) return false;
    
        let uRegistrados = await AniUser.find({ serverId: message.guildId });
        let uRegistrado = uRegistrados.find(u => u.discordId == message.author.id);
    
        if (uRegistrado != null && uRegistrado != undefined) return false;
    
        const aniuser = new AniUser();
        
        aniuser.anilistUsername = usuario.getNombre();
        aniuser.anilistId = usuario.getID();
        aniuser.discordId = message.author.id;
        aniuser.serverId = message.guild?.id;
    
        aniuser.save(err => {
            console.error(err);
            return false;
        });
    
        return true;
    }

    public static async UnsetupUsuario(bot: BOT, message: Message): Promise<boolean> {
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
}

export { Setup };