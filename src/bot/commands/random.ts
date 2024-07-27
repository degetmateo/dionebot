import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import RandomCommandInteraction from "../interactions/random/RandomCommandInteraction";

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Elije al azar un anime para que veas de tus PTW.')
        .setDMPermission(false),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const commandInteraction = new RandomCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}