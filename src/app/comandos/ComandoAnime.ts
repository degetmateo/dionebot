import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, SlashCommandStringOption, SlashCommandBooleanOption } from "discord.js";
import Comando from "../interfaces/InterfazComando";
import InteraccionComandoAnime from "./modulos/InteraccionComandoAnime";

export default class ComandoAnime implements Comando {
    public readonly datos = new SlashCommandBuilder()
        .setName('anime')
        .setDescription('Busca un anime en la base de datos de anilist.')
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
        await InteraccionComandoAnime.execute(interaction);    
    }
}