import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import Comando from "../interfaces/InterfazComando";
import InteraccionComandoManga from "./modulos/InteraccionComandoManga";
import Bot from "../Bot";
import ErrorDemasiadasPeticiones from "../../errores/ErrorDemasiadasPeticiones";

export default class ComandoManga implements Comando {
    public readonly cooldown: number = 10;
    
    public readonly data = new SlashCommandBuilder()
        .setName('manga')
        .setDescription('Busca un manga en la base de datos de anilist.')
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
        interaction.reply('Comando en mantenimiento.');
        return;

        await InteraccionComandoManga.execute(interaction);
    }
}