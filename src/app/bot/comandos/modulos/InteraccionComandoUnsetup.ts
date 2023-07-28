import { ChatInputCommandInteraction, CacheType } from "discord.js";
import InteraccionComando from "./InteraccionComando";
import Bot from "../../Bot";
import Embed from "../../embeds/Embed";
import Aniuser from "../../../database/modelos/Aniuser";
import ErrorSinResultados from "../../../errores/ErrorSinResultados";

export default class InteraccionComandoUnsetup extends InteraccionComando {
    protected interaction: ChatInputCommandInteraction<CacheType>;
    
    private constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.interaction = interaction;
    }

    public static async execute (interaction: ChatInputCommandInteraction<CacheType>) {
        const modulo = new InteraccionComandoUnsetup(interaction);
        await modulo.execute(interaction);    
    }
    
    protected async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await interaction.deferReply({ ephemeral: true });

        const bot = interaction.client as Bot;

        const serverID = interaction.guild?.id != null ? interaction.guild.id : "";
        const userID = interaction.user.id;

        await InteraccionComandoUnsetup.UnsetupUsuario(serverID, userID);

        bot.usuarios.eliminar(serverID, userID);

        const embed = Embed.Crear()
            .establecerColor(Embed.COLOR_VERDE)
            .establecerDescripcion('Listo! Se ha eliminado tu cuenta.')
            .obtenerDatos();

        interaction.editReply({
            embeds: [embed]
        })
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