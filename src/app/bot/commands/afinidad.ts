import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import AfinidadCommandInteraction from "./interactions/afinidad/AfinidadCommandInteraction";

module.exports = {
    cooldown: 20,
    data: new SlashCommandBuilder()
        .setName('afinidad')
        .setDescription("Calcula la afinidad entre ti (u otro usuario) y los demás miembros registrados del servidor.")
        .setDMPermission(false)
        .addUserOption(option => 
            option
                .setName("usuario")
                .setDescription("Usuario del que quieres calcular la afinidad.")),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
        const commandInteraction = new AfinidadCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}