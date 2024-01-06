import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import CommandInterface from "../interfaces/CommandInterface";
import InteraccionComandoRandom from "./modulos/InteraccionComandoRandom";

export default class ComandoRandom implements CommandInterface {
    public readonly nombre: string = 'random';
    public readonly cooldown: number = 10;

    public readonly data = new SlashCommandBuilder()
        .setName('random')
        .setDescription('Elije al azar un anime para que veas de tus PTW.');

    public async execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const commandInteraction = new InteraccionComandoRandom(interaction);
        await commandInteraction.execute();
    }
}