import { EmbedBuilder, InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js";
import GuildChatInputCommandInteraction from "../../extensions/guildChatInputCommandInteraction.extension";
import PathNotesInfoCardComponent from "../../components/patch-notes-info-card.component";

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('patch-notes')
        .setDescription('List of the latest changes.')
        .setContexts(InteractionContextType.Guild)
        .setNSFW(false),
    execute: async (interaction: GuildChatInputCommandInteraction) => {        
        await interaction.reply({
            flags: [MessageFlags.IsComponentsV2],
            components: [new PathNotesInfoCardComponent(interaction.client.user.avatarURL({ extension: 'png', size: 512 }) as string)]
        });
    }
};