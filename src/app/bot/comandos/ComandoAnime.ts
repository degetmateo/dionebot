import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, SlashCommandStringOption, SlashCommandBooleanOption } from "discord.js";
import Comando from "../interfaces/InterfazComando";
import InteraccionComandoAnime from "./modulos/InteraccionComandoAnime";
import Bot from "../Bot";
import ErrorDemasiadasPeticiones from "../../errores/ErrorDemasiadasPeticiones";

export default class ComandoAnime implements Comando {
    public readonly nombre: string = 'anime';
    public readonly cooldown: number = 10;

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
        const bot = interaction.client as Bot;
        const serverID = interaction.guild?.id as string;

        if (bot.comandosUtilizados.has(serverID)) throw new ErrorDemasiadasPeticiones('Se estan realizando muchas peticiones. Espera un momento.');
        bot.comandosUtilizados.add(serverID);

        try {
            await InteraccionComandoAnime.execute(interaction);
            bot.comandosUtilizados.delete(serverID);
        } catch (error) {
            bot.comandosUtilizados.delete(serverID);
            throw error;
        }
    }
}