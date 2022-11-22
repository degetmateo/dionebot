import Aniuser from "../modelos/Aniuser";
import { Usuario } from "../objetos/Usuario";
import { uRegistrado } from "../types";

class Setup {
    public static async SetupUsuario(usuario: Usuario, serverID: string, discordID: string): Promise<boolean> {    
        const aniuser = new Aniuser();
        
        aniuser.anilistUsername = usuario.getNombre();
        aniuser.anilistId = usuario.getID();
        aniuser.discordId = discordID;
        aniuser.serverId = serverID;
    
        try {
            await aniuser.save();
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    public static async UnsetupUsuario(serverID: string, userID: string): Promise<boolean> {
        const uRegistrado = await Aniuser.findOne({ serverId: serverID, discordId: userID });

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