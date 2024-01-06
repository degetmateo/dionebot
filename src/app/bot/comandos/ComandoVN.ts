import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInterface from "../interfaces/CommandInterface";
import InteraccionComandoVN from "./modulos/InteraccionComandoVN";

export default class ComandoVN implements CommandInterface {
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
        const commandInteraction = new InteraccionComandoVN(interaction);
        await commandInteraction.execute();    
    }
}