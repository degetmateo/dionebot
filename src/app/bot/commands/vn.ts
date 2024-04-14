import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInterface from "../interfaces/CommandInterface";
import VNCommandInteraction from "./interactions/vn/VNCommandInteraction";

export default class CommandVN implements CommandInterface {
    public readonly name: string = 'vn';
    public readonly cooldown: number = 10;
    
    public readonly data = new SlashCommandBuilder()
        .setName('vn')
        .setDescription('Obtén información acerca de una novela visual.')
        .setDMPermission(false)
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
        const commandInteraction = new VNCommandInteraction(interaction);
        await commandInteraction.execute();    
    }
}