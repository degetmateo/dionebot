import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import Comando from "../interfaces/InterfazComando";
import InteraccionComandoUnsetup from "./modulos/InteraccionComandoUnsetup";

export default class ComandoUnsetup implements Comando {
    public readonly cooldown: number = 0;

    public readonly data = new SlashCommandBuilder()
        .setName("unsetup")
        .setDescription("Te elimina de los usuarios registrados.");
    
    public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        interaction.reply('Comando en mantenimiento.');
        return;
        
        await InteraccionComandoUnsetup.execute(interaction);    
    }
}