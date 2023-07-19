import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import Comando from "../interfaces/InterfazComando";
import InteraccionComandoSetup from "./modulos/InteraccionComandoSetup";

export default class ComandoSetup implements Comando {
    public readonly cooldown: number = 0;

    public readonly datos = new SlashCommandBuilder()
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
    
    public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await InteraccionComandoSetup.execute(interaction);    
    }
}