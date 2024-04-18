import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import UnsetupCommandInteraction from "./interactions/unsetup/UnsetupCommandInteraction";

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('unsetup')
        .setDescription("Te elimina de los usuarios registrados.")
        .setDMPermission(false),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const commandInteraction = new UnsetupCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}