import { CacheType, ChatInputCommandInteraction } from "discord.js";

export default interface InteraccionComando {
    interaction: ChatInputCommandInteraction<CacheType>;
    execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void>;
}