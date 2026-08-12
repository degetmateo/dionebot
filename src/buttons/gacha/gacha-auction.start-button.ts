import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageFlags, TextDisplayBuilder } from "discord.js";
import { Document, WithId } from "mongodb";
import ErrorEmbed from "../../embeds/errorEmbed";
import Bot from "../../extensions/bot.extension";
import Helpers from "../../helpers";

module.exports = {
    id: 'gacha-auction-start-button',
    execute: async (interaction: ButtonInteraction, data: {
        key: string;
        character: WithId<Document>;
        base_price: number;
    }) => {
        if (!data) {
            return await interaction.reply({
                flags: [MessageFlags.Ephemeral],
                embeds: [new ErrorEmbed('Esta interacción ha expirado.')]
            });
        };

        (interaction.client as Bot).delete(data.key);

        const key = (interaction.client as Bot).set({
            character: data.character,
            base_price: data.base_price,
            characterUserId: interaction.user.id,
            users: new Map<string, number>()
        }, 120_000);

        await interaction.reply({
            flags: [MessageFlags.IsComponentsV2],
            components: [
                new ContainerBuilder()
                    .setAccentColor(Helpers.getRandomRGBTuple())
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`### ¡Subasta por ${data.character.name}!`),
                        new TextDisplayBuilder()
                            .setContent(`<@${interaction.user.id}> ha iniciado una subasta por este personaje.`),
                        new TextDisplayBuilder()
                            .setContent(`Presiona el botón para pujar ¡y tal vez ganes!`)
                    )
                    .addMediaGalleryComponents(
                        new MediaGalleryBuilder()
                            .addItems(
                                new MediaGalleryItemBuilder()
                                    .setURL(data.character.images[0].url)
                            )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setEmoji('💰')
                                    .setLabel('¡Pujar!')
                                    .setStyle(ButtonStyle.Primary)
                                    .setCustomId(`gacha-auction-push-button_${key}`)
                            )
                    )
            ]
        });
    }
};