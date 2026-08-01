import { ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionContextType, SlashCommandBuilder } from "discord.js";
import GuildChatInputCommandInteraction from "../../extensions/guildChatInputCommandInteraction.extension";
import mongo from "../../database/mongo";
import { Document, WithId } from "mongodb";
import ChEmbed from "../../builders/embeds/ch.embed";
import ErrorEmbed from "../../embeds/errorEmbed";
import membersRepository from "../../repositories/members/members.repository";
import guildsRepository from "../../repositories/guilds/guilds.repository";
import charactersRepository from "../../repositories/characters/characters.repository";

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('ch')
        .setDescription('Tirar por un personaje al azar para reclamar.')
        .setContexts(InteractionContextType.Guild)
        .setNSFW(false),
    execute: async (interaction: GuildChatInputCommandInteraction) => {
        const member: any = await membersRepository.findsert(interaction.user.id, interaction.guild.id);

        if (member.gacha.pulls <= 0) {
            return interaction.reply({
                flags: "Ephemeral",
                embeds: [new ErrorEmbed('**¡No tienes más pulls!** Volverás a tener \`20 pulls\` en la siguiente hora (esto no se acumula). También puedes comprar \`1 pull\` por \`10 renas\` en \`/gacha buy-pulls\`.')]
            });
        };

        membersRepository.decreasePulls(member._id);

        const character = await charactersRepository.random(); 

        const claim: any = await guildsRepository.getClaim(interaction.guild.id, character._id);
        const owner_id = claim ? claim.member_discord_id : null;

        const embed = new ChEmbed({
            name: character.name,
            site_url: character.url,
            image_url: character.images[0].url,
            claimed_count: character.claimed_count || 0,
            user_id: owner_id
        });

        character.owner_id = owner_id;

        const cache_id = interaction.client.set(character, 25_000);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`ch-claim-button_${cache_id}`)
                    .setEmoji((!owner_id) ? '❤️' : '💰')
                    .setStyle(ButtonStyle.Secondary)
            )

        return await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};