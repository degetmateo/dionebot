import { Document, Filter } from "mongodb";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder } from "discord.js";
import GuildChatInputCommandInteraction from "../../../../extensions/guildChatInputCommandInteraction.extension";
import Helpers from "../../../../helpers";
import mongo from "../../../../database/mongo";
import ErrorEmbed from "../../../../embeds/errorEmbed";

export const gachaAuctionSubcommand = async (interaction: GuildChatInputCommandInteraction) => {
    const args = interaction.options.getString('name-or-id', true);
    const basePrice = interaction.options.getNumber('base-price', true);

    const filter: Filter<Document> = {};
    
    if (Helpers.isNumber(args)) {
        filter._id = Number(args) as any;
    } else {
        filter.name = {
            $regex: args,
            $options: 'i'
        };
    };

    const character = await mongo.characters.findOne(filter);

    if (!character) {
        return await interaction.reply({
            flags: [MessageFlags.Ephemeral],
            embeds: [new ErrorEmbed(`No hemos encontrado ningún personaje con el criterio: \`${args}\`.`)]
        });
    };

    const claim = await mongo.claims.findOne({
        guild_id: interaction.guild.id,
        user_id: interaction.user.id,
        character_id: character._id
    });

    if (!claim) {
        return await interaction.reply({
            flags: [MessageFlags.Ephemeral],
            embeds: [new ErrorEmbed(`¡No has reclamado a \`${character.name}\`!`)]
        });
    };

    const key = interaction.client.set({
        character,
        base_price: basePrice
    }, 120_000);   

    await interaction.reply({
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        components: [
            new TextDisplayBuilder()
                .setContent(`## ¡Estás a punto de iniciar una subasta!`),
            new SeparatorBuilder()
                .setDivider(true)
                .setSpacing(SeparatorSpacingSize.Small),
            new TextDisplayBuilder()
                .setContent(`Iniciarás una subasta por \`${character.name}\` que comenzará en \`$${basePrice}\`.`),
            new TextDisplayBuilder()
                .setContent(`Cualquier usuario podrá pujar y tu deberás aceptar la puja que consideres adecuada.`),
            new TextDisplayBuilder()
                .setContent(`Cuando aceptes una puja; **se te acreditará el monto pujado y perderás al personaje**.`),
            new MediaGalleryBuilder()
                .addItems(
                    new MediaGalleryItemBuilder()
                        .setURL(character.images[0].url)
                ),
            new SeparatorBuilder()
                .setDivider(true)
                .setSpacing(SeparatorSpacingSize.Small),
            new TextDisplayBuilder()
                .setContent(`¿Estás seguro de que quieres realizar esta acción?`),
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('¡Comenzar subasta!')
                        .setStyle(ButtonStyle.Success)
                        .setCustomId(`gacha-auction-start-button_${key}`)
                )
        ]
    });
};