import { CacheType, ChatInputCommandInteraction, CommandInteraction } from "discord.js";

export default abstract class InteraccionComando {
    public static readonly NUMERO_MAXIMO_32_BITS: number = 2_147_483_647;
    public static readonly TIEMPO_ESPERA_INTERACCION: number = 300_000;

    protected abstract interaction: CommandInteraction<CacheType>;
    protected abstract execute (interaction: CommandInteraction<CacheType>): Promise<void>;
}