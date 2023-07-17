import { CacheType, ChatInputCommandInteraction } from "discord.js";

export default interface InterfazInteraccionComando {
    interaction: ChatInputCommandInteraction<CacheType>;
    execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void>;
}