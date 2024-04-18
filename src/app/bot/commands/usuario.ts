import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import UsuarioCommandInteraction from "./interactions/usuario/UsuarioCommandInteraction";

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('usuario')
        .setDescription("Muestra la información del perfil de Anilist de un usuario.")
        .setDMPermission(false)
        .addUserOption(option => 
            option
                .setName("usuario")
                .setDescription("El usuario del que se solicita la información.")),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const commandInteraction = new UsuarioCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}