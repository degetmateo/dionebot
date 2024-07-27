import { CacheType, ChatInputCommandInteraction } from "discord.js";

export default interface CommandInteractionInterface {
    interaction: ChatInputCommandInteraction;
    execute (interaction: ChatInputCommandInteraction<CacheType>): Promise<void>;
}