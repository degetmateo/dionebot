import ErrorSinResultados from "../errores/ErrorSinResultados";
import Aniuser from "../modelos/Aniuser";
import { UsuarioAnilist } from "../objetos/UsuarioAnilist";

class Setup {
    public static async SetupUsuario(usuario: UsuarioAnilist, serverID: string, discordID: string): Promise<void> {    
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

        if (!uRegistrado) throw new ErrorSinResultados('No estas registrado en la base de datos.');

        try {
            await uRegistrado?.deleteOne();
        } catch (err) {
            throw err;
        }
    }
}

export { Setup };