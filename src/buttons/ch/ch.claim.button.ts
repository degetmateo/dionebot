import { ButtonInteraction, Collection } from "discord.js";
import { ObjectId, UUID } from "mongodb";
import * as uuid from 'uuid';
import ErrorEmbed from "../../embeds/errorEmbed";
import Bot from "../../extensions/bot.extension";
import mongo from "../../database/mongo";
import SuccessEmbed from "../../embeds/successEmbed";
import claimCooldownHelper from "../../helpers/claim.cooldown.helper";
import { memberModel } from "../../database/models/member.model";

module.exports = {
    id: 'ch-claim-button',
    execute: async (interaction: ButtonInteraction, character: {
        key: string;
        _id: ObjectId;
        name: string;
        site_url: string;
        image_url: string;
    }) => {
        if (!character) {
            return await interaction.reply({
                flags: "Ephemeral",
                embeds: [new ErrorEmbed('Esta interacción ha expirado.')]
            });
        };

        const bot = interaction.client as Bot;
        bot.delete(character.key);

        claimCooldownHelper.execute(interaction);

        const guilds = mongo.collection('guilds');
        
        let guild = await guilds.findOne(
            { 
                discord_id: interaction.guild?.id
            }
        );

        if (!guild) {
            guild = {
                _id: new UUID(uuid.v7()) as any,
                discord_id: interaction.guild?.id,
                claimed_characters: []
            };
            await guilds.insertOne(guild);
        };

        const claimedCharacter: {
            character_id: ObjectId;
            member_discord_id: string;
        } = guild.claimed_characters.find((ch: any) => ch.character_id.toString() == character._id.toString());

        const members = mongo.collection('members');

        if (claimedCharacter) {
            members.updateOne(
                {
                    discord_id: claimedCharacter.member_discord_id
                },
                {
                    $inc: {
                        renas: 10
                    }
                }
            );

            return await interaction.reply({
                embeds: [new ErrorEmbed(`¡**${character.name}** ya pertenece a <@${claimedCharacter.member_discord_id}>!`)]
            });
        };

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