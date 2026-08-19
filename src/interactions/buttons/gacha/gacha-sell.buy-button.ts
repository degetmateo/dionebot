import { ButtonInteraction, ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageFlags, TextDisplayBuilder, User } from "discord.js";
import { Document, WithId } from "mongodb";
import ErrorEmbed from "../../../embeds/errorEmbed";
import Bot from "../../../bot/bot";
import mongo from "../../../database/mongo";
import GenericError from "../../../errors/genericError";
import Helpers from "../../../helpers";

module.exports = {
    id: 'gacha-sell-buy-button',
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

        if (interaction.user.id != data.optionsUser.id) {
            return;
        };

        (interaction.client as Bot).delete(data.key);

        await interaction.deferReply();

        const user = await mongo.users.findOne({ _id: data.optionsUser.id as any });
        
        if (!user) throw new GenericError();

        if (user.renas < data.price) {
            return await interaction.editReply({
                flags: [MessageFlags.IsComponentsV2],
                components: [
                    new TextDisplayBuilder()
                        .setContent('¡No tienes las renas necesarias para aceptar este trato!')
                ]
            });
        };

        await mongo.users.updateOne(
            {
                _id: data.optionsUser.id as any
            },
            {
                $inc: {
                    renas: -data.price
                }
            }
        );

        await mongo.users.updateOne(
            {
                _id: data.interactionUser.id as any
            },
            {
                $inc: {
                    renas: data.price
                }
            }
        );

        await mongo.claims.updateOne(
            {
                _id: data.claim._id
            },
            {
                $set: {
                    user_id: data.optionsUser.id
                }
            }
        );

        const component = new ContainerBuilder();

        component.setAccentColor(Helpers.getRandomRGBTuple());

        component.addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(`✅ <@${data.optionsUser.id}> ha comprado a \`${data.character.name}\` por \`${data.price} renas\`.`),
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

        await interaction.editReply({
            flags: [MessageFlags.IsComponentsV2],
            components: [component]
        });
    }
};