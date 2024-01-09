import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInterface from "../interfaces/CommandInterface";
import SetupCommandInteraction from "./interactions/setup/SetupCommandInteraction";

export default class ComandoSetup implements CommandInterface {
    public readonly cooldown: number = 0;

    public readonly data = new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Enlaza tu cuenta de una de estas plataformas.")
        .addStringOption(option => 
            option
                .setName('plataforma')
                .setDescription('Plataformas actualmente disponibles.')
                .addChoices(
                    { name: 'Anilist', value: 'Anilist' },
                    { name: 'MyAnimeList', value: 'MyAnimeList' },
                    { name: 'VisualNovelDatabase', value: 'VisualNovelDatabase' })
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('nombre-o-id')
                .setDescription('Tu nombre o ID de usuario.')
                .setRequired(true));
    
    public async execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const commandInteraction = new SetupCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}