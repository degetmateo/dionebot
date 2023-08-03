import { CacheType, ChatInputCommandInteraction } from "discord.js";

export default interface InteraccionComando {
    interaction: ChatInputCommandInteraction;
    execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void>;
}