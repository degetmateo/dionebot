import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import AffinityCommandInteraction from "../interactions/affinity/AffinityCommandInteraction";

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('affinity')
        .setNameLocalization('es-ES', 'afinidad')
        .setDescription('See what your affinity with an user looks like.')
        .setDescriptionLocalization('es-ES', 'Calcula tu afinidad con otro usuario.')
        .setDMPermission(false)
        .setNSFW(false)
        .addUserOption(option =>
            option
                .setName('user')
                .setNameLocalization('es-ES', 'usuario')
                .setDescription('User you want to calculate your affinity with.')
                .setDescriptionLocalization('es-ES', 'Usuario con el que quieres calcular tu afinidad.')
                .setRequired(true)
        ),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const commandInteraction = new AffinityCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}