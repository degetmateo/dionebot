import { Document, WithId } from "mongodb";
import mongo from "../../../../database/mongo";
import GuildChatInputCommandInteraction from "../../../../extensions/guildChatInputCommandInteraction.extension";
import Helpers from "../../../../helpers";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageFlags, TextDisplayBuilder } from "discord.js";
import ErrorEmbed from "../../../../embeds/errorEmbed";

export const gachaSellSubcommand = async (interaction: GuildChatInputCommandInteraction) => {
    let args = interaction.options.getString('name-or-id', true);
    const optionsUser = interaction.options.getUser('user', true);
    const price = interaction.options.getNumber('price', true);

    if (price < 0) return;

    let character: WithId<Document> | null = null;

    if (Helpers.isNumber(args)) {
        character = await mongo.characters.findOne({ _id: Number(args) as any });
    } else {
        character = await mongo.characters.findOne({ name: { $regex: args, $options: 'i' } });
    };

    if (!character) {
        return await interaction.reply({
            flags: [MessageFlags.Ephemeral],
            embeds: [new ErrorEmbed('¡No encontramos al personaje ingresado!')]
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
            embeds: [new ErrorEmbed('¡No has reclamado al personaje ingresado!')]
        });
    };

    const memId = interaction.client.set({
        character,
        optionsUser,
        price,
        interactionUser: interaction.user,
        claim
    }, 60_000);

    const component = new ContainerBuilder();

    component.setAccentColor(Helpers.getRandomRGBTuple());

    component.addTextDisplayComponents(
        new TextDisplayBuilder()
            .setContent(`### 👀 ¡Vas a ofrecer a un personaje!`),
        new TextDisplayBuilder()
            .setContent(`Estás a punto de ofrecer a \`${character.name}\` por \`${price} renas\`.`),
        new TextDisplayBuilder()
            .setContent(`Ten en cuenta que <@${optionsUser.id}> podrá aceptar esta compra instantáneamente.`)
    );

    const image = character.images[0];

    if (image) {
        component.addMediaGalleryComponents(
            new MediaGalleryBuilder()
                .addItems(
                    new MediaGalleryItemBuilder()
                        .setURL(image.url)
                )
        );
    };

    component.addTextDisplayComponents(
        new TextDisplayBuilder()
            .setContent('### ¿Estás seguro de que quieres hacer esto?')
    );

    component.addActionRowComponents(
        new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`gacha-sell-confirm-button_${memId}`)
                    .setEmoji('✅')
                    .setLabel('Confirmar')
                    .setStyle(ButtonStyle.Success)
            )
    );

    await interaction.reply({
        flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
        components: [component]
    });
};