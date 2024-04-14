import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInterface from "../interfaces/CommandInterface";
import UnsetupCommandInteraction from "./interactions/unsetup/UnsetupCommandInteraction";

export default class CommandUnsetup implements CommandInterface {
    public readonly name: string = 'unsetup';
    public readonly cooldown: number = 5;

    public readonly data = new SlashCommandBuilder()
        .setName('unsetup')
        .setDescription("Te elimina de los usuarios registrados.")
        .setDMPermission(false);
    
    public async execute(interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const commandInteraction = new UnsetupCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}