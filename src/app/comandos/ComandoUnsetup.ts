import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import Comando from "../interfaces/InterfazComando";
import InteraccionComandoUnsetup from "./modulos/InteraccionComandoUnsetup";

export default class ComandoSetup implements Comando {
    public readonly datos = new SlashCommandBuilder()
        .setName("unsetup")
        .setDescription("Te elimina de los usuarios registrados.");
    
    public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await InteraccionComandoUnsetup.execute(interaction);    
    }
}