import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import Comando from "../interfaces/InterfazComando";
import InteraccionComandoUsuario from "./modulos/InteraccionComandoUsuario";
import Bot from "../Bot";
import ErrorDemasiadasPeticiones from "../../errores/ErrorDemasiadasPeticiones";

export default class ComandoUsuario implements Comando {
    public readonly cooldown: number = 5;

    public readonly datos = new SlashCommandBuilder()
        .setName("usuario")
        .setDescription("Muestra la información del perfil de Anilist de un usuario.")
        .addUserOption(option => 
            option
                .setName("usuario")
                .setDescription("El usuario del que se solicita la información."));
    
    public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await InteraccionComandoUsuario.execute(interaction);
    }
}