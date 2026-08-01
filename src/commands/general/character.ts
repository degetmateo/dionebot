import { InteractionContextType, SlashCommandBuilder } from "discord.js";
import GuildChatInputCommandInteraction from "../../extensions/guildChatInputCommandInteraction.extension";
import Helpers from "../../helpers";
import anilist from "../../apis/anilist/anilist";
import ErrorEmbed from "../../embeds/errorEmbed";
import mongo from "../../database/mongo";
import CharacterEmbed from "../../builders/embeds/character.embed";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('character')
        .setDescription('Buscar un personaje y toda su información.')
        .setNSFW(false)
        .setContexts(InteractionContextType.Guild)
        .addStringOption(option =>
            option
                .setName('name-or-id')
                .setDescription('Nombre o identificador del personaje.')
                .setRequired(true)
        ),
    execute: async (interaction: GuildChatInputCommandInteraction) => {
        const args = interaction.options.getString('name-or-id', true);
        
        const data = Helpers.isNumber(args) ?
            await anilist.get.character.id(args):
            await anilist.get.character.name(args);

        if (!data) {
            return await interaction.reply({
                flags: 'Ephemeral',
                embeds: [new ErrorEmbed('No hemos encontrado resultados.')]
            });
        };

        const char = await mongo.characters.findOne({ _id: data.id });

        let owner_id: string | null = null;
        let claimed_count: number | null = null;
        
        if (char) {
            claimed_count = char.claimed_count;
            
            const claim = await mongo.claims.findOne(
                {
                    _id: `${interaction.guild.id}_${char._id}` as any
                }
            );

            if (claim) {
                owner_id = claim.user_id;
            };
        } else {
            mongo.characters.insertOne({
                _id: data.id,
                url: data.siteUrl,
                gender: data.gender || null,
                age: data.age || null,
                favourites: data.favourites || 0,
                name: data.name.userPreferred || data.name.full,
                images: [{ url: data.image.large || data.image.medium }],
                claimed_count: 0
            });
        };

        const embed = new CharacterEmbed({
            ...data,
            owner_id: owner_id,
            claimed_count: claimed_count
        });

        await interaction.reply({
            embeds: [embed]
        });
    }
};