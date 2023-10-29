import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, SlashCommandStringOption, SlashCommandBooleanOption } from "discord.js";
import Comando from "../interfaces/InterfazComando";
import InteraccionComandoRandom from "./modulos/InteraccionComandoRandom";

export default class ComandoRandom implements Comando {
    public readonly nombre: string = 'random';
    public readonly cooldown: number = 10;

    public readonly datos = new SlashCommandBuilder()
        .setName('random')
        .setDescription('Elije al azar un anime para que veas de tus PTW.');

    public async execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> {
        await InteraccionComandoRandom.execute(interaction);
    }
}