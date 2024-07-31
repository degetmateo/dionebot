import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import UserCommandInteraction from "../interactions/user/UserCommandInteracion";

module.exports = {
    cooldown: 20,
    data: new SlashCommandBuilder()
        .setName('user')
        .setNameLocalization('es-ES', 'usuario')
        .setDescription(`Display a user's anilist profile.`)
        .setDescriptionLocalization('es-ES', 'Mostrar el perfil de anilist de un usuario.')
        .setNSFW(false)
        .setDMPermission(false)
        .addUserOption(option =>
            option
                .setName('user')
                .setNameLocalization('es-ES', 'usuario')
                .setDescription('User you want to search.')
                .setDescriptionLocalization('es-ES', 'Usuario del que se solicita la información.')
                .setRequired(false)
        ),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const commandInteraction = new UserCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}