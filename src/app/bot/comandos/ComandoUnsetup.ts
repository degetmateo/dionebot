import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import Comando from "../interfaces/InterfazComando";
import InteraccionComandoUnsetup from "./modulos/InteraccionComandoUnsetup";

export default class ComandoUnsetup implements Comando {
    public readonly cooldown: number = 0;

    public readonly datos = new SlashCommandBuilder()
        .setName("unsetup")
        .setDescription("Te elimina de los usuarios registrados.");
    
    public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await InteraccionComandoUnsetup.execute(interaction);    
    }
}