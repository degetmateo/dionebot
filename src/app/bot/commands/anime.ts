import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, SlashCommandStringOption, SlashCommandBooleanOption } from "discord.js";
import CommandInterface from "../interfaces/CommandInterface";
import AnimeCommandInteraction from "./interactions/anime/AnimeCommandInteraction";

export default class CommandAnime implements CommandInterface {
    public readonly name: string = 'anime';
    public readonly cooldown: number = 10;

    public readonly data = new SlashCommandBuilder()
        .setName('anime')
        .setDescription('Busca un anime en la base de datos de anilist.')
        .setDMPermission(false)
        .addStringOption((opcion: SlashCommandStringOption) =>
            opcion
                .setName('nombre-o-id')
                .setDescription('El nombre o el ID con el que se va a buscar el anime.')
                .setRequired(true))
        .addBooleanOption((opcion: SlashCommandBooleanOption) => 
            opcion
                .setName('traducir')
                .setDescription('Si deseas traducir la sinopsis.'));

    public async execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const commandInteraction = new AnimeCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}