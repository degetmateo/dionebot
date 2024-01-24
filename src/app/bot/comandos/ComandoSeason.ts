import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInterface from "../interfaces/CommandInterface";
import SeasonCommandInteraction from "./interactions/season/SeasonCommandInteraction";

export default class ComandoSeason implements CommandInterface {
    public readonly cooldown: number = 10;
    
    public readonly data = new SlashCommandBuilder()
        .setName("season")
        .setDescription("Devuelve los animes que salieron en el año y en la temporada pasados como parámetro.")
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
                .setRequired(true));
    
    public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const commandInteraction = new SeasonCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}