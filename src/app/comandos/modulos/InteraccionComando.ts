import { CacheType, ChatInputCommandInteraction } from "discord.js";

export default abstract class InteraccionComando {
    public static readonly NUMERO_MAXIMO_32_BITS: number = 2_147_483_647;
    public static readonly TIEMPO_ESPERA_INTERACCION: number = 300_000;

    protected interaction: ChatInputCommandInteraction<CacheType>;

    constructor (interaction: ChatInputCommandInteraction<CacheType>) {
        this.interaction = interaction;
    }
    
    protected abstract execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void>;
}