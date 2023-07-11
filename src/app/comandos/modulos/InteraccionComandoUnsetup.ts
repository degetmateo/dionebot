import { ChatInputCommandInteraction, CacheType } from "discord.js";
import InteraccionComando from "./InteraccionComando";
import BOT from "../../bot";
import { Setup } from "../../modulos/Setup";
import Embed from "../../embeds/Embed";

export default class InteraccionComandoUnsetup extends InteraccionComando {
    public static async execute (interaction: ChatInputCommandInteraction<CacheType>) {
        const modulo = new InteraccionComandoUnsetup(interaction);
        await modulo.execute(interaction);    
    }
    
    protected async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await interaction.deferReply({ ephemeral: true });

        const bot = interaction.client as BOT;

        const serverID = interaction.guild?.id != null ? interaction.guild.id : "";
        const userID = interaction.user.id;

        await Setup.UnsetupUsuario(serverID, userID);

        bot.eliminarUsuario(serverID, userID);

        interaction.editReply({
            embeds: [Embed.CrearVerde('Listo! Se ha eliminado tu cuenta.')]
        })
    }
}