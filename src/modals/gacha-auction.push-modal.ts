import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, MessageFlags, ModalSubmitInteraction, SectionBuilder, TextDisplayBuilder, ThumbnailBuilder } from "discord.js";
import { Document, WithId } from "mongodb";
import ErrorEmbed from "../embeds/errorEmbed";
import Bot from "../extensions/bot.extension";
import Helpers from "../helpers";

module.exports = {
    id: 'gacha-auction-push-modal',
    execute: async (interaction: ModalSubmitInteraction, data: {
        key: string;
        character: WithId<Document>;
        base_price: number;
        characterUserId: string;
        users: Map<string, number>;
    }) => {
        if (!data) {
            return await interaction.reply({
                flags: [MessageFlags.Ephemeral],
                embeds: [new ErrorEmbed('Esta interacción ha expirado.')]
            });
        };

        (interaction.client as Bot).update(data.key, data, 120_000);

        const pushedPrice = interaction.fields.getTextInputValue('gacha-auction-push-modal-input');

        if (!Helpers.isNumber(pushedPrice)) {
            return await interaction.reply({
                flags: [MessageFlags.Ephemeral],
                embeds: [new ErrorEmbed('Has ingresado un dato invalido.')]
            });
        };

        if (Number(pushedPrice) < Number(data.base_price)) {
            return await interaction.reply({
                flags: [MessageFlags.Ephemeral],
                embeds: [new ErrorEmbed('¡Tu puja no puede ser menor al precio base!')]
            });
        };

        data.users.set(interaction.user.id, Number(pushedPrice));

        (interaction.client as Bot).update(data.key, data, 120_000);

        await interaction.reply({
            flags: [MessageFlags.IsComponentsV2],
            components: [
                new ContainerBuilder()
                    .setAccentColor(Helpers.getRandomRGBTuple())
                    .addSectionComponents(builder => {
                        builder 
                            .addTextDisplayComponents(
                                new TextDisplayBuilder()
                                    .setContent(
                                        `### ✋ <@${data.characterUserId}> ¡Hay una nueva puja!\n` +
                                        `<@${interaction.user.id}> ha ofertado la suma de:\n` +
                                        `### $${pushedPrice}\n` +
                                        `¿Deseas aceptar?`
                                    )
                            )

                        const avatar = interaction.user.avatarURL({ extension: 'png', size: 512 });

                        if (avatar) {
                            builder
                                .setThumbnailAccessory(
                                    new ThumbnailBuilder()
                                        .setURL(avatar)
                                )
                        };

                        return builder;
                    })
                    .addActionRowComponents(
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel('¡Aceptar!')
                                    .setEmoji('💰')
                                    .setStyle(ButtonStyle.Success)
                                    .setCustomId(`gacha-auction-accept-push-button_${data.key}_${interaction.user.id}`)
                            )
                    )
            ]
        });
    }
};