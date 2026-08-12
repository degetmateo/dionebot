import { ContainerBuilder, MessageFlags, SectionBuilder, TextDisplayBuilder, ThumbnailBuilder } from "discord.js";
import { Document, WithId } from "mongodb";
import GuildChatInputCommandInteraction from "../../../../extensions/guildChatInputCommandInteraction.extension";
import GenericError from "../../../../errors/genericError";
import Helpers from "../../../../helpers";
import mongo from "../../../../database/mongo";
import GachaTradeErrorComponent from "../../../../components/gacha-trade-error.component";
import { RGB_COLORS } from "../../../../static/rgb-colors";
import GachaTradeConfirmCardComponent from "../../../../components/gacha-trade-confirm-card.component";

export const gachaTradeSubcommand = async (interaction: GuildChatInputCommandInteraction) => {
    const optionsUser = interaction.options.getUser('user', true);

    if (interaction.user.id == optionsUser.id) {
        throw new GenericError('¡No puedes intercambiar personajes contigo mismo!');
    };

    const characterArgsA = interaction.options.getString('ca_name-or-id', true);
    const characterArgsB = interaction.options.getString('cb_name-or-id', true);

    let characterA: WithId<Document> | null = null;

    if (Helpers.isNumber(characterArgsA)) {
        characterA = await mongo.characters.findOne(
            {
                _id: Number(characterArgsA) as any
            }
        );

        if (!characterA) {
            throw new GenericError(`No hemos encontrado un personaje con ID: \`${characterArgsA}\`.`);
        };
    } else {
        characterA = await mongo.characters.findOne(
            {
                name: {
                    $regex: characterArgsA,
                    $options: 'i'
                }
            }
        );

        if (!characterA) {
            throw new GenericError(`No hemos encontrado un personaje llamado: \`${characterArgsA}\`.`);
        };
    };

    const claimA = await mongo.claims.findOne({
        guild_id: interaction.guild.id,
        user_id: interaction.user.id,
        character_id: characterA._id
    });

    if (!claimA) {
        return await interaction.reply({
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            components: [new GachaTradeErrorComponent(characterA.name, characterA.images[0].url)]
        });
    };

    let characterB: WithId<Document> | null = null;

    if (Helpers.isNumber(characterArgsB)) {
        characterB = await mongo.characters.findOne(
            {
                _id: Number(characterArgsB) as any
            }
        );

        if (!characterB) {
            throw new GenericError(`No hemos encontrado un personaje con ID: \`${characterArgsB}\`.`);
        };
    } else {
        characterB = await mongo.characters.findOne(
            {
                name: {
                    $regex: characterArgsB,
                    $options: 'i'
                }
            }
        );

        if (!characterB) {
            throw new GenericError(`No hemos encontrado un personaje llamado: \`${characterArgsB}\`.`);
        };
    };

    const claimB = await mongo.claims.findOne({
        guild_id: interaction.guild.id,
        user_id: optionsUser.id,
        character_id: characterB._id
    });

    if (!claimB) {
        const comp = (new ContainerBuilder()
            .setAccentColor(RGB_COLORS.RED)
            .addSectionComponents(
                (new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`¡<@${optionsUser.id}> no ha reclamado a \`${characterB.name}\` en este servidor!`)
                    )
                    .setThumbnailAccessory(
                        new ThumbnailBuilder()
                            .setURL(characterB.images[0].url)
                    )
                )
            )
        );

        return await interaction.reply({
            flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
            components: [comp]
        });
    };

    const id = interaction.client.set({
        optionsUser,
        characterA,
        characterB
    }, 30_000);

    const comp = new GachaTradeConfirmCardComponent({
        id,
        aCharacterName: characterA.name,
        bCharacterName: characterB.name,
        aCharacterImageURL: characterA.images[0].url,
        bCharacterImageURL: characterB.images[0].url
    });

    await interaction.reply({
        flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
        components: [comp]
    });
};