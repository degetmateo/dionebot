import { CacheType, ChatInputCommandInteraction } from "discord.js";

export default abstract class CommandInteraction {
    public static readonly NUMERO_MAXIMO_32_BITS: number = 2_147_483_647;
    public static readonly TIEMPO_ESPERA_INTERACCION: number = 120_000;

    protected abstract interaction: ChatInputCommandInteraction<CacheType>;
    public abstract execute (): Promise<void>;
}