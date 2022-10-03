import { User } from "../modelos_db/User";
import { Message } from "discord.js";
import { Usuario } from "../modelos/Usuario";
import { Usuarios } from "./Usuarios";

class Setup {
    public static async SetupUsuario(username: string, message: Message): Promise<boolean> {
        const usuario = new Usuario(await Usuarios.BuscarUsuario(message.guild == null ? "" : message.guild.id, username));
            
        if (!usuario) return false;
    
        let uRegistrados = await User.find({ serverId: message.guildId });
        let uRegistrado = uRegistrados.find(u => u.discordId == message.author.id);
    
        if (uRegistrado != null && uRegistrado != undefined) return false;
    
        const aniuser = new User();
        
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

    public static async UnsetupUsuario(message: Message): Promise<boolean> {
        const uRegistrados = await User.find({ serverId: message.guildId });
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