import { InteractionContextType, MessageFlags, SlashCommandBuilder, User } from "discord.js";
import GenericError from "../../errors/genericError";
import mongo from "../../database/mongo";
import Helpers from "../../helpers";
import AffinityEmbed from "../../embeds/affinityEmbed";
import guildsRepository from "../../repositories/guilds/guilds.repository";
import GuildChatInputCommandInteraction from "../../extensions/guildChatInputCommandInteraction.extension";
import anilist from "../../apis/anilist/anilist";
import ErrorEmbed from "../../embeds/errorEmbed";
import { MediaEntry } from "../../apis/anilist/types";

const execute = async (interaction: GuildChatInputCommandInteraction) => {
    const userOptionA = interaction.options.getUser('member', true);
    const userOptionB = interaction.options.getUser('member-b', false) || interaction.user;
    
    if (userOptionA.id == userOptionB.id) {
        return await interaction.reply({
            flags: [MessageFlags.Ephemeral],            
            embeds: [new ErrorEmbed('No puedes calcular la afinidad contigo mismo.')]
        });
    };

    await interaction.deferReply();

    const memberB = await mongo.users.findOne({
        $and: [
            { 
                _id: userOptionB.id as any
            }, 
            { 
                anilist: { $ne: null }
            }
        ]
    });

    if (!memberB) { 
        if(userOptionB.id === interaction.user.id) {
            throw new GenericError('No estás registrado o no registraste tu \`ANILIST\`. 💔');
        } else {
            throw new GenericError(`<@${userOptionB.id}> no está registrado o no registró su \`ANILIST\`. 💔`);
        };
    };

    const memberA = await mongo.users.findOne({
        $and: [
            { 
                _id: userOptionA.id as any
            }, 
            { 
                anilist: { $ne: null }
            }
        ]
    });
    
    if (!memberA) throw new GenericError(`<@${userOptionA.id}> no está registrado o no registró su \`ANILIST\`. 💔`);

    const data = await anilist.search.entries(memberB.anilist.id, memberA.anilist.id);

    const interactionUserAnime: Array<MediaEntry> = data.u1_anime.lists[0].entries;
    const interactionUserManga: Array<MediaEntry> = data.u1_manga.lists[0].entries;

    const optionsUserAnime: Array<MediaEntry> = data.u2_anime.lists[0].entries;
    const optionsUserManga: Array<MediaEntry> = data.u2_manga.lists[0].entries;

    const interactionUserMedia = [...interactionUserAnime, ...interactionUserManga];
    const optionsUserMedia = [...optionsUserAnime, ...optionsUserManga];

    const pearson = Helpers.pearson(interactionUserMedia, optionsUserMedia);

    await interaction.editReply({
        embeds: [new AffinityEmbed({ 
            affinity: pearson, 
            userAId: userOptionA.id, 
            userBId: userOptionB.id 
        })]
    });

    guildsRepository.update.affinityTop(interaction.guild.id, {
        pearson: pearson,
        pair: {
            a: { discord_id: userOptionA.id },
            b: { discord_id: userOptionB.id }
        }
    });
};

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('affinity')
        .setDescription('Affinity between two users!')
        .setDescriptionLocalization('es-ES', '¡La afinidad entre dos usuarios!')
        .setDescriptionLocalization('es-419', '¡La afinidad entre dos usuarios!')
        .setContexts(InteractionContextType.Guild)
        .setNSFW(false)
        .addUserOption(option => {
            return option
                .setName('member')
                .setDescription('The member you want to calculate the affinity.')
                .setRequired(true)
        })
        .addUserOption(option => {
            return option
                .setName('member-b')
                .setDescription('Another member (optional).')
                .setRequired(false)
        }),
    execute: execute
};