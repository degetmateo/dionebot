import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageFlags, TextDisplayBuilder, User } from "discord.js";
import { Document, WithId } from "mongodb";
import ErrorEmbed from "../../../embeds/errorEmbed";
import Bot from "../../../bot/bot";
import Helpers from "../../../helpers";

module.exports = {
    id: 'gacha-sell-confirm-button',
    execute: async (interaction: ButtonInteraction, data: {
        key: string;
        character: WithId<Document>;
        optionsUser: User;
        price: number;
        interactionUser: User;
        claim: WithId<Document>;
    }) => {
        if (!data) {
            return await interaction.reply({
                flags: [MessageFlags.Ephemeral],
                embeds: [new ErrorEmbed('Esta interacción ha expirado.')]
            });
        };

        if (interaction.user.id != data.interactionUser.id) {
            return;
        };

        (interaction.client as Bot).delete(data.key);
    
        const memId = (interaction.client as Bot).set({
            character: data.character,
            price: data.price,
            optionsUser: data.optionsUser,
            interactionUser: data.interactionUser,
            claim: data.claim
        }, 60_000);

        const component = new ContainerBuilder();

        component.setAccentColor(Helpers.getRandomRGBTuple());

        component.addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(`### <@${data.optionsUser.id}> ¡Te han ofrecido un personaje!`),
            new TextDisplayBuilder()
                .setContent(`<@${data.interactionUser.id}> te ha ofrecido a \`${data.character.name}\` a cambio de \`${data.price} renas\`.`),
        );

        const image = data.character.images[0];

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
                .setContent(`### ¿Quieres aceptarlo?`),
        );

        component.addActionRowComponents(
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Aceptar')
                        .setEmoji('✅')
                        .setStyle(ButtonStyle.Success)
                        .setCustomId(`gacha-sell-buy-button_${memId}`)
                )
        );

        await interaction.reply({
            flags: [MessageFlags.IsComponentsV2],
            components: [component]
        });
    }
};