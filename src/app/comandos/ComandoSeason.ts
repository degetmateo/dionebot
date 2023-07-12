import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import Comando from "../interfaces/InterfazComando";
import InteraccionComandoSeason from "./modulos/InteraccionComandoSeason";
import BOT from "../bot";
import ErrorDemasiadasPeticiones from "../errores/ErrorDemasiadasPeticiones";

export default class ComandoManga implements Comando {
    public readonly datos = new SlashCommandBuilder()
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
        const bot = interaction.client as BOT;
        const serverID = interaction.guild?.id as string;

        if (bot.comandosUtilizados.has(serverID)) throw new ErrorDemasiadasPeticiones('Se estan realizando muchas peticiones. Espera un momento.');
        bot.comandosUtilizados.add(serverID);

        try {
            await InteraccionComandoSeason.execute(interaction);
            bot.comandosUtilizados.delete(serverID);
        } catch (error) {
            bot.comandosUtilizados.delete(serverID);
            throw error;
        }
    }
}