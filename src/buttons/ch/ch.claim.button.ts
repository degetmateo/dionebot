import { ButtonInteraction } from "discord.js";
import { ObjectId} from "mongodb";
import ErrorEmbed from "../../embeds/errorEmbed";
import Bot from "../../extensions/bot.extension";
import mongo from "../../database/mongo";
import SuccessEmbed from "../../embeds/successEmbed";
import claimCooldownHelper from "../../helpers/claim.cooldown.helper";
import { memberModel } from "../../database/models/member.model";
import guildsRepository from "../../repositories/guilds/guilds.repository";

module.exports = {
    id: 'ch-claim-button',
    execute: async (interaction: ButtonInteraction, character: {
        key: string;
        _id: ObjectId;
        name: string;
        site_url: string;
        image_url: string;
        owner_id: string | null;
    }) => {
        if (!character) {
            return await interaction.reply({
                flags: "Ephemeral",
                embeds: [new ErrorEmbed('Esta interacción ha expirado.')]
            });
        };

        const bot = interaction.client as Bot;
        bot.delete(character.key);

        const guilds = mongo.collection('guilds');
        const members = mongo.collection('members');

        if (character.owner_id) {
            const renas = bot.settings.renas_per_reclaim;
            members.updateOne(
                {
                    discord_id: character.owner_id
                },
                {
                    $inc: {
                        renas: renas
                    }
                }
            );

            return await interaction.reply({
                embeds: [new ErrorEmbed(`¡**${character.name}** ya pertenece a <@${character.owner_id}>! \`(+${renas} renas)\``)]
            });
        };

        claimCooldownHelper.execute(interaction);

        const guild = await guildsRepository.findsert(interaction.guild?.id as string);

        await guilds.updateOne(
            {
                _id: guild._id
            },
            {
                $push: {
                    claimed_characters: {
                        character_id: character._id,
                        member_discord_id: interaction.user.id
                    } as any
                }
            }
        );

        interaction.reply({
            embeds: [new SuccessEmbed(`¡<@${interaction.user.id}> ha reclamado a **${character.name}**!`)]
        });

        const procedure = async () => {
            let member = await members.findOne({ discord_id: interaction.user.id });

            if (!member) {
                member = memberModel.create(interaction.user.id, interaction.guild?.id as string);
                await members.insertOne(member);
            };

            members.updateOne(
                { 
                    discord_id: interaction.user.id
                },
                {
                    $inc: {
                        claimed_characters_count: 1
                    }
                }
            );

            const characters = mongo.collection('characters');
            characters.updateOne(
                { 
                    _id: character._id
                },
                {
                    $inc: {
                        claimed_count: 1
                    }
                }
            );
        };

        procedure();
    }
};