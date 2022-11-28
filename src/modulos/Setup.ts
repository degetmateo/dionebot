import Aniuser from "../modelos/Aniuser";
import { Usuario } from "../objetos/Usuario";

class Setup {
    public static async SetupUsuario(usuario: Usuario, serverID: string, discordID: string): Promise<void> {    
        const aniuser = new Aniuser({
            serverId: serverID,
            discordId: discordID,
            anilistId: usuario.getID(),
            anilistUsername: usuario.getNombre()
        });
    
        try {
            await aniuser.save();
        } catch (err) {
            throw err;
        }
    }

    public static async UnsetupUsuario(serverID: string, userID: string): Promise<void> {
        const uRegistrado = await Aniuser.findOne({ serverId: serverID, discordId: userID });

        try {
            await uRegistrado?.delete();
        } catch (err) {
            throw err;
        }
    }
}

export { Setup };