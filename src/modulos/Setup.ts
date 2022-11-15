import Aniuser from "../modelos/Aniuser";
import { Message } from "discord.js";
import { Usuario } from "../objetos/Usuario";
import { Usuarios } from "./Usuarios";

class Setup {
    public static async SetupUsuario(username: string, serverID: string, discordID: string): Promise<boolean> {
        let uRegistrados = await Aniuser.find({ serverId: serverID });
        let uRegistrado = uRegistrados.find(u => u.discordId == discordID);
    
        if (uRegistrado) return false;

        let usuario = await Usuarios.BuscarUsuario(serverID, username);
        
        if (!usuario) return false;

        usuario = new Usuario(usuario);
    
        const aniuser = new Aniuser();
        
        aniuser.anilistUsername = usuario.getNombre();
        aniuser.anilistId = usuario.getID();
        aniuser.discordId = discordID;
        aniuser.serverId = serverID;
    
        aniuser.save(err => {
            console.error(err);
            return false;
        });
    
        return true;
    }

    public static async UnsetupUsuario(serverID: string, userID: string): Promise<boolean> {
        const uRegistrados = await Aniuser.find({ serverId: serverID });
        const uRegistrado = uRegistrados.find(u => u.discordId == userID);
    
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