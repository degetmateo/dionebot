import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import Comando from "../interfaces/InterfazComando";
import InteraccionComandoVN from "./modulos/InteraccionComandoVN";

export default class ComandoVN implements Comando {
    public readonly cooldown: number = 10;
    
    public readonly data = new SlashCommandBuilder()
        .setName('vn')
        .setDescription('Obtén información acerca de una novela visual.')
        .addStringOption(opcion =>
            opcion
                .setName('nombre-o-id')
                .setDescription('El nombre o el ID con el que se va a buscar la novela visual.')
                .setRequired(true))
        .addBooleanOption(opcion =>
            opcion
                .setName('traducir')
                .setDescription('Indicar si la información obtenida debe traducirse al español.'));
    
    public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        interaction.reply('Comando en mantenimiento.');
        return;
        
        await InteraccionComandoVN.execute(interaction);    
    }
}