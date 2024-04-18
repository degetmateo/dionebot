import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import SeasonCommandInteraction from "../interactions/season/SeasonCommandInteraction";

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('season')
        .setDescription("Devuelve los animes que salieron en el año y en la temporada pasados como parámetro.")
        .setDMPermission(false)
        .addIntegerOption(option =>
            option
                .setName("año")
                .setDescription("El año en el que se emitieron los animes.")
                .setRequired(true))
        .addStringOption(option => 
            option
                .setName("temporada")
                .setDescription("La temporada en la que se emitieron los animes.")
                .addChoices({ name: "PRIMAVERA", value: "SPRING" },
                            { name: "VERANO", value: "SUMMER" },
                            { name: "INVIERNO", value: "WINTER" },
                            { name: "OTOÑO", value: "FALL" })
                .setRequired(true)),
    execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const commandInteraction = new SeasonCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}