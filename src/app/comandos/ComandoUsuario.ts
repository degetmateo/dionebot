import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import Comando from "../interfaces/InterfazComando";
import InteraccionComandoUsuario from "./modulos/InteraccionComandoUsuario";
import BOT from "../bot";
import ErrorDemasiadasPeticiones from "../errores/ErrorDemasiadasPeticiones";

export default class ComandoUsuario implements Comando {
    public readonly datos = new SlashCommandBuilder()
        .setName("usuario")
        .setDescription("Muestra la información del perfil de Anilist de un usuario.")
        .addUserOption(option => 
            option
                .setName("usuario")
                .setDescription("El usuario del que se solicita la información."));
    
    public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const bot = interaction.client as BOT;
        const serverID = interaction.guild?.id as string;

        if (bot.comandosUtilizados.has(serverID)) throw new ErrorDemasiadasPeticiones('Se estan realizando muchas peticiones. Espera un momento.');
        bot.comandosUtilizados.add(serverID);

        try {
            await InteraccionComandoUsuario.execute(interaction);
            bot.comandosUtilizados.delete(serverID);
        } catch (error) {
            bot.comandosUtilizados.delete(serverID);
            throw error;
        }
    }
}