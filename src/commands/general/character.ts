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

        const characters = mongo.collection('characters');
        const char = await characters.findOne({ anilist_id: data.id });

        let owner_id: string | null = null;
        let claimed_count: number | null = null;
        
        if (char) {
            claimed_count = char.claimed_count;
            
            const guilds = mongo.collection('guilds');
            const claimSearch: any = await guilds.findOne(
                {
                    discord_id: interaction.guild.id,
                    "claimed_characters.character_id": char._id
                },
                {
                    projection: {
                        _id: 0,
                        "claimed_characters.$": 1
                    }
                }
            );

            if (claimSearch) {
                owner_id = claimSearch.claimed_characters[0].member_discord_id;
            };
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