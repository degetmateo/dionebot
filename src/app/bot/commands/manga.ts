import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInterface from "../interfaces/CommandInterface";
import MangaCommandInteraction from "./interactions/manga/MangaCommandInteraction";

export default class CommandManga implements CommandInterface {
    public readonly name: string = 'manga';
    public readonly cooldown: number = 10;
    
    public readonly data = new SlashCommandBuilder()
        .setName('manga')
        .setDescription('Busca un manga en la base de datos de anilist.')
        .setDMPermission(false)
        .addStringOption(opcion =>
            opcion
                .setName('nombre-o-id')
                .setDescription('El nombre o el ID con el que se va a buscar el manga.')
                .setRequired(true))
        .addBooleanOption(opcion => 
            opcion
                .setName('traducir')
                .setDescription('Si deseas traducir la sinopsis. (Traductor de Google)'));
    
    public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const commandInteraction = new MangaCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}