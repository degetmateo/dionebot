import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import Comando from "../interfaces/InterfazComando";
import InteraccionComandoUsuario from "./modulos/InteraccionComandoUsuario";

export default class ComandoUsuario implements Comando {
    public readonly cooldown: number = 5;

    public readonly data = new SlashCommandBuilder()
        .setName("usuario")
        .setDescription("Muestra la información del perfil de Anilist de un usuario.")
        .addUserOption(option => 
            option
                .setName("usuario")
                .setDescription("El usuario del que se solicita la información."));
    
    public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        interaction.reply('Comando en mantenimiento.');
        return;
        
        await InteraccionComandoUsuario.execute(interaction);
    }
}