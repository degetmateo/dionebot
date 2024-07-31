import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import UserCommandInteraction from "../interactions/user/UserCommandInteracion";

module.exports = {
    cooldown: 20,
    data: new SlashCommandBuilder()
        .setName('user')
        .setNameLocalization('es-ES', 'usuario')
        .setDescription('Mostrar información del perfil de anilist de un usuario.')
        .setNSFW(false)
        .setDMPermission(false)
        .addUserOption(option =>
            option
                .setName('user')
                .setNameLocalization('es-ES', 'usuario')
                .setDescription('Usuario del que se solicita la información.')
                .setRequired(false)
        ),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const commandInteraction = new UserCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}