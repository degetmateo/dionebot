import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInterface from "../interfaces/CommandInterface";
import RandomCommandInteraction from "./interactions/random/RandomCommandInteraction";

export default class CommandRandom implements CommandInterface {
    public readonly name: string = 'random';
    public readonly cooldown: number = 10;

    public readonly data = new SlashCommandBuilder()
        .setName('random')
        .setDescription('Elije al azar un anime para que veas de tus PTW.')
        .setDMPermission(false);

    public async execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const commandInteraction = new RandomCommandInteraction(interaction);
        await commandInteraction.execute();
    }
}